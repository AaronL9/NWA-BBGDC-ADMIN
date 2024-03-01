import PropTypes from "prop-types";

export default function PatrollerProfileCard({ data }) {
  const avatarSrc = data.avatarUrl ?? "/images/profile-circle.png";

  return (
    <div className="patroller-card">
      <img className="patroller-card__profile-pic" src={avatarSrc} />
      <div className="patroller-card__details">
        <ul className="patroller-card__info-list">
          <li>
            <strong>First Name:</strong>
            <br />
            {data.firstName}
          </li>
          <li>
            <strong>Last Name: </strong>
            <br />
            {data.lastName}
          </li>
          <li>
            <strong>Contact:</strong> <br /> {data.phoneNumber}
          </li>
          <li>
            <strong>Address:</strong>
            <br /> {data.address}
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
