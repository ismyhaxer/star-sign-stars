import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => boolean;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('Please enter both username and password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20"></div>
      
      <Card className="relative w-full max-w-md p-8 backdrop-blur-lg border-card-border">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 floating-animation">⭐</div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Celebrity Zodiac
          </h1>
          <p className="text-muted-foreground">
            Guess the zodiac signs of your favorite celebrities!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-card/50 border-card-border"
            />
          </div>
          
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card/50 border-card-border"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <Button 
            type="submit" 
            className="w-full btn-primary text-lg py-3"
          >
            Enter the Cosmic Game
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Enter any username and password to start
        </div>
      </Card>
    </div>
  );
};