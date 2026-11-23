import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { SocialCard } from '@/components/molecules/SocialCard';
import { Turnstile } from '@marsidev/react-turnstile';
import { SEO } from '@/components/atoms/SEO';
import { Send, Mail, MapPin } from 'lucide-react';
import { submitContactForm, fetchProfile, fetchSocials } from '@/lib/api';
import type { ProfileInfo, SocialLink } from '@shared/schema';

export default function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    turnstileToken: '',
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
      setFormData({ name: '', email: '', subject: '', message: '', turnstileToken: '' });
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
      <article className="py-10 md:py-14">
        <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
          <Skeleton className="h-9 w-48 mb-3" />
          <Skeleton className="h-5 w-96 max-w-full mb-10" />
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <Skeleton className="h-96 rounded-xl" />
            <div className="space-y-6">
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-44 rounded-xl" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.feliperocha.systems';
  const contactUrl = `${siteUrl}/contact`;

  return (
    <article className="py-10 md:py-14">
      <SEO
        title="Contact"
        description={`Get in touch with ${profile?.name || 'Felipe F. Rocha'}. ${profile?.email ? `Email: ${profile.email}` : ''}`}
        canonical={contactUrl}
      />
      <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
        <header className="mb-10 max-w-2xl">
          <h1
            className="text-h1 text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            data-testid="text-contact-title"
          >
            {t('contact.title')}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            {t('contact.description')}
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="rounded-xl border border-border/70 bg-card/60 p-6 sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold tracking-tight">{t('contact.sendMessage')}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {t('contact.formIntro')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-contact">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">{t('contact.name')}</Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder={t('contact.namePlaceholder')}
                    required
                    disabled={contactMutation.isPending}
                    value={formData.name}
                    onChange={handleChange}
                    data-testid="input-contact-name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">{t('contact.email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder={t('contact.emailPlaceholder')}
                    required
                    disabled={contactMutation.isPending}
                    value={formData.email}
                    onChange={handleChange}
                    data-testid="input-contact-email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-xs">{t('contact.subject')}</Label>
                <Input
                  id="subject"
                  name="subject"
                  autoComplete="off"
                  placeholder={t('contact.subjectPlaceholder')}
                  required
                  disabled={contactMutation.isPending}
                  value={formData.subject}
                  onChange={handleChange}
                  data-testid="input-contact-subject"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-xs">{t('contact.message')}</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder={t('contact.messagePlaceholder')}
                  rows={5}
                  required
                  disabled={contactMutation.isPending}
                  value={formData.message}
                  onChange={handleChange}
                  data-testid="input-contact-message"
                />
              </div>

              <div className="flex justify-center py-2">
                <Turnstile
                  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                  onSuccess={(token) => setFormData((prev) => ({ ...prev, turnstileToken: token }))}
                />
              </div>

              <Button
                type="submit"
                disabled={contactMutation.isPending || !formData.turnstileToken}
                className="w-full"
                data-testid="button-contact-submit"
              >
                <Send className="h-3.5 w-3.5 mr-2" aria-hidden="true" />
                {t('contact.sendButton')}
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
                {t('contact.contactInfo')}
              </h2>
              <div className="rounded-xl border border-border/70 bg-card/50 divide-y divide-border/50">
                {profile?.email && (
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/70">
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{t('contact.email')}</p>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-sm font-medium hover:text-primary transition-colors truncate block"
                        data-testid="link-contact-email"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/70">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('contact.location')}</p>
                      <p className="text-sm font-medium">{profile.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {socialLinks && socialLinks.length > 0 && (
              <div>
                <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
                  {t('contact.connectSocial')}
                </h2>
                <div className="grid gap-3">
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
