import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LANGUAGE_METADATA, type SupportedLanguage } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
  };

  const currentLanguage = i18n.language as SupportedLanguage;
  const currentLangMeta = LANGUAGE_METADATA[currentLanguage] || LANGUAGE_METADATA.en;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const meta = LANGUAGE_METADATA[lang];
          const isActive = currentLanguage === lang;
          return (
            <DropdownMenuItem
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={isActive ? 'bg-accent' : ''}
            >
              <span className="mr-2">{meta.flag}</span>
              <span>{meta.nativeName}</span>
              {isActive && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


