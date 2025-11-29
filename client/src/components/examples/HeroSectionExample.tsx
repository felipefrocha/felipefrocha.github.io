import { HeroSection } from '../organisms/HeroSection';

export default function HeroSectionExample() {
  return (
    <div className="min-h-[50vh] relative">
      <HeroSection 
        headline="Developer. Writer. Creator."
        subheadline="Building digital experiences and sharing knowledge through code and words."
      />
    </div>
  );
}
