import { useState, useEffect } from "react";

import logo from "../../assets/logo.webp";

import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
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
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? " backdrop-blur bg-blue-900/60" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="size-10 rounded-full bg-white p-1"
          />
          <span className="font-bold text-lg text-white">PEMIRA PKN STAN</span>
        </div>
        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-6 text-white font-medium">
            <li>
              <a href="#hero" className="hover:underline">
                Beranda
              </a>
            </li>
            <li>
              <a href="#daftar-calon" className="hover:underline">
                Daftar Calon
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:underline">
                FAQ
              </a>
            </li>
          </ul>
        </nav>
        {/* Hamburger button for mobile */}
        <button
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {/* Mobile nav menu with transition */}
      <nav
        className={`md:hidden bg-blue-900 border-t border-blue-800 transition-all duration-300 overflow-hidden ${
          menuOpen
            ? "max-h-60 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col gap-2 p-4 text-white font-medium">
          <li>
            <a
              href="#hero"
              className="hover:underline block py-2"
              onClick={() => setMenuOpen(false)}
            >
              Beranda
            </a>
          </li>
          <li>
            <a
              href="#daftar-calon"
              className="hover:underline block py-2"
              onClick={() => setMenuOpen(false)}
            >
              Daftar Calon
            </a>
          </li>
          <li>
            <a
              href="#faq"
              className="hover:underline block py-2"
              onClick={() => setMenuOpen(false)}
            >
              FAQ
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
