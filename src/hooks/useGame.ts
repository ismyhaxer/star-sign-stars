import { useState, useCallback, useEffect } from 'react';
import { GameState, Celebrity, CelebrityCategory, LeaderboardEntry } from '../types/game';
import { getRandomCelebrities } from '../data/celebrities';
import { calculateZodiacSign } from '../data/zodiac';
import { useSounds } from './useSounds';

const ROUNDS_PER_GAME = 5;
const POINTS_PER_CORRECT = 20;
const ROUND_TIME = 30; // seconds

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    score: 0,
    selectedCategory: null,
    currentCelebrity: null,
    gamePhase: 'login',
    timeLeft: ROUND_TIME,
    isAnswered: false,
    lastAnswer: null,
    usedCelebrities: []
  });

  const [username, setUsername] = useState<string>('');
  const { playTick, playCritical, playCorrect, playIncorrect, playSelect, playGameOver } = useSounds();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.gamePhase === 'quiz' && gameState.timeLeft > 0 && !gameState.isAnswered) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            // Time's up - auto advance
            playIncorrect();
            return {
              ...prev,
              timeLeft: 0,
              isAnswered: true,
              lastAnswer: {
                correct: false,
                selectedZodiac: 'Time\'s up!',
                correctZodiac: calculateZodiacSign(prev.currentCelebrity!.birthday).name
              }
            };
          }
          // Play tick sound for last 10 seconds
          if (prev.timeLeft <= 10) {
            if (prev.timeLeft <= 5) {
              playCritical();
            } else {
              playTick();
            }
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState.gamePhase, gameState.timeLeft, gameState.isAnswered]);

  // Auto-advance after feedback
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (gameState.gamePhase === 'feedback') {
      timeout = setTimeout(() => {
        if (gameState.currentRound >= ROUNDS_PER_GAME) {
          // Game over
          playGameOver();
          setGameState(prev => ({ ...prev, gamePhase: 'game-over' }));
        } else {
          // Next round
          nextRound();
        }
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [gameState.gamePhase]);

  const login = useCallback((user: string, pass: string) => {
    const users = JSON.parse(localStorage.getItem('zodiac-users') || '{}');
    if (users[user] && users[user] === pass) {
      const lastPlayed = localStorage.getItem(`zodiac-lastplayed-${user}`);
      const now = Date.now();
      
      if (lastPlayed && (now - parseInt(lastPlayed)) < 12 * 60 * 60 * 1000) {
        const hoursLeft = Math.ceil((12 * 60 * 60 * 1000 - (now - parseInt(lastPlayed))) / (60 * 60 * 1000));
        return { success: false, error: `You can play again in ${hoursLeft} hours. Come back later!` };
      }
      
      setUsername(user);
      setGameState(prev => ({ ...prev, gamePhase: 'category-selection' }));
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  }, []);

  const signup = useCallback((user: string, pass: string) => {
    const users = JSON.parse(localStorage.getItem('zodiac-users') || '{}');
    if (users[user]) {
      return { success: false, error: 'Username already taken. Please choose a different one.' };
    }
    users[user] = pass;
    localStorage.setItem('zodiac-users', JSON.stringify(users));
    setUsername(user);
    setGameState(prev => ({ ...prev, gamePhase: 'category-selection' }));
    return { success: true };
  }, []);

  const selectCategory = useCallback((category: CelebrityCategory) => {
    playSelect();
    const celebrities = getRandomCelebrities(category, ROUNDS_PER_GAME);
    setGameState(prev => ({
      ...prev,
      selectedCategory: category,
      gamePhase: 'quiz',
      currentRound: 1,
      currentCelebrity: celebrities[0],
      usedCelebrities: celebrities,
      timeLeft: ROUND_TIME,
      isAnswered: false
    }));
  }, [playSelect]);

  const answerQuestion = useCallback((selectedZodiac: string) => {
    if (gameState.isAnswered || !gameState.currentCelebrity) return;

    const correctZodiac = calculateZodiacSign(gameState.currentCelebrity.birthday);
    const isCorrect = selectedZodiac === correctZodiac.name;
    
    // Play sound based on correctness
    if (isCorrect) {
      playCorrect();
    } else {
      playIncorrect();
    }
    
    setGameState(prev => ({
      ...prev,
      isAnswered: true,
      score: isCorrect ? prev.score + POINTS_PER_CORRECT : prev.score,
      lastAnswer: {
        correct: isCorrect,
        selectedZodiac,
        correctZodiac: correctZodiac.name
      },
      gamePhase: 'feedback'
    }));
  }, [gameState.isAnswered, gameState.currentCelebrity, playCorrect, playIncorrect]);

  const nextRound = useCallback(() => {
    setGameState(prev => {
      const nextRoundNum = prev.currentRound + 1;
      const nextCelebrity = prev.usedCelebrities[nextRoundNum - 1];
      
      return {
        ...prev,
        currentRound: nextRoundNum,
        currentCelebrity: nextCelebrity,
        gamePhase: 'quiz',
        timeLeft: ROUND_TIME,
        isAnswered: false,
        lastAnswer: null
      };
    });
  }, []);

  const calculateGrade = useCallback((score: number): string => {
    const percentage = (score / (ROUNDS_PER_GAME * POINTS_PER_CORRECT)) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 30) return 'D';
    return 'F';
  }, []);

  const saveScore = useCallback(() => {
    const percentage = (gameState.score / (ROUNDS_PER_GAME * POINTS_PER_CORRECT)) * 100;
    const grade = calculateGrade(gameState.score);
    
    // Update cumulative score for user
    const leaderboard = JSON.parse(localStorage.getItem('zodiac-leaderboard') || '[]');
    const existingUserIndex = leaderboard.findIndex((entry: LeaderboardEntry) => entry.username === username);
    
    if (existingUserIndex >= 0) {
      // Add to existing user's score
      leaderboard[existingUserIndex].score += gameState.score;
      leaderboard[existingUserIndex].percentage = Math.round((leaderboard[existingUserIndex].score / ((leaderboard[existingUserIndex].score / gameState.score) * ROUNDS_PER_GAME * POINTS_PER_CORRECT)) * 100);
      leaderboard[existingUserIndex].grade = calculateGrade(leaderboard[existingUserIndex].score);
      leaderboard[existingUserIndex].date = new Date().toISOString();
    } else {
      // Create new entry
      const entry: LeaderboardEntry = {
        username,
        score: gameState.score,
        percentage: Math.round(percentage),
        date: new Date().toISOString(),
        grade
      };
      leaderboard.push(entry);
    }

    // Sort and save
    leaderboard.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);
    localStorage.setItem('zodiac-leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
    
    // Record play time to enforce 12-hour limit
    localStorage.setItem(`zodiac-lastplayed-${username}`, Date.now().toString());
  }, [gameState.score, username, calculateGrade]);

  const resetGame = useCallback(() => {
    playSelect();
    setGameState({
      currentRound: 0,
      score: 0,
      selectedCategory: null,
      currentCelebrity: null,
      gamePhase: 'category-selection',
      timeLeft: ROUND_TIME,
      isAnswered: false,
      lastAnswer: null,
      usedCelebrities: []
    });
  }, [playSelect]);

  const exitGame = useCallback(() => {
    playSelect();
    setGameState(prev => ({
      ...prev,
      gamePhase: 'category-selection',
      currentRound: 0,
      score: 0,
      selectedCategory: null,
      currentCelebrity: null,
      timeLeft: ROUND_TIME,
      isAnswered: false,
      lastAnswer: null,
      usedCelebrities: []
    }));
  }, [playSelect]);

  const showLeaderboard = useCallback(() => {
    playSelect();
    setGameState(prev => ({ ...prev, gamePhase: 'leaderboard' }));
  }, [playSelect]);

  return {
    gameState,
    username,
    login,
    signup,
    selectCategory,
    answerQuestion,
    calculateGrade,
    saveScore,
    resetGame,
    exitGame,
    showLeaderboard,
    ROUNDS_PER_GAME,
    POINTS_PER_CORRECT
  };
};