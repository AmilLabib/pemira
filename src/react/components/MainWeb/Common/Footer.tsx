const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-100 py-6 text-neutral-800">
      <div className="container mx-auto px-4 text-center text-sm">
        &copy; {import.meta.env.VITE_YEAR} PEMIRA PKN STAN | #SuaraBerkarya
      </div>
    </footer>
  );
};

export default Footer;
