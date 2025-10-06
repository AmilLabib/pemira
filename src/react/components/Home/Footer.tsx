const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-100 text-neutral-800 py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-sm">
        &copy; {new Date().getFullYear()} PEMIRA PKN STAN. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
