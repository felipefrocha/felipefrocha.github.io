import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { SocialCard } from '@/components/molecules/SocialCard';
import { SEO } from '@/components/atoms/SEO';
import { Send, Mail, MapPin } from 'lucide-react';
import { submitContactForm, fetchProfile, fetchSocials } from '@/lib/api';
import type { ProfileInfo, BlogPost, SocialLink, Project } from '@shared/schema';

export default function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const { data: profile } = useQuery<ProfileInfo>({
    queryKey: ['/api/profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  });

  const { data: socialLinks, isLoading } = useQuery<SocialLink[]>({
    queryKey: ['/api/socials'],
    queryFn: fetchSocials,
    staleTime: 5 * 60 * 1000,
  });

  const contactMutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      toast({
        title: t('contact.messageSent'),
        description: t('contact.messageSentDescription'),
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    },
    onError: (error: Error) => {
      toast({
        title: t('common.error'),
        description: error.message || t('contact.messageError'),
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

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.feliperocha.systems';
  const contactUrl = `${siteUrl}/contact`;

  return (
    <article className="py-8 md:py-12 px-6 md:px-8">
      <SEO
        title="Contact"
        description={`Get in touch with ${profile?.name || 'Felipe F. Rocha'}. ${profile?.email ? `Email: ${profile.email}` : ''}`}
        canonical={contactUrl}
      />
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-contact-title">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('contact.description')}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('contact.sendMessage')}</CardTitle>
              <CardDescription>
                {t('contact.formDisabled')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4" data-testid="form-contact">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.name')}</Label>
                    <Input 
                      id="name" 
                      name="name"
                      placeholder={t('contact.namePlaceholder')} 
                      required 
                      disabled
                      value={formData.name}
                      onChange={handleChange}
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.email')}</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder={t('contact.emailPlaceholder')} 
                      required 
                      disabled
                      value={formData.email}
                      onChange={handleChange}
                      data-testid="input-contact-email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">{t('contact.subject')}</Label>
                  <Input 
                    id="subject" 
                    name="subject"
                    placeholder={t('contact.subjectPlaceholder')} 
                    required 
                    disabled
                    value={formData.subject}
                    onChange={handleChange}
                    data-testid="input-contact-subject"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.message')}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t('contact.messagePlaceholder')}
                    rows={5}
                    required
                    disabled
                    value={formData.message}
                    onChange={handleChange}
                    data-testid="input-contact-message"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={true}
                  className="w-full"
                  data-testid="button-contact-submit"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {t('contact.sendButton')}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{t('contact.contactInfo')}</h3>
                <div className="space-y-4">
                  {profile?.email && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-muted">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t('contact.email')}</p>
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
                        <p className="text-sm font-medium">{t('contact.location')}</p>
                        <p className="text-sm text-muted-foreground">{profile.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {socialLinks && socialLinks.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">{t('contact.connectSocial')}</h3>
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
