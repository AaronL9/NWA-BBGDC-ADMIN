import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PropTypes from "prop-types";

export default function CustomizedSnackbars({
  message,
  show,
  severity,
  setShow,
  position = { vertical: "bottom", horizontal: "right" },
}) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShow(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={position}
        open={show}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

CustomizedSnackbars.propTypes = {
  message: PropTypes.string,
  show: PropTypes.bool,
  severity: PropTypes.string,
  setShow: PropTypes.func,
  position: PropTypes.object,
};
