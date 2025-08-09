import { Celebrity } from '../types/game';
import { formatBirthday, calculateZodiacSign } from '../data/zodiac';

interface FeedbackScreenProps {
  celebrity: Celebrity;
  isCorrect: boolean;
  selectedZodiac: string;
  correctZodiac: string;
  score: number;
}

export const FeedbackScreen = ({ 
  celebrity, 
  isCorrect, 
  selectedZodiac, 
  correctZodiac, 
  score 
}: FeedbackScreenProps) => {
  const zodiacSign = calculateZodiacSign(celebrity.birthday);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* Result Icon */}
        <div className="text-8xl mb-6 floating-animation">
          {isCorrect ? '🎉' : '😅'}
        </div>

        {/* Result Message */}
        <h2 className={`text-4xl font-bold mb-4 ${
          isCorrect ? 'text-success' : 'text-destructive'
        }`}>
          {isCorrect ? 'Correct!' : 'Not quite!'}
        </h2>

        {/* Celebrity Info */}
        <div className="celebrity-card mb-6">
          <h3 className="text-2xl font-bold gradient-text mb-4">
            {celebrity.name}
          </h3>
          
          <div className="text-lg space-y-2">
            <p className="text-foreground">
              <span className="text-muted-foreground">Birthday:</span>{' '}
              {formatBirthday(celebrity.birthday)}
            </p>
            
            <p className="text-foreground">
              <span className="text-muted-foreground">Zodiac Sign:</span>{' '}
              <span className="font-bold">
                {zodiacSign.symbol} {correctZodiac}
              </span>
            </p>

            {!isCorrect && selectedZodiac !== 'Time\'s up!' && (
              <p className="text-muted-foreground">
                You guessed: {selectedZodiac}
              </p>
            )}
          </div>
        </div>

        {/* Score Update */}
        <div className="bg-card/50 backdrop-blur-lg rounded-xl p-6 border border-card-border">
          <div className="text-muted-foreground mb-2">Current Score</div>
          <div className="text-3xl font-bold gradient-text">
            {score} points
          </div>
          {isCorrect && (
            <div className="text-success mt-2">+20 points!</div>
          )}
        </div>

        {/* Auto-advance indicator */}
        <div className="mt-8 text-muted-foreground text-sm">
          Next round starting in a moment...
        </div>
      </div>
    </div>
  );
};