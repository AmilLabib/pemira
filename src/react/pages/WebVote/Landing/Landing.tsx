import bg1 from "../../../assets/WebVote/bg1.webp";
import Card from "../../../components/WebVote/Landing/LoginCard";

function Landing() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg1})` }}
    >
      <div className="container mx-auto mt-8 flex min-h-screen flex-col items-center px-8 py-12 lg:mt-0 lg:flex-row lg:gap-12">
        {/* Left: large heading */}
        <div className="mb-8 flex items-center justify-center text-center lg:mb-4 lg:flex-1 lg:text-left">
          <div className="flex flex-col">
            <h1 className="font-league text-shadow-xl text-xl font-extrabold tracking-tight text-white lg:text-4xl">
              Selamat Datang di
            </h1>
            <h2 className="font-league text-xl font-extrabold whitespace-nowrap text-[#ffd358] text-shadow-lg lg:text-5xl">
              Website Pemilihan Raya 2025
            </h2>
          </div>
        </div>

        {/* Right: card positioned to the right with fixed width */}
        <div className="ml-8 h-full w-full lg:mt-0 lg:ml-8 lg:w-1/2">
          <Card />
        </div>
      </div>
    </div>
  );
}

export default Landing;
