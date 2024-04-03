import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import PropTypes from "prop-types";

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
      colors={[
        "#5668e2",
        "#8a56e2",
        "#cf56e2",
        "#e256ae",
        "#e25668",
        "#e28956",
        "#e2cf56",
        "#aee256",
        "#aee256",
        "#56e289",
        "#56e2cf",
        "#56aee2",
      ]}
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
