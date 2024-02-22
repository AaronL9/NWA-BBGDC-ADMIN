import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReportMedia } from "./getReportMedia";
import "./report_view.css";
import "./reports.css";

// firebase
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

// component
import LoadingButton from "@mui/lab/LoadingButton";
import MapView from "../../components/reports/MapView";
import ReportForm from "../../components/reports/ReportForm";
import Loader from "../../components/global/loader/Loader";
import ReportMedia from "../../components/reports/ReportMedia";
import { AuthContext } from "../../context/AuthContext";

export default function ReportView() {
  const { id } = useParams();
  const [details, setDetails] = useState();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  const assignToAllPatrollers = async () => {
    setLoading(true);
    try {
      const assignRef = doc(db, "live_location", id);
      await setDoc(assignRef, {
        coords: details.geoPoint,
        location: details.location,
      });
      alert("This report location is live to patrollers");
      const response = await fetch(
        `http://${import.meta.env.VITE_API_ENDPOINT}/api/push/alert`,
        {
          method: "GET",
          headers: {
            Authorization: authCtx.admin.accessToken,
          },
        }
      );
      const json = await response.json();
      if (!response.ok) {
        console.log(json);
      }
      console.log(json);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const docRef = doc(db, "reports", id);
        const docSnap = await getDoc(docRef);
        setDetails({ ...docSnap.data(), docID: id });

        const result = await getReportMedia(`reports/${id}`);
        setMedia(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReport();
  }, [id, setMedia]);

  return (
    <>
      {!details ? (
        <div className="global-loader">
          <Loader />
        </div>
      ) : (
        <div className="report">
          <ReportForm data={details} />

          <div className="report__actions">
            <LoadingButton
              loading={loading}
              variant="contained"
              onClick={assignToAllPatrollers}
            >
              Forward location to patrollers
            </LoadingButton>
          </div>

          <h2>Images/Videos</h2>
          <div className="report__media">
            {media.map((url, index) => (
              <ReportMedia key={index} url={url} />
            ))}
          </div>
          {details && <MapView coords={details.geoPoint} />}
        </div>
      )}
    </>
  );
}
