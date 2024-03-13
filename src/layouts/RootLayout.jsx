import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { db, generateToken, messaging } from "../config/firebase";

// components
import Sidebar from "../components/sidebar/Sidebar";
import { onMessage } from "firebase/messaging";

import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

export default function RootLayout() {
  const { pathname } = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const { admin } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const storeAdminToken = async () => {
      try {
        const token = await generateToken();
        if (token) {
          const docRef = doc(db, "admin_push_token", admin.uid);
          await setDoc(docRef, { token });
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    storeAdminToken();
    onMessage(messaging, (payload) => {
      console.log(payload);
      const { notification } = payload;
      new Notification(notification.title, {
        body: notification.body,
      });
    });
  }, [admin]);

  return (
    <div id="root-home">
      <header className={isOpen ? "banner move-right" : "banner"}>
        <div className="banner__upper">
          <h1 className="banner__name">
            Neighborhood Watch <span>| Admin</span>
          </h1>
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
      {/* <ResponsiveDrawer /> */}
      <main className={isOpen ? "move-right" : null}>
        <Outlet />
      </main>
      <footer>
        <div className="footer-content">
          <div className="footer-text">
            <p>© 2024 Neighborhood Watch.</p>
            <p>All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
