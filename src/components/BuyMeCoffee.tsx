import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const BuyMeCoffee = () => {
  const handleDonate = () => {
    window.open('https://buymeacoffee.com/your-username', '_blank');
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-accent/10 to-secondary/10 border-accent/20">
      <div className="text-center">
        <div className="text-4xl mb-3">☕</div>
        <h3 className="text-lg font-bold gradient-text mb-2">
          Enjoying the game?
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Support the developer and help create more cosmic fun!
        </p>
        <Button 
          onClick={handleDonate}
          className="btn-accent text-sm px-6 py-2"
        >
          Buy Me a Coffee ☕
        </Button>
      </div>
    </Card>
  );
};