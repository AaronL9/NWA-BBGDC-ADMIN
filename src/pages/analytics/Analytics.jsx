import { useEffect, useState } from "react";
// import BarsDataset from "../../components/analytics/BarsDataSet";
import PieChartWithCustomizedLabel from "../../components/analytics/PieChart";
import "./analytics.css";
import CategoryButton from "./CategoryButton";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

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

export default function Analytics() {
  const defaultTab = (path) => {
    switch (path) {
      case "/analytics":
        return 0;
      case "/analytics/barchart":
        return 1;
      case "/analytics/barchart-complaints-suburban":
        return 2;
    }
  };

  const navigate = useNavigate();
  const { pathname } = useLocation();
  // const [category, setCategory] = useState("all");
  // const [data, setData] = useState([]);

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
          navigate("barchart");
          break;
        case 2:
          navigate("barchart-complaints-suburban");
          break;
        default:
          break;
      }
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const querySnapshot = await getDocs(
  //       collection(db, "report_analytics", category, "report_type")
  //     );
  //     const data = querySnapshot.docs.map((doc) => doc.data());
  //     setData(data);
  //   };
  //   fetchData();
  // }, [category]);

  return (
    <div className="analytics">
      <h2 className="banner__title">Analytics</h2>
      <Box
        sx={{
          width: "80%",
          marginBottom: "1.5rem",
          marginInline: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
          role="navigation"
        >
          <LinkTab label="By complaint" href="analtyics" />
          <LinkTab label="By Street/Sitio" href="analytics/barchart" />
          <LinkTab
            label="By complaint per Street/Sitio"
            href="analytics/barchart-complaints-suburban"
          />
        </Tabs>
      </Box>
      <Outlet />
      {/* <div className="analytics-container">
        <PieChartWithCustomizedLabel data={data} />
      </div> */}
      {/* <div className="analytics__area-button">
        <CategoryButton setCategory={setCategory} />
      </div> */}
      <br />
    </div>
  );
}
