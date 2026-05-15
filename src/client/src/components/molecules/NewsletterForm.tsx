import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // todo: remove mock functionality - integrate with actual newsletter service
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Subscribed!',
      description: 'Thanks for subscribing to the newsletter.',
    });
    
    setEmail('');
    setIsLoading(false);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex gap-2 w-full max-w-md"
      data-testid="form-newsletter"
    >
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1"
        data-testid="input-newsletter-email"
      />
      <Button type="submit" disabled={isLoading} data-testid="button-newsletter-submit">
        {isLoading ? (
          <span className="animate-spin">...</span>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Subscribe
          </>
        )}
      </Button>
    </form>
  );
}
