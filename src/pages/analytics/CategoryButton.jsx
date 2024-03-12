import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";

const bonuanArea = [
  "all",
  "alimango",
  "alimasag",
  "apahap",
  "ayungin",
  "bangus avenue",
  "baracuda",
  "bisugo",
  "bonito",
  "calamiong",
  "dalagang bukid",
  "dasmarinas",
  "don marcelo i. balolong sr. avenue",
  "don maximo",
  "eastern county",
  "las vegas",
  "maramba banker's village",
  "paras",
  "perrenians",
  "sabangan",
  "san marino place",
  "sugpo",
  "tanguegue",
  "tondaligan",
  "tuna",
];

export default function CategoryButton({ setCategory }) {
  const [area, setArea] = React.useState(bonuanArea[0]);

  const handleChange = (event) => {
    const value = event.target.value;
    setArea(value);
    setCategory(value.split(" ").join("_").toLowerCase());
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">Area</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={area}
        label="Area"
        onChange={handleChange}
        sx={{ textTransform: "capitalize" }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200, // Adjust the height as needed
            },
          },
        }}
      >
        {bonuanArea.map((area) => (
          <MenuItem
            key={area}
            value={area}
            sx={{ textTransform: "capitalize" }}
          >
            {area}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

CategoryButton.propTypes = {
  setCategory: PropTypes.func,
};
