import { useNavigate } from "react-router-dom";
import { convertDateFormat } from "../../util/dateFormatter";
import PropTypes from "prop-types";

const CrimeRecordsTable = ({ archives }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="crime-records__table" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Reportee</th>
              <th>Offense Type</th>
              <th>Location</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {archives.map((archive) => (
              <tr key={archive.id}>
                <td>{archive.reporteeName}</td>
                <td>{archive.offense}</td>
                <td>{archive.location}</td>
                <td>{convertDateFormat(archive.date)}</td>
                <td className="action">
                  <button className="view" onClick={() => navigate(archive.id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CrimeRecordsTable;

CrimeRecordsTable.propTypes = {
  archives: PropTypes.array,
};
