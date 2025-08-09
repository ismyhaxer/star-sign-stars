import { useGame } from '../hooks/useGame';
import { LoginScreen } from '../components/LoginScreen';
import { CategorySelection } from '../components/CategorySelection';
import { QuizScreen } from '../components/QuizScreen';
import { FeedbackScreen } from '../components/FeedbackScreen';
import { GameOverScreen } from '../components/GameOverScreen';
import { Leaderboard } from '../components/Leaderboard';

const Index = () => {
  const {
    gameState,
    username,
    login,
    selectCategory,
    answerQuestion,
    calculateGrade,
    saveScore,
    resetGame,
    showLeaderboard,
    ROUNDS_PER_GAME,
    POINTS_PER_CORRECT
  } = useGame();

  const renderCurrentScreen = () => {
    switch (gameState.gamePhase) {
      case 'login':
        return <LoginScreen onLogin={login} />;
        
      case 'category-selection':
        return (
          <CategorySelection 
            onSelectCategory={selectCategory}
            username={username}
          />
        );
        
      case 'quiz':
        return (
          <QuizScreen
            celebrity={gameState.currentCelebrity!}
            currentRound={gameState.currentRound}
            totalRounds={ROUNDS_PER_GAME}
            timeLeft={gameState.timeLeft}
            score={gameState.score}
            onAnswer={answerQuestion}
            isAnswered={gameState.isAnswered}
          />
        );
        
      case 'feedback':
        return (
          <FeedbackScreen
            celebrity={gameState.currentCelebrity!}
            isCorrect={gameState.lastAnswer!.correct}
            selectedZodiac={gameState.lastAnswer!.selectedZodiac}
            correctZodiac={gameState.lastAnswer!.correctZodiac}
            score={gameState.score}
          />
        );
        
      case 'game-over':
        return (
          <GameOverScreen
            score={gameState.score}
            totalPossible={ROUNDS_PER_GAME * POINTS_PER_CORRECT}
            grade={calculateGrade(gameState.score)}
            username={username}
            onPlayAgain={resetGame}
            onShowLeaderboard={showLeaderboard}
            onSaveScore={saveScore}
          />
        );
        
      case 'leaderboard':
        return <Leaderboard onBack={resetGame} />;
        
      default:
        return <LoginScreen onLogin={login} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentScreen()}
    </div>
  );
};

export default Index;
