import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AuthContext } from "../../context/AuthContext";
import PropTypes from "prop-types";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function ChangedStatusBtn({ uid, disabled }) {
  const [displayStatus, setDisplayStatus] = React.useState(
    disabled ? "Disabled" : "Active"
  );
  const [loading, setLoading] = React.useState(false);
  const authCtx = React.useContext(AuthContext);

  const buttonType = disabled ? "error" : "success";
  const [color, setColor] = React.useState(buttonType);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOnChangeStatus = async (isDisabled) => {
    setAnchorEl(null);
    const color = isDisabled ? "error" : "success";
    const newStatus = isDisabled ? "disabled" : "active";
    setColor(color);

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/admin/change-user-status`,
        {
          method: "POST",
          body: JSON.stringify({ uid, disabled: isDisabled }),
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
      setDisplayStatus(newStatus);
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoadingButton
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="outlined"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        loading={loading}
        color={color}
        sx={{ textTransform: "capitalize" }}
      >
        {displayStatus}
      </LoadingButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={handleOnChangeStatus.bind(this, false)}
          disableRipple
          sx={{ color: "green", fontWeight: "bold" }}
        >
          Active
        </MenuItem>
        <MenuItem
          onClick={handleOnChangeStatus.bind(this, true)}
          disableRipple
          sx={{ color: "red", fontWeight: "bold" }}
        >
          Disabled
        </MenuItem>
      </StyledMenu>
    </div>
  );
}

ChangedStatusBtn.propTypes = {
  disabled: PropTypes.bool,
  uid: PropTypes.string,
};
