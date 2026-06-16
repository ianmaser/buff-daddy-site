import Hero from "@/components/sections/Hero";
import StatsStrip from "@/components/sections/StatsStrip";
import Products from "@/components/sections/Products";
import WhyUs from "@/components/sections/WhyUs";
import OurStory from "@/components/sections/OurStory";
import OrderForm from "@/components/sections/OrderForm";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsStrip />
      <Products />
      <WhyUs />
      <OurStory />
      <OrderForm />
      <Contact />
    </main>
  );
}
