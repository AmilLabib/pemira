import { useState, useEffect } from "react";
import { Link } from "react-router";
import logo from "../../assets/logo.webp";
import { Menu, X } from "lucide-react";

const NAV_MENU = [
  { href: "/", label: "Beranda" },
  { href: "/pendaftaran", label: "Pendaftaran" },
];

const Nav: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full text-white backdrop-blur transition-colors ${
        scrolled ? "bg-blue-900/75" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between border-b border-blue-900/25 p-4">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="size-10 rounded-full bg-white p-0.5"
          />
          <span className="text-lg font-bold">PEMIRA PKN STAN</span>
        </div>
        <nav className="hidden md:block">
          <ul className="flex gap-6 font-medium">
            {NAV_MENU.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          className="md:hidden"
          aria-label="Toggle Menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <nav className={`md:hidden ${menuOpen ? "" : "hidden opacity-0"}`}>
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
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
