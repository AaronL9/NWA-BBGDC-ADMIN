import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import { AuthContext } from "../../context/AuthContext";

export default function StatusMenu({ status, uid }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [displayStatus, setDisplayStatus] = React.useState(status);
  const authCtx = React.useContext(AuthContext);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const changeStatus = async (disabled) => {
    setAnchorEl(null);
    const value = disabled ? "Disabled" : "Active";
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/change-user-status`,
        {
          method: "POST",
          body: JSON.stringify({ uid, disabled }),
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

      alert(json.message);
      setDisplayStatus(value);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          color: "black",
          textTransform: "capitalize",
          border: "1px solid black",
        }}
      >
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
        <MenuItem onClick={() => changeStatus(false)}>Active</MenuItem>
        <MenuItem onClick={() => changeStatus(true)}>Disabled</MenuItem>
      </Menu>
    </>
  );
}

StatusMenu.propTypes = {
  status: PropTypes.string,
  uid: PropTypes.string,
};
