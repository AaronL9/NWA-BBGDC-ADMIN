import { useState, useEffect } from "react";
import { getRecord } from "../../util/archiveDocument";
import { useParams } from "react-router-dom";
import ReportForm from "../../components/reports/ReportForm";
import Loader from "../../components/global/loader/Loader.jsx";

export default function RecordView() {
  const [data, setData] = useState(null);
  const { id } = useParams();

  const onChangeHandler = (e) => {
    const key = e.target.name;
    console.log(e.target.value);
    setData((prev) => ({ ...prev, [key]: e.target.value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecord(id);
      setData(data);
    };
    fetchData();
  }, [id]);

  console.log(id);

  return !data ? (
    <div className="global-loader">
      <Loader />
    </div>
  ) : (
    <div className="report">
      <ReportForm data={data} onChangeHandler={onChangeHandler} />
    </div>
  );
}
