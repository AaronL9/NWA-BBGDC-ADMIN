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

const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    month: "Jan",
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    month: "Fev",
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    month: "Mar",
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    month: "Apr",
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    month: "May",
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    seoul: 144,
    month: "June",
  },
  {
    london: 59,
    paris: 60,
    newYork: 105,
    seoul: 319,
    month: "July",
  },
  {
    london: 65,
    paris: 60,
    newYork: 106,
    seoul: 249,
    month: "Aug",
  },
  {
    london: 51,
    paris: 51,
    newYork: 95,
    seoul: 131,
    month: "Sept",
  },
  {
    london: 60,
    paris: 65,
    newYork: 97,
    seoul: 55,
    month: "Oct",
  },
  {
    london: 67,
    paris: 64,
    newYork: 76,
    seoul: 48,
    month: "Nov",
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    seoul: 25,
    month: "Dec",
  },
];

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
