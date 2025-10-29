import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import logo from "../../../assets/WebVote/logo.webp";

const Nav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isVotePage = location.pathname === "/voting/vote";
  const [voterName, setVoterName] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem("voter");
      if (raw) {
        const obj = JSON.parse(raw);
        setVoterName(obj?.name || obj?.nim || "");
      } else {
        setVoterName("");
      }
    } catch (e) {
      setVoterName("");
    }
  }, [location.pathname]);

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full text-white ${
        isHome
          ? scrolled
            ? "bg-[#102a71]/75 backdrop-blur"
            : "border-none bg-transparent"
          : "bg-[#102a71]"
      }`}
    >
      <div
        className={`container mx-auto flex items-center justify-between ${
          scrolled || !isHome ? "border-b border-blue-900/25" : ""
        } px-8 py-4`}
      >
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className="size-8 rounded-full bg-white p-0.5 lg:size-10"
          />
          <div className="flex flex-col">
            <h1 className="font-league text-sm font-bold lg:text-lg">
              Pemilihan Raya
            </h1>
            <h1 className="font-poppins font-regular -mt-1 text-xs lg:text-sm">
              Politeknik Keuangan Negara STAN
            </h1>
          </div>
        </div>

        {/* Right side: show voter name + icon when on voting page */}
        <div className="flex items-center gap-3">
          {isVotePage && (
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1 text-xs text-white lg:text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
                aria-hidden
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="font-medium">{voterName || "Pemilih"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
