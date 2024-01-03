import "./searchbar.css";
import PropTypes from "prop-types";

export default function SearchBar({ setSearch }) {
  return (
    <div className="search-bar">
      <form>
        <input
          type="search"
          name="search"
          placeholder="Search"
          autoComplete="on"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-btn" type="submit">
          <img src="/svg//global/search-icon.svg" />
        </button>
      </form>
    </div>
  );
}

SearchBar.propTypes = {
  setSearch: PropTypes.func,
};
