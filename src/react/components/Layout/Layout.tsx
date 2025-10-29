import { Outlet } from "react-router";
import Nav from "../MainWeb/Common/Nav";
import Footer from "../MainWeb/Common/Footer";

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
