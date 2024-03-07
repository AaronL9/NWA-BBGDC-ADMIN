import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Spinner from "../global/spinner/Spinner";

export default function StatusMenu({ data, onChangeHandler, docID }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const changeStatus = async (value) => {
    setAnchorEl(null);
    try {
      setLoading(true);

      onChangeHandler("status", value);

      const reportRef = doc(db, "reports", docID);
      await updateDoc(reportRef, { status: value });
      if (value === "resolved")
        await deleteDoc(doc(db, "live_location", docID));
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <Spinner />
        </div>
      )}
      <div className="MUI-change-status-button-container">
        <Button
          id="demo-positioned-button"
          aria-controls={open ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{ color: "black", marginInline: "1rem" }}
          variant="outlined"
        >
          <div
            className={`MUI-table-cell-status-circle status-${data.status}`}
          ></div>
          {data.status}
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem onClick={() => changeStatus("report")}>Report</MenuItem>
          <MenuItem onClick={() => changeStatus("ongoing")}>Ongoing</MenuItem>
          <MenuItem onClick={() => changeStatus("resolved")}>Resolved</MenuItem>
        </Menu>
      </div>
    </>
  );
}

StatusMenu.propTypes = {
  data: PropTypes.object,
  onChangeHandler: PropTypes.func,
  docID: PropTypes.string,
};
