import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function PatrollerProfileCard({
  firstName,
  lastName,
  email,
  contactNum,
  roomId,
}) {
  const navigate = useNavigate();
  return (
    <div className="patroller-card">
      <img className="patroller-card__profile-pic" src="/images/profile.jpeg" />
      <div className="patroller-card__details">
        <span className="patroller-card__name">{`${firstName} ${lastName}`}</span>
        <ul className="patroller-card__info-list">
          <li>
            <strong>Email:</strong> {email}
          </li>
          <li>
            <strong>Address:</strong> 123 Main Street
          </li>
          <li>
            <strong>Phone:</strong> {contactNum}
          </li>
        </ul>
        <div className="patroller-card__controls">
          <button onClick={() => navigate(roomId)}>Message</button>
          <button>Locate</button>
        </div>
      </div>
    </div>
  );
}

PatrollerProfileCard.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  contactNum: PropTypes.string,
  roomId: PropTypes.string,
};
