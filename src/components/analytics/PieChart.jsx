import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import PropTypes from "prop-types";

// const data = [
//   { label: "Noise Disturbance", value: 20, color: "#0088FE" },
//   { label: "Robbery", value: 100, color: "#00C49F" },
//   { label: "Complaints", value: 300, color: "#FFBB28" },
//   { label: "Concern", value: 200, color: "#FF8042" },
//   { label: "Missing Person/s", value: 150 },
//   { label: "Sexual Harrasment", value: 125 },
// ];

const sizing = {
  margin: { right: 5, top: 50 },
  width: 800,
  height: 500,
};

export default function PieChartWithCustomizedLabel({ data }) {
  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params) => {
    let percent = params.value / TOTAL;
    if (isNaN(percent)) {
      percent = 0;
    }

    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <PieChart
      series={[
        {
          outerRadius: 160,
          data,
          arcLabel: getArcLabel,
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: "white",
          fontSize: 14,
        },
      }}
      {...sizing}
      slotProps={{
        legend: {
          direction: "row",
          itemMarkWidth: 20,
          itemMarkHeight: 20,
          markGap: 5,
          itemGap: 25,
          position: { vertical: "top" },
          padding: { bottom: 50 },
          labelStyle: { textTransform: "capitalize" },
        },
      }}
    />
  );
}

PieChartWithCustomizedLabel.propTypes = {
  data: PropTypes.array,
};
