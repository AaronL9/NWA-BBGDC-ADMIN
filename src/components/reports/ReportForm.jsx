import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { toDateTime } from "../../util/dateFormatter.js";
import LoadingButton from "@mui/lab/LoadingButton";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import StatusMenu from "./StatusMenu.jsx";
import ConfirmDeleteReport from "./ConfirmDeleteReport.jsx";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";

// firebase
import { db } from "../../config/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

// components
import Spinner from "../global/spinner/Spinner.jsx";
import CustomizedSnackbars from "../global/snackbar/CustomizedSnackbars.jsx";
import AssignPatrollerModal from "./AssignPatrollerModal.jsx";
import { useParams } from "react-router";
import ReportMedia from "./ReportMedia.jsx";

export default function ReportForm({ data, onChangeHandler, fetchReport }) {
  const { id } = useParams();
  const [isDisabled, setIsDisabled] = useState(true);

  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  async function onUpdate() {
    try {
      setLoading(true);
      if (!isDisabled) {
        await updateDoc(doc(db, "reports", data.docID), {
          description: data.description,
          location: data.location,
        });
        setShowSnackbar(true);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsDisabled((prev) => !prev);
      setLoading(false);
    }
  }

  return (
    <>
      <CustomizedSnackbars
        message="Success! The report has been updated."
        setShow={setShowSnackbar}
        show={showSnackbar}
        severity="success"
        position={{ vertical: "top", horizontal: "center" }}
      />
      {loading && (
        <div className="loader-overlay">
          <Spinner />
        </div>
      )}
      <h2>REPORT</h2>
      <form className="report-form">
        <table>
          <caption className="report-form__captions">
            <div className="report-form__status">
              <span>STATUS:</span>
              <StatusMenu
                data={data}
                onChangeHandler={onChangeHandler}
                docID={data.docID}
              />
            </div>
            <div className="report-form__controlls">
              <LoadingButton
                variant="outlined"
                startIcon={isDisabled ? <EditIcon /> : <DoneIcon />}
                sx={{ marginLeft: "auto" }}
                color="inherit"
                onClick={onUpdate}
              >
                {isDisabled ? "edit" : "done"}
              </LoadingButton>
              <ConfirmDeleteReport docID={data.docID} />
            </div>
          </caption>
          <tbody>
            <tr>
              <td colSpan="3">
                <section className="report-form__first-cell">
                  <div>
                    <label htmlFor="crime-type">Crime/Incident:</label>
                    <input
                      id="crime-type"
                      type="text"
                      value={data.offense}
                      name="offense"
                      onChange={onChangeHandler}
                      disabled={true}
                      style={{ textTransform: "capitalize" }}
                    />
                  </div>
                  <div>
                    <label htmlFor="reportee-name">Complainant:</label>
                    <input
                      id="reportee-name"
                      type="text"
                      value={data.reporteeName}
                      name="reporteeName"
                      onChange={onChangeHandler}
                      disabled={true}
                    />
                  </div>
                </section>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="date">Date/Time Reported:</label>
                <input
                  id="date"
                  type="datetime-local"
                  name="date"
                  value={toDateTime(data.timestamp)}
                  disabled={true}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="3">
                <div className="report-form__location">
                  <label htmlFor="record-location">Location:</label>
                  <input
                    type="text"
                    name="location"
                    value={data.location}
                    onChange={(e) =>
                      onChangeHandler("location", e.target.value)
                    }
                    disabled={isDisabled}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="3">
                <label htmlFor="details">Details:</label>
                <br />
                <textarea
                  name="description"
                  id=""
                  rows="5"
                  value={data.description}
                  onChange={(e) =>
                    onChangeHandler("description", e.target.value)
                  }
                  disabled={isDisabled}
                ></textarea>
                <div className="report-form__media">
                  {data.imageURL.map((url, index) => (
                    <ReportMedia key={index} url={url} />
                  ))}
                  {data?.videoURL.length !== 0 && (
                    <a href={data.videoURL[0]} target="_blank" rel="noreferrer">
                      <img
                        className={"loaded"}
                        src={
                          "https://awlights.com/wp-content/uploads/sites/31/2017/05/video-placeholder.png"
                        }
                      />
                    </a>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot style={{ backgroundColor: "#f0f2fa" }}>
            <tr>
              <td>
                <div>
                  <Stack direction="row" justifyContent="space-between">
                    <h3>Patroller Report</h3>
                    <AssignPatrollerModal fetchReport={fetchReport} />
                  </Stack>
                </div>
                {data?.assignPatroller &&
                  data.assignPatroller.map((data, index) => (
                    <p key={index}>{data}</p>
                  ))}
                <textarea
                  style={{
                    borderRadius: 8,
                    marginTop: "1rem",
                    backgroundColor: "#f4f4f8",
                  }}
                  rows={5}
                  value={data?.action?.description ?? ""}
                  disabled
                />
                <div className="report-form__media">
                  {data?.action?.photoURL.length > 0 &&
                    data.action.photoURL.map((url, index) => (
                      <ReportMedia key={index} url={url} />
                    ))}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  <Stack direction="row" justifyContent="space-between">
                    <h3>Ratings</h3>
                  </Stack>
                </div>

                {data?.ratings ? (
                  <Rating
                    name="read-only"
                    value={data.ratings.value}
                    readOnly
                  />
                ) : (
                  <p>No ratings</p>
                )}
                <textarea
                  style={{
                    borderRadius: 8,
                    marginTop: "1rem",
                    backgroundColor: "#f4f4f8",
                  }}
                  rows={5}
                  value={data?.ratings?.description ?? ""}
                  disabled
                  placeholder="Complainant Feedback..."
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </form>
    </>
  );
}

ReportForm.propTypes = {
  data: PropTypes.object,
  onChangeHandler: PropTypes.func,
};
