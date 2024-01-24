import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./patrollers.css";

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
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    // event.type can be equal to focus with selectionFollowsFocus.
    console.log(newValue);
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
          navigate("group-chat");
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
            <LinkTab label="Patrollers" href="oaatrollers" />
            <LinkTab label="Group Chat" href="patrollers/group-chat" />
            <LinkTab label="Locations" href="patrollers/all-location" />
          </Tabs>
        </Box>
        <Outlet />
      </div>
    </>
  );
}

PatrollerNavigation.propTypes = {};
