import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function PatrollerProfileCard({
  firstName,
  lastName,
  email,
  contactNum,
  roomId,
  uid,
  address,
}) {
  const navigate = useNavigate();
  return (
    <div className="patroller-card">
      <img
        className="patroller-card__profile-pic"
        src="/images/profile-circle.png"
      />
      <div className="patroller-card__details">
        <span className="patroller-card__name">{`${firstName} ${lastName}`}</span>
        <ul className="patroller-card__info-list">
          <li>
            <strong>Email:</strong> {email}
          </li>
          <li>
            <strong>Address:</strong> {address}
          </li>
          <li>
            <strong>Phone:</strong> {contactNum}
          </li>
        </ul>
        <div className="patroller-card__controls">
          <button onClick={() => navigate(`chat/${roomId}`)}>Message</button>
          <button onClick={() => navigate(`location/${uid}`)}>Locate</button>
        </div>
      </div>
    </div>
  );
}

PatrollerProfileCard.propTypes = {
  uid: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  contactNum: PropTypes.string,
  roomId: PropTypes.string,
  address: PropTypes.string,
};
