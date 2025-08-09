import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BuyMeCoffee } from './BuyMeCoffee';

interface GameOverScreenProps {
  score: number;
  totalPossible: number;
  grade: string;
  username: string;
  onPlayAgain: () => void;
  onShowLeaderboard: () => void;
  onSaveScore: () => void;
}

export const GameOverScreen = ({ 
  score, 
  totalPossible, 
  grade, 
  username, 
  onPlayAgain, 
  onShowLeaderboard,
  onSaveScore 
}: GameOverScreenProps) => {
  const percentage = Math.round((score / totalPossible) * 100);
  
  const getGradeMessage = (grade: string): string => {
    const messages: Record<string, string> = {
      'A+': 'Cosmic Genius! ⭐',
      'A': 'Stellar Performance! 🌟',
      'B+': 'Great Job! 🎯',
      'B': 'Well Done! 👏',
      'C+': 'Good Effort! 💪',
      'C': 'Keep Practicing! 📚',
      'D': 'Room for Improvement! 🎯',
      'F': 'Try Again! 🔥'
    };
    return messages[grade] || 'Keep Going!';
  };

  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return 'text-success';
    if (grade.startsWith('B')) return 'text-primary';
    if (grade.startsWith('C')) return 'text-secondary';
    return 'text-destructive';
  };

  // Auto-save score when component mounts
  useEffect(() => {
    onSaveScore();
  }, [onSaveScore]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-2xl w-full">
        {/* Trophy/Result Icon */}
        <div className="text-8xl mb-6 floating-animation">
          {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : percentage >= 40 ? '🥉' : '⭐'}
        </div>

        {/* Game Over Title */}
        <h1 className="text-5xl font-bold gradient-text mb-4">
          Game Complete!
        </h1>

        <p className="text-xl text-muted-foreground mb-8">
          Great job, {username}!
        </p>

        {/* Score Card */}
        <div className="celebrity-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold gradient-text mb-2">
                {score}
              </div>
              <div className="text-muted-foreground">Total Score</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {percentage}%
              </div>
              <div className="text-muted-foreground">Accuracy</div>
            </div>
            
            <div>
              <div className={`text-3xl font-bold mb-2 ${getGradeColor(grade)}`}>
                {grade}
              </div>
              <div className="text-muted-foreground">Grade</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-card-border">
            <div className={`text-xl font-medium ${getGradeColor(grade)}`}>
              {getGradeMessage(grade)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={onPlayAgain}
            className="w-full btn-primary text-lg py-3"
          >
            Play Again ⭐
          </Button>
          
          <Button 
            onClick={onShowLeaderboard}
            className="w-full btn-secondary text-lg py-3"
          >
            View Leaderboard 🏆
          </Button>
        </div>

        {/* Buy Me Coffee */}
        <div className="mt-6">
          <BuyMeCoffee />
        </div>

        {/* Score Saved Indicator */}
        <div className="mt-4 text-sm text-muted-foreground">
          Your score has been saved to the leaderboard!
        </div>
      </div>
    </div>
  );
};