import PropTypes from "prop-types";
import { toDateTime } from "../../util/dateFormatter.js";
import LoadingButton from "@mui/lab/LoadingButton";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import StatusMenu from "./StatusMenu.jsx";
import { useState } from "react";

export default function ReportForm({ data, onChangeHandler }) {
  const [isDisabled, setIsDisabled] = useState(true);

  return (
    <>
      <h2>REPORT</h2>
      <form className="report-form">
        <table>
          <caption className="report-form__captions">
            <div className="report-form__status">
              <span>STATUS:</span>
              <StatusMenu status={data.status} docID={data.docID} />
            </div>
            <LoadingButton
              variant="outlined"
              startIcon={isDisabled ? <EditIcon /> : <DoneIcon />}
              sx={{ marginLeft: "auto" }}
              color="inherit"
              onClick={() => setIsDisabled((prev) => !prev)}
            >
              {isDisabled ? "edit" : "done"}
            </LoadingButton>
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
                      disabled={isDisabled}
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
                      disabled={isDisabled}
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
                  disabled={isDisabled}
                />
                {/* <span>{convertUnixTimestamp(data.timestamp)}</span> */}
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
                    onChange={onChangeHandler}
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
                  onChange={onChangeHandler}
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
