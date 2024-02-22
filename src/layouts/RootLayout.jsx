import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { db, generateToken, messaging } from "../config/firebase";

// components
import Sidebar from "../components/sidebar/Sidebar";
import { onMessage } from "firebase/messaging";

import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

export default function RootLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const { admin } = useContext(AuthContext);

  useEffect(() => {
    const storeAdminToken = async () => {
      try {
        const token = await generateToken();
        console.log(token);
        const docRef = doc(db, "admin_push_token", admin.uid);
        await setDoc(docRef, { token });
      } catch (error) {
        console.log(error);
      }
    };
    storeAdminToken();
    onMessage(messaging, (payload) => {
      console.log(payload);
      new Notification(payload.notification.title, {
        body: payload.notification.body,
      });
    });
  }, [admin]);

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
          <div className="footer-text">
            <p>© 2024 Neighborhood Watch.</p>
            <p>All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
