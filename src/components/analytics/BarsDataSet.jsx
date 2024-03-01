import { BarChart } from "@mui/x-charts/BarChart";
import { dataset } from "./data_set";

const chartSetting = {
  xAxis: [
    {
      label: "age by street",
    },
  ],
  width: 800,
  height: 1000,
};

const valueFormatter = (value) => `${value}`;

export default function HorizontalBars() {
  return (
    <BarChart
      dataset={dataset}
      yAxis={[
        {
          scaleType: "band",
          dataKey: "area",
          labelStyle: { width: "100%" },
        },
      ]}
      series={[
        {
          dataKey: "adolescents",
          label: "15-19 years old",
          valueFormatter,
        },
        {
          dataKey: "youngAdults",
          label: "20-24 years old",
          valueFormatter,
        },
        {
          dataKey: "middleAgedAdults",
          label: "25-29 years old",
          valueFormatter,
        },
        {
          dataKey: "adults",
          label: "30-39 years old",
          valueFormatter,
        },
      ]}
      layout="horizontal"
      {...chartSetting}
      sx={{ margin: "25px" }}
      slotProps={{ legend: { labelStyle: { paddingInline: "15px" } } }}
    />
  );
}
