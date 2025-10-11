import { Link } from "react-router";

const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="bg-gradient-to-b from-blue-900 to-blue-800 pt-28 pb-14 text-white"
    >
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
        <h1 className="mb-2 text-4xl font-extrabold text-shadow-md md:text-5xl">
          PEMIRA PKN STAN {import.meta.env.VITE_YEAR}
        </h1>
        <p className="mb-4 max-w-2xl text-lg font-light italic md:text-xl">
          Bersama Suara, Wujudkan Asa
        </p>
        <Link
          to="/bakalcalon/daftar"
          className="rounded-full bg-yellow-400 px-8 py-3 font-semibold text-neutral-800 shadow-lg transition-colors hover:bg-yellow-500"
        >
          Daftar, Yuk!
        </Link>
      </div>
    </section>
  );
};

export default Hero;
