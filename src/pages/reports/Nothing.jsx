import PropTypes from "prop-types";

export default function Nothing({ label }) {
  return (
    <div className="nothing">
      <div className="nothing-overlay" />
      <div>
        <h2>No new {label}</h2>
      </div>
    </div>
  );
}
Nothing.propTypes = {
  label: PropTypes.string,
};
