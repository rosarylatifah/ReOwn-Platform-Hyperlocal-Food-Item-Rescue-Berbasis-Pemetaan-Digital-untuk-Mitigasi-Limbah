import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ValueProposition from "@/components/landing/ValueProposition";
import CategorySection from "@/components/landing/CategorySection";
import ItemGrid from "@/components/landing/ItemGrid";
import RibbonTape from "@/components/landing/RibbonTape";
import HowItWorks from "@/components/landing/HowItWorks";
import CtaBanner from "@/components/landing/CtaBanner";

export default function LandingPage() {
  return (
    <>
      <Navbar variant="overlay" />
      <main>
        <HeroSection />
        <ValueProposition />
        <CategorySection />
        <ItemGrid />
        <RibbonTape />
        <HowItWorks />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
