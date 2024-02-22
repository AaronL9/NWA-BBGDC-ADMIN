import "./add_button.css";
import PropTypes from "prop-types";

export default function AddButton({ setOpenForm }) {
  return (
    <button onClick={() => setOpenForm(true)} className="global-add-button">
      <div className="global-add-button__sign">+</div>

      <div className="global-add-button__text">Add</div>
    </button>
  );
}

AddButton.propTypes = {
  setOpenForm: PropTypes.func,
};
