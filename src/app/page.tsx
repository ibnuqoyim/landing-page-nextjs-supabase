import Hero from "@/components/sections/Hero";
import Tagline from "@/components/sections/Tagline";
import Products from "@/components/sections/Products";
import Testimonials from "@/components/sections/Testimonials";
import Address from "@/components/sections/Address";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Tagline />
      <Products />
      <Testimonials />
      <Address />
      <Contact />
      <Footer />
    </main>
  );
}
