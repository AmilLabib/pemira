import { Outlet, useLocation } from "react-router";
import Nav from "../../components/WebVote/Common/Nav";

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const hideNav =
    pathname === "/voting/sertif" || pathname.startsWith("/voting/sertif/");

  return (
    <>
      {!hideNav && <Nav />}
      <Outlet />
    </>
  );
};

export default Layout;
