import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  function onChangeHandler(key, value) {
    setDetails((prev) => ({ ...prev, [key]: value }));
  }

  const assignToAllPatrollers = async () => {
    setLoading(true);
    try {
      const assignRef = doc(db, "live_location", id);
      await setDoc(assignRef, {
        coords: details.geoPoint,
        location: details.location,
        offense: details.offense,
      });

      fetch(`http://localhost:3000/api/push/alert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.admin.accessToken,
        },
        body: JSON.stringify({ reportType: details.offense }),
      });

      alert("This report location is live to patrollers");
    } catch (error) {
      alert(error.message);
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
      } catch (error) {
        console.log(error);
      }
    };
    fetchReport();
  }, [id]);

  return (
    <>
      {!details ? (
        <div className="global-loader">
          <Loader />
        </div>
      ) : (
        <div className="report">
          <ReportForm data={details} onChangeHandler={onChangeHandler} />
          <div className="report-form__actions">
            {details.status !== "resolved" && (
              <LoadingButton
                loading={loading}
                variant="contained"
                onClick={assignToAllPatrollers}
              >
                Forward location to patrollers
              </LoadingButton>
            )}
          </div>
          <h2>Images/Videos</h2>
          <div className="report-form__media">
            {details.imageURL.map((url, index) => (
              <ReportMedia key={index} url={url} />
            ))}
            {details?.videoURL.length !== 0 && (
              <a href={details.videoURL[0]} target="_blank" rel="noreferrer">
                <img
                  className={"loaded"}
                  src={
                    "https://awlights.com/wp-content/uploads/sites/31/2017/05/video-placeholder.png"
                  }
                />
              </a>
            )}
          </div>
          {details && (
            <div className="report__map">
              <MapView coords={details.geoPoint} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
