import { CelebrityCategory } from '../types/game';

interface CategorySelectionProps {
  onSelectCategory: (category: CelebrityCategory) => void;
  username: string;
}

const categories = [
  { id: 'actors' as CelebrityCategory, name: 'Actors', emoji: '🎭', gradient: 'from-primary to-primary-glow' },
  { id: 'singers' as CelebrityCategory, name: 'Singers', emoji: '🎤', gradient: 'from-secondary to-secondary-glow' },
  { id: 'footballers' as CelebrityCategory, name: 'Footballers', emoji: '⚽', gradient: 'from-accent to-accent-glow' },
  { id: 'basketball' as CelebrityCategory, name: 'Basketball', emoji: '🏀', gradient: 'from-fire to-orange-400' },
  { id: 'wwe' as CelebrityCategory, name: 'WWE', emoji: '🤼', gradient: 'from-earth to-green-400' },
  { id: 'ufc' as CelebrityCategory, name: 'UFC', emoji: '🥊', gradient: 'from-water to-cyan-400' }
];

export const CategorySelection = ({ onSelectCategory, username }: CategorySelectionProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold gradient-text mb-4">
          Welcome, {username}! ⭐
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Choose your celebrity category
        </p>
        <p className="text-muted-foreground">
          5 rounds • 30 seconds each • 20 points per correct answer
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="category-card group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`}></div>
            
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4 floating-animation">
                {category.emoji}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {category.name}
              </h3>
              <p className="text-muted-foreground">
                Guess the zodiac signs
              </p>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient} rounded-b-2xl opacity-60`}></div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Click any category to start your cosmic journey!
      </div>
    </div>
  );
};