import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";
import { useState } from "react";
import { getFilterValueByLabel } from "../../util/tableFilterLogic";

export default function FilterMenu({ values, setFilterValue, label }) {
  const [displayValue, setDisplayValue] = useState("");

  const handleChange = (event) => {
    const value = getFilterValueByLabel(label, event.target.value);
    setFilterValue(value);
    setDisplayValue(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 125 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={displayValue}
          label={label}
          onChange={handleChange}
          sx={{ textTransform: "capitalize" }}
        >
          {values.map((value, index) => (
            <MenuItem
              key={index}
              value={value}
              sx={{ textTransform: "capitalize" }}
            >
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

FilterMenu.propTypes = {
  values: PropTypes.array,
  filterValue: PropTypes.string,
  label: PropTypes.string,
  setFilterValue: PropTypes.func,
};
