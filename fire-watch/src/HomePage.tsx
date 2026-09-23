import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import Solution from "./components/Solution";
import Technologies from "./components/Technologies";
import DemoPreview from "./components/DemoPreview";
import Impact from "./components/Impact";
import Footer from "./components/Footer";
import Legislation from "./components/Legislation";
import CorrelatedWorks from "./components/CorrelatedWorks";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Problem />
        <Solution />
        <Technologies />
        <DemoPreview />
        <Impact />
        <Legislation/>
        <CorrelatedWorks />
      </main>

      <Footer />
    </>
  );
}