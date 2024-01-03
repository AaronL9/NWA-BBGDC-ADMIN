import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { pageTitles } from "../util/pageTitles";

// components
import Sidebar from "../components/sidebar/Sidebar";

export default function RootLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const path = useLocation().pathname.split("/");
  const title = path[path.length - 1];

  return (
    <>
      <header className={isOpen ? "banner move-right" : "banner"}>
        <div className="banner__upper">
          <h1 className="banner__name">Neighborhood Watch</h1>
          <div className="banner__logo">
            <img
              className="banner__logo-img"
              src="/images/logo.png"
              alt="Dagupan Official Logo"
            />
            <span className="banner__text">Barangay Bonuan Gueset</span>
          </div>
        </div>
        <h2 className="banner__title">{pageTitles[title]}</h2>
      </header>
      <Sidebar setIsOpen={setIsOpen} />
      <main className={isOpen ? "move-right" : null}>
        <Outlet />
      </main>
      <footer>
        <div className="footer-content">
          {/* <img
            src="/images/logo.png"
            alt="ph_seal_pangasinan_dagupan.png"
          /> */}
          <div className="footer-text">
            <p>© 2023 Neighborhood Watch.</p>
            <p>All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
