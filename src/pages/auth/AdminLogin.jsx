import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { adminInputData } from "./admin_login_data";
import "./admin_login.css";

import InputField from "../../components/auth/InputField";
import LogoTitle from "../../components/auth/LogoTitle";
import Spinner from "../../components/global/spinner/Spinner";
import AuthErrorMessage from "../../components/auth/AuthErrorMessage";

export default function AdminLogin() {
  const { signin, authenticating, authError } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signinHandler(e) {
    e.preventDefault();
    signin(email, password);
  }

  return (
    <>
      {authenticating && (
        <div className="sign-in-loader">
          <Spinner />
        </div>
      )}
      <div className="admin-login">
        <LogoTitle />
        <div className="container">
          <div className="forms">
            <div className="form">
              <span className="title">Admin</span>
              <form onSubmit={signinHandler}>
                <InputField
                  value={email}
                  variation={adminInputData.email}
                  setValue={setEmail}
                />
                <InputField
                  value={password}
                  variation={adminInputData.password}
                  setValue={setPassword}
                />
                {authError && (
                  <AuthErrorMessage message={authError} />
                )}
                <div className="forgot-text">
                  <Link className="text">Forgot password?</Link>
                </div>
                <div className="input-field button">
                  <button className="btn" type="submit">
                    Sign In
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
