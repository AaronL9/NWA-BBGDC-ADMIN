import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "./patrollers.css";
import { defaultTab } from "../../util/tabFilter";

function samePageLinkNavigation(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 || // ignore everything but left-click
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return false;
  }
  return true;
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        // Routing libraries handle this, you can remove the onClick handle when using them.
        if (samePageLinkNavigation(event)) {
          event.preventDefault();
        }
      }}
      aria-current={props.selected && "page"}
      {...props}
    />
  );
}

LinkTab.propTypes = {
  selected: PropTypes.bool,
};

export default function PatrollerNavigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [value, setValue] = useState(defaultTab(pathname));

  const handleChange = (event, newValue) => {
    // event.type can be equal to focus with selectionFollowsFocus.
    if (
      event.type !== "click" ||
      (event.type === "click" && samePageLinkNavigation(event))
    ) {
      setValue(newValue);
      switch (newValue) {
        case 0:
          navigate("");
          break;
        case 1:
          navigate("send-all");
          break;
        case 2:
          navigate("all-location");
          break;
        default:
          break;
      }
    }
  };

  return (
    <>
      <h2 className="banner__title">Patrollers</h2>
      <div className="patrollers">
        <Box sx={{ width: "100%", marginBottom: "1.5rem" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="nav tabs example"
            role="navigation"
          >
            <LinkTab label="patrollers" href="patrollers/all" />
            <LinkTab label="Message All" href="patrollers/send-all" />
            <LinkTab label="Locate All" href="patrollers/all-location" />
          </Tabs>
        </Box>
        <Outlet />
      </div>
    </>
  );
}

PatrollerNavigation.propTypes = {};
