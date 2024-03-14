import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function CategoryButton({ setCategory }) {
  const [area, setArea] = React.useState("");
  const [bonuanArea, setBonuanArea] = React.useState([]);

  const handleChange = (event) => {
    const value = event.target.value;
    setArea(value);
    setCategory(value.split(" ").join("_").toLowerCase());
  };

  React.useEffect(() => {
    const getData = async () => {
      const area = await getDoc(doc(db, "static_data", "area"));
      const data = area.data().options;
      setBonuanArea(data);
      setArea(data[0]);
    };
    getData();
  }, []);

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
