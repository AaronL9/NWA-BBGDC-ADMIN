import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import MenuIcon from "@mui/icons-material/Menu";
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
  const { logout, admin } = useAuthContext();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    const menu = document.querySelector(".mobile-menu");
    const closeBtn = document.querySelector("#btn");

    sidebar.classList.toggle("open");
    setIsOpen((prev) => !prev);
    menuBtnChange();

    function menuBtnChange() {
      if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
        menu.style.zIndex = 0;
      } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
        menu.style.zIndex = 1000;
      }
    }
  };

  const onProfileClick = () => {
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector("#btn");

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

    navigate("profile");
  };

  function logoutHanlder() {
    logout();
  }

  return (
    <>
      <div className="mobile-menu">
        <MenuIcon
          onClick={toggleSidebar}
          sx={{ width: "35px", height: "35px", color: "#fff" }}
        />
      </div>
      <div className="sidebar">
        <div className="logo-details">
          <i className="bx bxs-analyse icon"></i>
          <div className="logo_name">Neighborhood</div>
          <i className="bx bx-menu" id="btn" onClick={toggleSidebar}></i>
        </div>
        <ul
          className="nav-list"
          onClick={window.innerWidth < 500 ? toggleSidebar : () => {}}
        >
          {navListData.map((data, index) => (
            <NavItem
              key={index}
              name={data.name}
              path={data.path}
              iconClass={data.iconClass}
            />
          ))}
          <li className="profile">
            <div className="profile-details" onClick={onProfileClick}>
              <img
                src={admin?.photoURL ?? "/images/profile-circle.png"}
                alt="profileImg"
              />
              <div className="name_job">
                <div className="name">Aaron Lomibao</div>
                <div className="job">Admin</div>
              </div>
            </div>
            <i
              className="bx bx-log-out"
              id="log_out"
              onClick={logoutHanlder}
            ></i>
          </li>
        </ul>
      </div>
    </>
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
