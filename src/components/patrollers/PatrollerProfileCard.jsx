import PropTypes from "prop-types";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext";

export default function PatrollerProfileCard({
  firstName,
  lastName,
  email,
  contactNum,
  roomId,
  uid,
  address,
  avatar,
}) {
  const navigate = useNavigate();
  const avatarSrc = avatar ? avatar : "/images/profile-circle.png";
  const { setAvatar } = useContext(ChatContext);
  return (
    <div className="patroller-card">
      <img className="patroller-card__profile-pic" src={avatarSrc} />
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
          <button
            onClick={() => {
              setAvatar(avatar);
              navigate(`chat/${firstName}_${lastName}/${roomId}`);
            }}
          >
            Message
          </button>
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
  avatar: PropTypes.string,
};
