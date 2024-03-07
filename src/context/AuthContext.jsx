import { createContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import PropTypes from "prop-types";
import { AuthErrorMessages } from "../util/authError.js";

export const AuthContext = createContext({
  admin: null,
  signin: () => {},
  logout: () => {},
  authenticating: false,
  authError: null,
});

export function AuthContextProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);

  async function signin(email, password) {
    setAuthenticating(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(AuthErrorMessages(error.code));
    }
    setAuthenticating(false);
  }

  function logout() {
    try {
      signOut(auth);
    } catch (error) {
      console.log(error.code);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdTokenResult();
          if (token?.claims?.admin) {
            setAdmin(user);
            setAuthError(null);
          } else {
            logout();
            setAdmin(null);
            throw { code: "auth/not-an-admin" };
          }
        } catch (error) {
          setAuthError(AuthErrorMessages(error.code));
        }
      } else setAdmin(user);

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    admin,
    signin,
    logout,
    authenticating,
    authError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = {
  children: PropTypes.element,
};
