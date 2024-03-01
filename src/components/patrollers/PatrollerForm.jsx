import PropTypes from "prop-types";
import CloseButton from "../global/close-button/CloseButton";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../global/spinner/Spinner";
import { formatPhoneNumber } from "../../util/stringFormatter";

export default function PatrollerForm({ setOpenForm }) {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [patrollerData, setPatrollerData] = useState({
    phoneNumber: "",
    firstName: "",
    lastName: "",
    address: "",
  });

  const onChangeInputsHandler = (e) => {
    const elem = e.target;
    if (!(elem.tagName === "INPUT" && elem.name in patrollerData)) return;

    setPatrollerData((prev) => ({ ...prev, [elem.name]: elem.value }));
  };

  const onSubmitHanlder = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formattedPhoneNumber = formatPhoneNumber(patrollerData.phoneNumber);
      patrollerData.phoneNumber = formattedPhoneNumber;

      console.log(patrollerData);
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/admin/add_patroller`,
        {
          method: "POST",
          body: JSON.stringify(patrollerData),
          headers: {
            "Content-Type": "application/json",
            Authorization: authCtx.admin.accessToken,
          },
        }
      );

      const json = await response.json();
      if (!response.ok) {
        alert(json.error);
        return;
      }

      setOpenForm(false);
      alert(json.message);
    } catch (error) {
      alert("Failed to add patroller: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className="loader-overlay">
      <Spinner />
    </div>
  ) : (
    <div className="patroller-form-wrapper">
      <div className="patroller-form-container">
        <CloseButton setOpenForm={setOpenForm} />
        <div className="patroller-form">
          <p className="header">Add Patroller</p>
          <form onSubmit={onSubmitHanlder} onChange={onChangeInputsHandler}>
            <input
              type="text"
              placeholder="Phone number"
              name="phoneNumber"
              maxLength={13}
              pattern="(\+639\d{9}|09\d{9})"
              title="Please enter a valid Philippine mobile number"
              required
            />
            <fieldset className="patroller-form__full-name">
              <input
                type="text"
                placeholder="First name"
                name="firstName"
                required
              />
              <input
                type="text"
                placeholder="Last name"
                name="lastName"
                required
              />
            </fieldset>
            <input type="text" placeholder="Address" name="address" required />
            <input type="submit" className="button" value="Add" />
          </form>
        </div>
      </div>
    </div>
  );
}

PatrollerForm.propTypes = {
  setOpenForm: PropTypes.func,
};
