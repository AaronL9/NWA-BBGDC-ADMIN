import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function StatusMenu({ status, docID }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [displayStatus, setDisplayStatus] = React.useState(status);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const changeStatus = async (value) => {
    setAnchorEl(null);
    setDisplayStatus(value);
    const reportRef = doc(db, "reports", docID);
    await updateDoc(reportRef, { status: value });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="MUI-change-status-button-container">
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ color: "black" }}
      >
        <div
          className={`MUI-table-cell-status-circle status-${displayStatus}`}
        ></div>
        {displayStatus}
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
  );
}

StatusMenu.propTypes = {
  status: PropTypes.string,
  docID: PropTypes.string,
};
