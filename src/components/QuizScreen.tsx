import { Celebrity } from '../types/game';
import { zodiacSigns } from '../data/zodiac';
import { useWikipediaImage } from '../hooks/useWikipediaImage';

interface QuizScreenProps {
  celebrity: Celebrity;
  currentRound: number;
  totalRounds: number;
  timeLeft: number;
  score: number;
  onAnswer: (zodiac: string) => void;
  onExit: () => void;
  isAnswered: boolean;
}

const getCategoryEmoji = (category: string): string => {
  const emojis: Record<string, string> = {
    actors: '🎭',
    singers: '🎤',
    footballers: '⚽',
    basketball: '🏀',
    wwe: '🤼',
    ufc: '🥊'
  };
  return emojis[category] || '⭐';
};

export const QuizScreen = ({ 
  celebrity, 
  currentRound, 
  totalRounds, 
  timeLeft, 
  score, 
  onAnswer, 
  onExit,
  isAnswered 
}: QuizScreenProps) => {
  const { imageUrl, isLoading, error } = useWikipediaImage(celebrity.name);

  const getTimerColor = () => {
    if (timeLeft > 20) return 'text-success';
    if (timeLeft > 10) return 'text-secondary';
    return 'text-destructive timer-critical';
  };

  const getTimerProgress = () => {
    return (timeLeft / 30) * 100;
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-left">
          <div className="text-sm text-muted-foreground">Round {currentRound} of {totalRounds}</div>
          <div className="text-2xl font-bold gradient-text">Score: {score}</div>
        </div>
        
        <div className="text-center">
          <div className={`text-4xl font-bold ${getTimerColor()}`}>
            {timeLeft}s
          </div>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                timeLeft > 10 ? 'bg-success' : 'bg-destructive'
              }`}
              style={{ width: `${getTimerProgress()}%` }}
            ></div>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={onExit}
            className="px-4 py-2 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive/30 transition-colors text-sm"
          >
            Exit Game
          </button>
          <div className="text-xs text-muted-foreground mt-1">
            (Points won't be saved)
          </div>
        </div>
      </div>

      {/* Celebrity Card */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <div className="celebrity-card w-full max-w-2xl mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Image */}
            <div className="w-48 h-48 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
              {isLoading ? (
                <div className="animate-pulse text-4xl">⭐</div>
              ) : imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={celebrity.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    (e.currentTarget as HTMLElement).style.display = 'none';
                    ((e.currentTarget.nextElementSibling as HTMLElement)!).style.display = 'flex';
                  }}
                />
              ) : (
                <div className="text-6xl">{getCategoryEmoji(celebrity.category)}</div>
              )}
              
              {/* Fallback emoji */}
              <div className="w-full h-full items-center justify-center text-6xl hidden">
                {getCategoryEmoji(celebrity.category)}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold gradient-text mb-4">
                {celebrity.name}
              </h2>
              <div className="space-y-2">
                {celebrity.achievements.map((achievement, index) => (
                  <div key={index} className="text-muted-foreground">
                    • {achievement}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            What's their zodiac sign?
          </h3>
          <p className="text-muted-foreground">
            Choose the correct zodiac sign for {celebrity.name}
          </p>
        </div>

        {/* Zodiac Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl w-full">
          {zodiacSigns.map((sign) => (
            <div
              key={sign.name}
              onClick={() => !isAnswered && onAnswer(sign.name)}
              className={`zodiac-card ${sign.element} ${
                isAnswered ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="text-3xl mb-2">{sign.symbol}</div>
              <div className="font-medium text-sm">{sign.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};