import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import { navListData } from "./sidebar_data";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./sidebar.css";

function NavItem({ name, iconClass, path }) {
  return (
    <li>
      <NavLink to={path}>
        <i className={`bx ${iconClass}`}></i>
        <span className="links_name">{name}</span>
      </NavLink>
      <span className="tooltip">{name}</span>
    </li>
  );
}

export default function Sidebar({ setIsOpen }) {
  const { logout } = useAuthContext();
  const toggleSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector("#btn");
    // const searchBtn = document.querySelector(".bx-search");

    sidebar.classList.toggle("open");
    setIsOpen((prev) => !prev);
    menuBtnChange();

    function menuBtnChange() {
      if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
      } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
      }
    }
  };

  function logoutHanlder() {
    logout();
  }

  return (
    <div className="sidebar">
      <div className="logo-details">
        <i className="bx bxs-analyse icon"></i>
        {/* <img className="logo icon" src="/images/barangayhall.png" /> */}
        <div className="logo_name">Neighborhood</div>
        <i className="bx bx-menu" id="btn" onClick={toggleSidebar}></i>
      </div>
      <ul className="nav-list">
        {navListData.map((data, index) => (
          <NavItem
            key={index}
            name={data.name}
            path={data.path}
            iconClass={data.iconClass}
          />
        ))}
        <li className="profile">
          <div className="profile-details">
            <img src="/images/profile.webp" alt="profileImg" />
            <div className="name_job">
              <div className="name">Aaron Lomibao</div>
              <div className="job">Admin</div>
            </div>
          </div>
          <i className="bx bx-log-out" id="log_out" onClick={logoutHanlder}></i>
        </li>
      </ul>
    </div>
  );
}

Sidebar.propTypes = {
  setIsOpen: PropTypes.func,
};

NavItem.propTypes = {
  name: PropTypes.string,
  iconClass: PropTypes.string,
  path: PropTypes.string,
};
