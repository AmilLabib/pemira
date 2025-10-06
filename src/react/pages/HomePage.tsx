import Header from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import Hero from "../components/Home/Hero";
import DaftarCalon from "../components/Home/DaftarCalon";
import FAQ from "../components/Home/FAQ";

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <DaftarCalon />
      <FAQ />
      <Footer />
    </>
  );
};

export default HomePage;
