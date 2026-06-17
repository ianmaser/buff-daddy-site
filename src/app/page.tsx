import Hero from "@/components/sections/Hero";
import StatsStrip from "@/components/sections/StatsStrip";
import Products from "@/components/sections/Products";
import WhyUs from "@/components/sections/WhyUs";
import OurStory from "@/components/sections/OurStory";
import OrderForm from "@/components/sections/OrderForm";
import Contact from "@/components/sections/Contact";
import { siteConfig } from "@/config/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dallas",
    addressRegion: "TX",
    addressCountry: "US",
  },
  servesCuisine: "High Protein Desserts",
  sameAs: [siteConfig.instagramUrl, siteConfig.tiktokUrl],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <Hero />
        <StatsStrip />
        <Products />
        <WhyUs />
        <OurStory />
        <OrderForm />
        <Contact />
      </main>
    </>
  );
}
