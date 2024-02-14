import PropTypes from "prop-types";
import { toDateTime } from "../../util/dateFormatter.js";
import StatusMenu from "./StatusMenu.jsx";

export default function ReportForm({ data, onChangeHandler }) {
  return (
    <>
      <h2>Citizen&apos;s Crime/Incident Report</h2>
      <form className="report-form">
        <table>
          <caption className="report-form__captions">
            <span>Status:</span>{" "}
            <StatusMenu status={data.status} docID={data.docID} />
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
                      disabled
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
                      disabled
                    />
                  </div>
                </section>
              </td>
            </tr>
            <tr>
              {/* <td colSpan="2">
                  <label htmlFor="date-time">Date / Time Occured</label>
                  <input
                    id="date-time"
                    type="datetime-local"
                    value="2023-12-28T17:47"
                  />
                  <span>(On or Between)</span>
                  <input type="datetime-local" />
                </td> */}
              <td>
                <label htmlFor="date">Date/Time Reported:</label>
                <input
                  id="date"
                  type="datetime-local"
                  value={toDateTime(data.timestamp)}
                  name="date"
                  disabled
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
                    onChange={onChangeHandler}
                    disabled
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
                  disabled
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
