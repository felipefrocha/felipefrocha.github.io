import { SocialCard } from '../molecules/SocialCard';

export default function SocialCardExample() {
  return (
    <div className="grid gap-4 max-w-md">
      <SocialCard
        platform="github"
        handle="alexdev"
        url="https://github.com"
        followers="1.2K"
      />
      <SocialCard
        platform="linkedin"
        handle="alexdev"
        url="https://linkedin.com"
      />
    </div>
  );
}
