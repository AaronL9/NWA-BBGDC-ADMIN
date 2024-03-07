import * as React from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../global/snackbar/CustomizedSnackbars";

// firebase
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../config/firebase";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmDeleteNews({ docID, setLoading }) {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [errorOccur, setErrorOccur] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    setOpen(false);
    try {
      setLoading(true);

      await deleteDoc(doc(db, "news", docID));
      await deleteObject(ref(storage, `news/${docID}/news_image`));

      setTimeout(() => {
        setLoading(false);
        navigate("/news");
      }, 3000);
    } catch (error) {
      console.log(error);
      setErrorOccur(true);
      setLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Button
        aria-label="delete"
        color="error"
        onClick={handleClickOpen}
        startIcon={<DeleteIcon />}
      >
        Delete
      </Button>
      <CustomizedSnackbars
        severity="error"
        message="Something weng wrong"
        show={errorOccur}
        setShow={setErrorOccur}
      />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Delete Report"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this news? This action is
            irreversible, and the data will be permanently removed from the
            system. Please confirm your decision before proceeding
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm}>Confirm</Button>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

ConfirmDeleteNews.propTypes = {
  uid: PropTypes.string,
  docID: PropTypes.string,
  setLoading: PropTypes.func,
};
