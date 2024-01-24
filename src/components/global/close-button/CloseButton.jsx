import PropTypes from "prop-types";
import "./close_button.css";

export default function CloseButton({ setOpenForm }) {
  return (
    <button
      onClick={() => setOpenForm(false)}
      type="button"
      className="btn-close"
    >
      <span className="icon-cross"></span>
    </button>
  );
}

CloseButton.propTypes = {
  setOpenForm: PropTypes.func,
};
