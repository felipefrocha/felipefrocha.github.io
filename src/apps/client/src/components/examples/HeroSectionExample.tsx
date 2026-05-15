import { HeroSection } from '../organisms/HeroSection';

export default function HeroSectionExample() {
  return (
    <div className="min-h-[50vh] relative">
      <HeroSection 
        headline="Curious. Engineer. Builder."
        subheadline="Crafting scalable digital experiences and sharing the insights that drive them."
      />
    </div>
  );
}
