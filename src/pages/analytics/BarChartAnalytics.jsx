import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Stack } from "@mui/material";

const chartSetting = {
  xAxis: [
    {
      label: "Complaints",
    },
  ],
  width: 500,
  height: 800,
};

const valueFormatter = (value) => `${value}`;

export default function BarChartAnalytics() {
  return (
    <Stack direction="row">
      <BarChart
        dataset={data}
        yAxis={[{ scaleType: "band", dataKey: "area" }]}
        series={[
          { dataKey: "data", label: "Reported Complaints", valueFormatter },
        ]}
        layout="horizontal"
        {...chartSetting}
      />
    </Stack>
  );
}

const data = [
  { area: "alimango", data: 43 },
  { area: "alimasag", data: 78 },
  { area: "apahap", data: 90 },
  { area: "ayungin", data: 64 },
  { area: "bagong barrio", data: 56 },
  { area: "bangus ville", data: 12 },
  { area: "baracuda", data: 87 },
  { area: "bartolome ceralde street", data: 32 },
  { area: "beverlywills", data: 58 },
  { area: "bisugo", data: 91 },
  { area: "bonito", data: 27 },
  { area: "calamiong", data: 52 },
  { area: "catacdang", data: 70 },
  { area: "central park", data: 89 },
  { area: "dalagang bukid", data: 16 },
  { area: "dasmarinas", data: 42 },
  { area: "don marcelo i. balolong sr. avenue", data: 75 },
  { area: "don maximo", data: 30 },
  { area: "dupax street", data: 65 },
  { area: "eastern babaan", data: 51 },
  { area: "eastern county", data: 98 },
  { area: "eastern taasan", data: 22 },
  { area: "las vegas", data: 81 },
  { area: "maligaya street", data: 37 },
  { area: "maramba banker's village", data: 69 },
  { area: "paras", data: 97 },
  { area: "perrenians", data: 18 },
  { area: "purok pagkakaisa", data: 57 },
  { area: "ramos street", data: 84 },
  { area: "redcross ville", data: 39 },
  { area: "sabangan", data: 73 },
  { area: "san gabriel", data: 26 },
  { area: "san marino place", data: 60 },
  { area: "sugpo", data: 90 },
  { area: "tanguegue", data: 44 },
  { area: "tondaligan", data: 72 },
  { area: "unity area", data: 36 },
  { area: "tuna", data: 15 },
];
