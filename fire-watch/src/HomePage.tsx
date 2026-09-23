import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import Solution from "./components/Solution";
import Technologies from "./components/Technologies";
import DemoPreview from "./components/DemoPreview";
import Test from "./components/Test";
import Impact from "./components/Impact";
import Footer from "./components/Footer";
import Legislation from "./components/Legislation";
import CorrelatedWorks from "./components/CorrelatedWorks";
import Ia from "./components/Ia";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Problem />
        <Impact />
        <Solution />
        <Technologies />
        <DemoPreview />
        <Test />
        <Ia />
        <Legislation/>
        <CorrelatedWorks />
      </main>

      <Footer />
    </>
  );
}