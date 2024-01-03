import PropTypes from "prop-types";

const AuthErrorMessage = ({ message }) => {
  return (
    <div className="auth-error-message">
      <i className="bx bxs-error-circle"></i>
      <span>{message}</span>
    </div>
  );
};

export default AuthErrorMessage;

AuthErrorMessage.propTypes = {
  message: PropTypes.string,
};
