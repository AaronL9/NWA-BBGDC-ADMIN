import * as React from "react";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  updateEmail,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../../../config/firebase";

export default function ChangeEmailDialog() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [openUpdateEmail, setOpenUpdateEmail] = React.useState(false);
  const [toVerify, setToVerify] = React.useState(false);

  const onSubmit = async (event) => {
    try {
      setLoading(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries(formData.entries());
      const email = formJson.email;
      const password = formJson.password;

      await reauthenticateWithCredential(
        auth.currentUser,
        EmailAuthProvider.credential(email, password)
      );

      setOpenUpdateEmail(true);
    } catch (error) {
      alert(error.code);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const onVerify = async (event) => {
    try {
      setLoading(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries(formData.entries());
      const email = formJson.email;

      await verifyBeforeUpdateEmail(auth.currentUser, email);
      setToVerify(true);
      alert("Verification link sent");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onConfirm = async (event) => {
    try {
      setLoading(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries(formData.entries());
      const email = formJson.email;

      await updateEmail(auth.currentUser, email);

      setToVerify(false);
      handleUpdateEmail();
    } catch (error) {
      if (error.code === "auth/operation-not-allowed") {
        alert("Email not yet verified");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleUpdateEmail = () => {
    setOpenUpdateEmail(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        sx={{ textTransform: "capitalize" }}
        onClick={handleClickOpen}
      >
        Change Email
      </Button>
      <Dialog
        open={open}
        PaperProps={{
          component: "form",
          onSubmit: onSubmit,
        }}
      >
        <DialogTitle>Change Email Address</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter your credentials.</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="current-email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="current-password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" disabled={loading}>
            Cancel
          </Button>
          <LoadingButton loading={loading} type="submit">
            Update
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUpdateEmail}
        PaperProps={{
          component: "form",
          onSubmit: toVerify ? onConfirm : onVerify,
        }}
      >
        <DialogTitle>Change Email Address</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your new email address here.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="new-email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateEmail} color="error" disabled={loading}>
            Cancel
          </Button>
          <LoadingButton loading={loading} type="submit">
            {toVerify ? "Confirm" : "Update"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
