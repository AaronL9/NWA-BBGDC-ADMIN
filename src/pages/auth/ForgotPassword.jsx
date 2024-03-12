import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { adminInputData } from "./admin_login_data";
import "./admin_login.css";

import InputField from "../../components/auth/InputField";
import LogoTitle from "../../components/auth/LogoTitle";
import Spinner from "../../components/global/spinner/Spinner";
import AuthErrorMessage from "../../components/auth/AuthErrorMessage";
import { auth } from "../../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import CustomizedSnackbars from "../../components/global/snackbar/CustomizedSnackbars";

export default function ForgotPassword() {
  const { authError, setAuthError } = useAuthContext();

  const [email, setEmail] = useState("");
  const [showSnackbar, setShowSnackBar] = useState(false);

  const [loading, setLoading] = useState(false);

  function resetPassword(e) {
    e.preventDefault();
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setShowSnackBar(true);
      })
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setAuthError(null);
  }, [setAuthError]);

  return (
    <>
      {loading && (
        <div className="sign-in-loader">
          <Spinner />
        </div>
      )}
      <CustomizedSnackbars
        severity="success"
        message="Email sent successfully"
        show={showSnackbar}
        setShow={setShowSnackBar}
        position={{ vertical: "top", horizontal: "center" }}
      />
      <div className="admin-login">
        <LogoTitle />
        <div className="container">
          <div className="forms">
            <div className="form">
              <span className="title">Admin</span>
              <form>
                <InputField
                  value={email}
                  variation={adminInputData.email}
                  setValue={setEmail}
                />
                {authError && <AuthErrorMessage message={authError} />}
                <div className="forgot-text">
                  <Link className="text" to={"/"}>
                    go back?
                  </Link>
                </div>
                <div className="input-field button">
                  <button className="btn" onClick={resetPassword}>
                    Send email
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
