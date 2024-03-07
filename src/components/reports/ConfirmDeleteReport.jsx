import * as React from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
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
import { db, storage } from "../../config/firebase";
import { deleteObject, listAll, ref } from "firebase/storage";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmDeleteReport({ docID }) {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorOccur, setErrorOccur] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);

      await deleteDoc(doc(db, "reports", docID));

      const listRef = ref(storage, `reports/${docID}`);
      const listResult = await listAll(listRef);
      await Promise.all(
        listResult.items.map(async (itemRef) => {
          await deleteObject(itemRef);
          console.log(`Deleted file: ${itemRef.name}`);
        })
      );

      setTimeout(() => {
        setLoading(false);
        setOpen(false);
        navigate("/reports");
      }, 3000);
    } catch (error) {
      console.log(error);
      setErrorOccur(true);
      setLoading(false);
      setOpen(false);
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
            Are you sure you want to delete this report? This action is
            irreversible, and the data will be permanently removed from the
            system. Please confirm your decision before proceeding
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton onClick={handleConfirm} loading={loading}>
            Confirm
          </LoadingButton>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

ConfirmDeleteReport.propTypes = {
  uid: PropTypes.string,
  docID: PropTypes.string,
};
