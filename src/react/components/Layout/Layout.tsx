import { Outlet } from "react-router";
import Header from "../Common/Header";
import Nav from "../Common/Nav";
import Footer from "../Common/Footer";

const Layout: React.FC = () => {
  return (
    <>
      <Nav />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
