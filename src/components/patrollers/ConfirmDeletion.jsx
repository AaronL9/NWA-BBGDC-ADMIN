import * as React from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmDeletion({ uid }) {
  const authCtx = React.useContext(AuthContext);
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/admin/delete_patroller`,
        {
          method: "DELETE",
          body: JSON.stringify({ uid }),
          headers: {
            "Content-Type": "application/json",
            Authorization: authCtx.admin.accessToken,
          },
        }
      );

      const json = await response.json();

      if (json?.error || !response.ok) {
        throw new Error(json.error);
      }

      console.log(json.message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
      navigate("/patrollers");
    }
  };

  return (
    <React.Fragment>
      <IconButton
        aria-label="delete"
        size="large"
        color="error"
        onClick={handleClickOpen}
      >
        <DeleteIcon fontSize="inherit" />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Delete Patroller Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete the patroller account? This action
            is irreversible, and the account&apos;s data will be permanently
            removed from the system. Please confirm your decision before
            proceeding
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <LoadingButton onClick={handleConfirm} loading={loading}>
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

ConfirmDeletion.propTypes = {
  uid: PropTypes.string,
};
