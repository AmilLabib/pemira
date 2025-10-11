import Header from "../../components/Home/Header";
import Footer from "../../components/Home/Footer";
import Hero from "../../components/Home/Hero";
import FAQ from "../../components/Home/FAQ";
import Timeline from "../../components/Home/Timeline";

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <Timeline />
      <FAQ />
      <Footer />
    </>
  );
};

export default HomePage;
