import Timeline from "../../components/Home/Timeline";
import Carousel, { type Slide } from "../../components/Home/Carousel";
import Hero from "../../components/Home/Hero";
import Tugas from "../../components/Home/Tugas";
import Hasil from "../../components/Home/Hasil";
import AnimatedContent from "../../components/Common/AnimatedContent";

const carouselSlides: Slide[] = [
  { type: "youtube", videoId: "dQw4w9WgXcQ", title: "Promo Video" },
  { type: "youtube", videoId: "dQw4w9WgXcQ", title: "Promo Video" },
  {
    type: "image",
    src: "https://placehold.co/1200x600",
    alt: "Sample Image 1",
  },
  {
    type: "image",
    src: "https://placehold.co/1800x600",
    alt: "Sample Image 1",
  },
  {
    type: "image",
    src: "https://placehold.co/1900x600",
    alt: "Sample Image 1",
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Hero />
      <div className="w-full bg-[url('/src/react/assets/bg1.webp')] bg-cover bg-center bg-no-repeat">
        <AnimatedContent
          distance={150}
          direction="vertical"
          duration={1}
          delay={0.1}
        >
          <Timeline />
        </AnimatedContent>

        <AnimatedContent
          distance={150}
          direction="vertical"
          duration={1}
          delay={0.2}
        >
          <section className="container mx-auto my-8 px-4">
            <Carousel slides={carouselSlides} interval={6000} showIndicators />
      </section>
        </AnimatedContent>

        <div className="container mx-auto">
          <AnimatedContent
            distance={150}
            direction="vertical"
            duration={1}
            delay={0.3}
          >
            <Hasil />
          </AnimatedContent>
          <AnimatedContent
            distance={150}
            direction="vertical"
            duration={1}
            delay={0.4}
          >
            <Tugas />
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
