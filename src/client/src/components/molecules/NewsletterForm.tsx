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
      className="flex gap-2 w-full max-w-sm"
      data-testid="form-newsletter"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="newsletter-email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        required
        className="flex-1 h-9 text-sm"
        data-testid="input-newsletter-email"
      />
      <Button type="submit" size="sm" disabled={isLoading} data-testid="button-newsletter-submit">
        {isLoading ? (
          <span className="animate-spin">...</span>
        ) : (
          <>
            <Send className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
            Subscribe
          </>
        )}
      </Button>
    </form>
  );
}
