import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import FeaturedListings from "@/components/home/featured-listings";
import HowItWorks from "@/components/home/how-it-works";
import Testimonials from "@/components/home/testimonials";
import CtaSection from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Features />
      <FeaturedListings />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
    </div>
  );
}
