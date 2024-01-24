import PropTypes from "prop-types";
import CloseButton from "../global/close-button/CloseButton";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function PatrollerForm({ setOpenForm }) {
  const authCtx = useContext(AuthContext);
  const [patrollerData, setPatrollerData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "none",
    address: "",
    phoneNo: "",
    password: "",
  });

  const onChangeInputsHandler = (e) => {
    const elem = e.target;
    if (!(elem.tagName === "INPUT" && elem.name in patrollerData)) return;

    setPatrollerData((prev) => ({ ...prev, [elem.name]: elem.value }));
  };

  const onSubmitHanlder = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/admin/add_patroller", {
      method: "POST",
      body: JSON.stringify(patrollerData),
      headers: {
        "Content-Type": "application/json",
        Authorization: authCtx.admin.accessToken,
      },
    });

    const json = await response.json();
    if (response.ok) {
      console.log(json.error);
      setOpenForm(false);
    } else {
      console.log(json);
    }
  };

  return (
    <div className="patroller-form-wrapper">
      <div className="patroller-form-container">
        <CloseButton setOpenForm={setOpenForm} />
        <div className="patroller-form">
          <p className="header">Add Patroller</p>
          <form onSubmit={onSubmitHanlder} onChange={onChangeInputsHandler}>
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
            <input
              type="text"
              placeholder="Username"
              name="username"
              required
            />
            <input
              type="text"
              placeholder="Phone number"
              name="phoneNo"
              required
            />
            <input type="text" placeholder="Email (optional)" name="email" />
            <input type="text" placeholder="Address" name="address" />
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
            />
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
