import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (!error) {
        navigate('/');
      }
    } else {
      if (!name.trim()) {
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, name);
      if (!error) {
        // User needs to confirm email before they can sign in
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[hsl(195_55%_90%)] opacity-40 blur-[120px] animate-float" style={{ animationDuration: '25s', animationDelay: '0s' }} />
        <div className="absolute top-0 right-0 w-[550px] h-[650px] rounded-full bg-[hsl(280_45%_88%)] opacity-35 blur-[120px] animate-float" style={{ animationDuration: '30s', animationDelay: '3s' }} />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[hsl(345_65%_88%)] opacity-45 blur-[120px] animate-float" style={{ animationDuration: '28s', animationDelay: '5s' }} />
      </div>

      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Coffee className="w-12 h-12 text-primary mb-2" />
          <CardTitle className="text-2xl font-sail">Brewly</CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
