import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Stack } from "@mui/material";
import CategoryBarButton from "./CategoryBarButton";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";

const chartSetting = {
  width: 500,
  height: 400,
};

const valueFormatter = (value) => `${value}`;

export default function BarChartAnalyticsSuburban() {
  const [category, setCategory] = React.useState("alimango");
  const [data, setData] = React.useState([]);

  async function getData() {
    const id = category.split(" ").join("_").toLowerCase();
    const docRef = doc(db, "report_bar_analytics", id);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const obj = docSnap.data();
      const data = Object.keys(obj);
      const newOjb = data.map((key) => ({
        complaint: key.split("_").join(" "),
        data: obj[key],
      }));
      // const data = Object.keys().map((key) => ({
      //   complaint: key,
      //   data: obj[key],
      // }));

      // Sort newData by complaint (you can change "complaint" to another field)
      const sortedData = newOjb.sort((a, b) =>
        a.complaint.localeCompare(b.complaint)
      );

      setData(sortedData);
      setData(newOjb);
    }
  }

  React.useEffect(() => {
    getData();
  }, [category]);

  return (
    <div>
      <Stack direction="row" justifyContent="center">
        <CategoryBarButton setCategory={setCategory} />
      </Stack>
      <Stack direction="row" alignItems="center">
        {data.length > 0 && (
          <BarChart
            colors={["#bc141a"]}
            dataset={data}
            yAxis={[
              {
                scaleType: "band",
                dataKey: "complaint",
              },
            ]}
            series={[{ dataKey: "data", valueFormatter }]}
            layout="horizontal"
            xAxis={[
              {
                label: category,
              },
            ]}
            {...chartSetting}
          />
        )}
      </Stack>
    </div>
  );
}

const data = [
  { complaint: "accident", data: 12 },
  { complaint: "brawl", data: 45 },
  { complaint: "child abuse", data: 3 },
  { complaint: "counterfeit and fake products", data: 21 },
  { complaint: "debt", data: 38 },
  { complaint: "gossip", data: 27 },
  { complaint: "marital conflict", data: 8 },
  { complaint: "noise disturbance", data: 50 },
  { complaint: "sanitary concerns", data: 17 },
  { complaint: "sexual harassment", data: 32 },
  { complaint: "others", data: 5 },
];
