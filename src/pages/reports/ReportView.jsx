import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./report_view.css";
import "./reports.css";

// firebase
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

// component
import MapView from "../../components/reports/MapView";
import ReportForm from "../../components/reports/ReportForm";
import Loader from "../../components/global/loader/Loader";
import ReportMedia from "../../components/reports/ReportMedia";
import { AuthContext } from "../../context/AuthContext";

export default function ReportView() {
  const { id } = useParams();
  const authCtx = useContext(AuthContext);

  const [details, setDetails] = useState();
  const [loading, setLoading] = useState(false);

  function onChangeHandler(key, value) {
    setDetails((prev) => ({ ...prev, [key]: value }));
  }

  // const assignToAllPatrollers = async () => {
  //   setLoading(true);
  //   try {
  //     const assignRef = doc(db, "live_location", id);
  //     await setDoc(assignRef, {
  //       coords: details.geoPoint,
  //       location: details.location,
  //       offense: details.offense,
  //     });

  //     fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/push/alert`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: authCtx.admin.accessToken,
  //       },
  //       body: JSON.stringify({ reportType: details.offense }),
  //     });

  //     alert("This report location is live to patrollers");
  //   } catch (error) {
  //     alert(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  async function fetchReport() {
    try {
      const docRef = doc(db, "reports", id);
      const docSnap = await getDoc(docRef);
      setDetails({ ...docSnap.data(), docID: id });
      console.log(docSnap.data());
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
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
          <ReportForm
            data={details}
            onChangeHandler={onChangeHandler}
            fetchReport={fetchReport}
          />
          {/* <div className="report-form__actions">
            {details.status !== "resolved" && (
              <LoadingButton
                loading={loading}
                variant="contained"
                onClick={assignToAllPatrollers}
              >
                Forward location to patrollers
              </LoadingButton>
            )}
          </div> */}
          {/* <h2>Images/Videos</h2>
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
          </div> */}
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
