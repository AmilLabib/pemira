import Nav from "../../components/Home/Nav";
import Footer from "../../components/Home/Footer";
import Header from "../../components/Home/Header";
import FAQ from "../../components/Home/FAQ";
import Timeline, { type TimelineEvent } from "../../components/Home/Timeline";
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

const timelineEvents: TimelineEvent[] = [
  {
    date: "11/3/2025",
    title: "Pendaftaran Bakal Calon Presma, Wapresma, dan Anggota BLM",
  },
  { date: "11/22/2025", title: "Fit and Proper Test" },
  { date: "11/23/2025", title: "Pengundian Nomor Urut Calon" },
  { date: "11/24/2025", title: "Masa Kampanye" },
  {
    date: "12/5/2025",
    title: "Mengenal Lebih Dekat Calon Presma dan Wapresma",
  },
  { date: "12/7/2025", title: "Hari Tenang" },
  { date: "12/8/2025", title: "Hari Pemilihan Raya" },
  {
    date: "12/9/2025",
    title: "Pengumuman dan Sidang Penetapan Hasil Pemilihan Raya",
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
      <Timeline events={timelineEvents} />
      <FAQ />
      <Footer />
    </>
  );
};

export default HomePage;
