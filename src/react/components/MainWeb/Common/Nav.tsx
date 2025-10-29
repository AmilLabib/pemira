import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import logo from "../../../assets/MainWeb/logo.webp";
import { Menu, X } from "lucide-react";

const NAV_MENU = [
  { href: "/", label: "Beranda" },
  { href: "/daftar", label: "Pendaftaran" },
  { href: "/daftar-calon", label: "Daftar Calon" },
  { href: "/pemilihan", label: "Pemilihan" },
  { href: "/faq", label: "FAQ" },
];

const Nav: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full text-white ${
        // transparent header on the home page; other routes always show the scrolled style
        isHome
          ? scrolled
            ? "bg-[#102a71]/75 backdrop-blur"
            : "border-none bg-transparent"
          : "bg-[#102a71]"
      }`}
    >
      <div
        className={`flex items-center justify-between ${scrolled || !isHome ? "border-b border-blue-900/25" : ""} px-8 py-4`}
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
        <nav className="hidden lg:block">
          <ul className="font-poppins font-regular flex gap-6">
            {NAV_MENU.map((item) => (
              <li key={item.href} className="lg:mt-2">
                <Link to={item.href} className="hover:opacity-80">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/voting"
                className="ml-2 inline-flex items-center gap-2 rounded-2xl bg-[#ffd358] px-3 py-2 text-sm font-semibold text-[#002a45] hover:opacity-90"
                aria-label="Login Voting"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
        <button
          className="lg:hidden"
          aria-label="Toggle Menu"
          onClick={() => {
            setMenuOpen((open) => !open);
            if (!menuOpen) setScrolled(true);
          }}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <nav className={`lg:hidden ${menuOpen ? "" : "hidden opacity-0"}`}>
        <ul className="grid gap-2 p-4 font-medium">
          {NAV_MENU.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="block py-2 hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/voting"
              className="block rounded-2xl bg-[#ffd358] px-3 py-2 text-center font-semibold text-[#002a45]"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
