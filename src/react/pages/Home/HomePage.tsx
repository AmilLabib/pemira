import { Nav, Footer, Header } from "../../components/Layout";
import FAQ from "../../components/Home/FAQ";
import Timeline from "../../components/Home/Timeline";
import Carousel, { type Slide } from "../../components/Home/Carousel";

const carouselSlides: Slide[] = [
  { type: "youtube", videoId: "dQw4w9WgXcQ", title: "Promo Video" },
  { type: "youtube", videoId: "dQw4w9WgXcQ", title: "Promo Video" },
  {
    type: "image",
    src: "https://placehold.co/1200x600",
    alt: "Sample Image 1",
  },
];

const HomePage: React.FC = () => {
  return (
    <>
      <Nav />
      <Header />
      <section className="container mx-auto my-16 px-4">
        <Carousel
          slides={carouselSlides}
          interval={6000}
          showArrows
          showIndicators
        />
      </section>
      <Timeline />
      <FAQ />
      <Footer />
    </>
  );
};

export default HomePage;
