export function AuthErrorMessages(code) {
  switch (code) {
    case "auth/not-an-admin":
      return "You are not authorize";
    case "auth/invalid-email": 
      return "Invalid Email"
    default:
      return "Invalid Credentials";
  }
}