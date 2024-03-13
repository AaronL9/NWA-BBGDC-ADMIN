import PropTypes from "prop-types";
import { useState } from "react";
import { toDateTime } from "../../util/dateFormatter.js";
import LoadingButton from "@mui/lab/LoadingButton";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import StatusMenu from "./StatusMenu.jsx";
import ConfirmDeleteReport from "./ConfirmDeleteReport.jsx";

// firebase
import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import Spinner from "../global/spinner/Spinner.jsx";
import CustomizedSnackbars from "../global/snackbar/CustomizedSnackbars.jsx";

export default function ReportForm({ data, onChangeHandler }) {
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
                    <label htmlFor="reportee-name">Reportee:</label>
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
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
}

ReportForm.propTypes = {
  data: PropTypes.object,
  onChangeHandler: PropTypes.func,
};
