import { ProfileCard } from '../molecules/ProfileCard';

export default function ProfileCardExample() {
  return (
    <div className="max-w-xs bg-sidebar rounded-lg">
      <ProfileCard
        name="Felipe F. Rocha"
        tagline="Systems Engineer"
      />
    </div>
  );
}
