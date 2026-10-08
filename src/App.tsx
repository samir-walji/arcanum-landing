import Approach from "./components/Approach";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import Results from "./components/Results";
import Research from "./components/Research";
import TeamLogos from "./components/TeamLogos";

export default function App() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <TeamLogos />
        <Approach />
        <Results />
        <Research />
      </main>
      <Footer />
    </>
  );
}
