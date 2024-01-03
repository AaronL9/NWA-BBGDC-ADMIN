import Dropdown from "../global/dropdown/Dropdown";
import SearchBar from "../global/searchbar/SearchBar";
import PropTypes from "prop-types"

import "./table_features.css";

export default function TableFeatures({
  setSearch,
  selectedValue,
  setSelectedValue,
  options
}) {
  return (
    <div className="table-features">
      <div className="search">
        <SearchBar placeholder={"search..."} setSearch={setSearch} />
      </div>
      <div className="table-dropdown">
        <div className="sort">
          <span className="sort__text">Sort by: </span>
          <div className="dropdown-sort">
            <div>
              <Dropdown
                options={options.sort}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

TableFeatures.propTypes = {
  setSearch: PropTypes.func,
  selectedValue: PropTypes.string,
  setSelectedValue: PropTypes.func,
  options: PropTypes.object
};