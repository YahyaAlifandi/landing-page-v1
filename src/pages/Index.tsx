import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/features";

export default function Index() {
  return (
    <>
      <Navbar />
      <main>
        <section id="hero">
          <Hero />
        </section>

        <section id="features">          
            <Features />
        </section>
      </main>
    </>
  );
}
