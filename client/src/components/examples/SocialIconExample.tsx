import { SocialIcon } from '../atoms/SocialIcon';

export default function SocialIconExample() {
  return (
    <div className="flex items-center gap-2">
      <SocialIcon platform="github" url="https://github.com" />
      <SocialIcon platform="linkedin" url="https://linkedin.com" />
      <SocialIcon platform="instagram" url="https://instagram.com" />
      <SocialIcon platform="twitter" url="https://twitter.com" />
    </div>
  );
}
