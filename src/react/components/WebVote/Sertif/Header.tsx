import logo from "../../../assets/WebVote/logo.webp";

const Header: React.FC = () => {
  return (
    <header className="flex w-full flex-col items-center">
      <div className="flex flex-col items-center">
        <img
          src={logo}
          alt="logo"
          className="h-8 w-8 rounded-full object-contain"
        />
        <h1 className="text-base font-extrabold text-[#102a71] text-shadow-lg">
          Pemilihan Raya
        </h1>
        <p className="-mt-1 text-xs text-[#102a71] text-shadow-lg">
          Politeknik Keuangan Negara STAN 2025
        </p>
      </div>
    </header>
  );
};

export default Header;
