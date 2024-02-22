import PropTypes from "prop-types";
import { useState } from "react";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function PatrollerProfileCard({ data }) {
  const avatarSrc = data.avatarUrl ?? "/images/profile-circle.png";

  const [visible, setVisible] = useState(false);
  const inputType = visible ? "text" : "password";

  return (
    <div className="patroller-card">
      <img className="patroller-card__profile-pic" src={avatarSrc} />
      <p className="patroller-card__name">{`${data.firstName} ${data.lastName}`}</p>
      <div className="patroller-card__details">
        <ul className="patroller-card__info-list">
          <li>
            <strong>Contact:</strong> <br /> {data.phoneNo}
          </li>
          <li>
            <strong>Email:</strong> <br />
            {data.email}
          </li>
          <li>
            <strong>Address:</strong>
            <br /> {data.address}
          </li>
          <li className="patroller-card__password">
            <strong>password:</strong>
            <br />
            <input type={inputType} value={data.password} disabled />
            {visible ? (
              <VisibilityOffIcon onClick={() => setVisible(false)} />
            ) : (
              <VisibilityIcon onClick={() => setVisible(true)} />
            )}
          </li>
        </ul>
        <div className="patroller-card__controls"></div>
      </div>
    </div>
  );
}

PatrollerProfileCard.propTypes = {
  data: PropTypes.object,
  uid: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  contactNum: PropTypes.string,
  roomId: PropTypes.string,
  address: PropTypes.string,
  avatar: PropTypes.string,
};
