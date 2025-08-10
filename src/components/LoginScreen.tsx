import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useSounds } from '@/hooks/useSounds';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => { success: boolean; error?: string };
  onSignup: (username: string, password: string) => { success: boolean; error?: string };
}

export const LoginScreen = ({ onLogin, onSignup }: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const { playSelect, playIncorrect } = useSounds();

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSelect();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      playIncorrect();
      return;
    }

    if (isSignup) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        playIncorrect();
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        playIncorrect();
        return;
      }
      
      const result = onSignup(username, password);
      if (!result.success) {
        setError(result.error || 'Signup failed');
        playIncorrect();
      }
    } else {
      const result = onLogin(username, password);
      if (!result.success) {
        setError(result.error || 'Login failed');
        playIncorrect();
      }
    }
  };

  const toggleMode = () => {
    playSelect();
    setIsSignup(!isSignup);
    setError('');
    setConfirmPassword('');
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

          {isSignup && (
            <>
              <div className="text-xs text-muted-foreground mb-2">
                Password must contain: 8+ characters, uppercase, lowercase, number, and special character
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-card/50 border-card-border"
                />
              </div>
            </>
          )}

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <Button 
            type="submit" 
            className="w-full btn-primary text-lg py-3"
          >
            {isSignup ? 'Create Cosmic Account' : 'Enter the Cosmic Game'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button 
            type="button"
            onClick={toggleMode}
            className="text-sm text-muted-foreground hover:text-primary transition-colors bg-transparent border-0 p-0 h-auto"
          >
            {isSignup ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
          </Button>
        </div>
      </Card>
    </div>
  );
};