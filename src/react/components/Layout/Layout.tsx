import { Outlet } from "react-router";
import Nav from "../Common/Nav";
import Footer from "../Common/Footer";

const Layout: React.FC = () => {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
