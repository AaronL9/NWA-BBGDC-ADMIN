import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { reportDetails } from "./reportDetails";
import { getReportMedia } from "./getReportMedia";
import "./report_view.css";

// firebase
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

// component
import MapView from "../../components/reports/MapView";
import { archiveDocument } from "../../util/archiveDocument";
import { moveToInterventions } from "../../util/interventions";
import ReportForm from "../../components/reports/ReportForm";
import Loader from "../../components/global/loader/Loader";
import ReportMedia from "../../components/reports/ReportMedia";

export default function ReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState();
  const [media, setMedia] = useState([]);

  const handleArchive = async () => {
    await archiveDocument(id);
    navigate("/reports");
  };

  const handleInterventions = async () => {
    await moveToInterventions(id);
    navigate("/reports");
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const docRef = doc(db, "reports", id);
        const docSnap = await getDoc(docRef);
        setDetails(docSnap.data());

        const result = await getReportMedia(`reports/${id}`);
        setMedia(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReport();
  }, [id, setMedia]);

  console.log(details);

  return (
    <>
      {!details ? (
        <div className="global-loader">
          <Loader />
        </div>
      ) : (
        <div className="report">
          <ReportForm data={details} />
          {details?.status === "report" ? (
            <button
              className="report__archive-btn"
              onClick={handleInterventions}
            >
              Change status to ongoing
            </button>
          ) : (
            <button className="report__archive-btn" onClick={handleArchive}>
              Archive
            </button>
          )}
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
