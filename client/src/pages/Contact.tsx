import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { SocialCard } from '@/components/molecules/SocialCard';
import { Send, Mail, MapPin } from 'lucide-react';
import { submitContactForm } from '@/lib/api';
import type { ProfileInfo, SocialLink } from '@/types/blog';

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const { data: profile } = useQuery<ProfileInfo>({
    queryKey: ['/api/profile'],
    staleTime: 5 * 60 * 1000,
  });

  const { data: socialLinks, isLoading } = useQuery<SocialLink[]>({
    queryKey: ['/api/socials'],
    staleTime: 5 * 60 * 1000,
  });

  const contactMutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      toast({
        title: 'Message Sent!',
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLoading) {
    return (
      <article className="py-8 md:py-12 px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="h-96" />
            <div className="space-y-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="py-8 md:py-12 px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-contact-title">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground">
            Have a question or want to work together? I'd love to hear from you.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>
                Fill out the form below and I'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-contact">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      placeholder="Your name" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="your@email.com" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                      data-testid="input-contact-email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    name="subject"
                    placeholder="What's this about?" 
                    required 
                    value={formData.subject}
                    onChange={handleChange}
                    data-testid="input-contact-subject"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message..."
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    data-testid="input-contact-message"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={contactMutation.isPending}
                  className="w-full"
                  data-testid="button-contact-submit"
                >
                  {contactMutation.isPending ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {profile?.email && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-muted">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <a 
                          href={`mailto:${profile.email}`}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          data-testid="link-contact-email"
                        >
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-muted">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{profile.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {socialLinks && socialLinks.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Connect on Social</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {socialLinks.map((link) => (
                    <SocialCard
                      key={link.platform}
                      platform={link.platform}
                      handle={link.handle}
                      url={link.url}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
