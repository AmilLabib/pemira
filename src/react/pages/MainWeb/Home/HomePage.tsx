import Timeline from "../../../components/MainWeb/Home/Timeline";
import Carousel, {
  type Slide,
} from "../../../components/MainWeb/Home/Carousel";
import Hero from "../../../components/MainWeb/Home/Hero";
import Tugas from "../../../components/MainWeb/Home/Tugas";
// import Hasil from "../../../components/MainWeb/Home/Hasil";
import AnimatedContent from "../../../components/MainWeb/Common/AnimatedContent";
// import PresmaColumnChart from "../../../components/MainWeb/Home/PresmaColumnChart";

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
    <div className="relative w-full overflow-hidden">
      <Hero />
      <div className="w-full bg-[url('/src/react/assets/MainWeb/bg1.webp')] bg-cover bg-top bg-no-repeat">
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
          {/* <AnimatedContent
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
            delay={0.3}
          >
            <PresmaColumnChart />
          </AnimatedContent> */}

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
