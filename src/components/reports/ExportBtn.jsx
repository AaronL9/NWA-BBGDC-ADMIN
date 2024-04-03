import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Stack } from "@mui/material";

export default function ExportBtn({ exportHandler }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack direction="row" justifyContent="flex-end">
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="contained"
        color="success"
        sx={{ marginBlock: "1rem" }}
      >
        Export to csv
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            exportHandler(50);
          }}
        >
          50 Records
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            exportHandler(100);
          }}
        >
          100 Records
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            exportHandler(500);
          }}
        >
          500 Records
        </MenuItem>
      </Menu>
    </Stack>
  );
}
