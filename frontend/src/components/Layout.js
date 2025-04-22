// components/Layout.js
import { Outlet } from "react-router-dom";
import SlideBar from "./SlideBar";

const Layout = () => {
  return (
    <div className="app-layout">
      <SlideBar />
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
