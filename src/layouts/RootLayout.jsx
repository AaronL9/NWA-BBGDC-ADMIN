import { useState } from "react";
import { Outlet } from "react-router-dom";

// components
import Sidebar from "../components/sidebar/Sidebar";

export default function RootLayout() {
  const [isOpen, setIsOpen] = useState(false);

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
