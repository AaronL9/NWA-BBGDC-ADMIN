import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { TableSortLabel, Toolbar, Typography } from "@mui/material";
import { formatDateReport } from "../../util/dateFormatter";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import PropTypes from "prop-types";
import algoliasearch from "algoliasearch";
import Spinner from "../../components/global/spinner/Spinner.jsx";
import FilterMenu from "../../components/reports/FilterMenu.jsx";
import { statusOptions, yearOptions } from "../../util/tableFilterLogic.js";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_KEY
);
const mainIndex = searchClient.initIndex(
  import.meta.env.VITE_ALGOLIA_INDEX_NAME
);
const replicaIndex = searchClient.initIndex(
  import.meta.env.VITE_ALGOLIA_INDEX_REPLICA_NAME
);
const defaultFilter = "status:report OR status:ongoing OR status:resolved";

const columns = [
  {
    id: "reportee",
    label: "Reportee",
    minWidth: 170,
    styleClass: "MUI-table-cell-capitalize",
  },
  {
    id: "offense",
    label: "Offense",
    minWidth: 100,
    styleClass: "MUI-table-cell-capitalize",
  },
  // {
  //   id: "orderNum",
  //   label: "order",
  //   minWidth: 170,
  //   align: "left",
  // },
  {
    id: "location",
    label: "Location",
    minWidth: 170,
    align: "left",
  },
  {
    id: "date",
    label: "Date",
    minWidth: 100,
    align: "left",
    format: (value) => formatDateReport(value),
  },
  {
    id: "status",
    label: "Status",
    minWidth: 170,
    align: "center",
    styleClass: "MUI-table-cell-status",
  },
];

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f5f5f5",
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(() => ({
  marginLeft: "0.5rem",
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "auto",
  zIndex: 100,
  cursor: "pointer",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

EnhancedTableToolbar.propTypes = {
  anchorEl: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  setSearchValue: PropTypes.func,
  searchValue: PropTypes.string,
  status: PropTypes.string,
  year: PropTypes.string,
  setQuery: PropTypes.func,
  setStatus: PropTypes.func,
  setYear: PropTypes.func,
  setRefresh: PropTypes.func,
};

function EnhancedTableToolbar({
  setSearchValue,
  searchValue,
  setQuery,
  setStatus,
  setYear,
  year,
  status,
  setRefresh,
}) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        backgroundColor: "white",
        justifyContent: "space-between",
      }}
    >
      <Search>
        <SearchIconWrapper onClick={() => setQuery(searchValue)}>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setQuery(searchValue);
            }
          }}
        />
      </Search>
      <IconButton
        sx={{ marginRight: "auto" }}
        onClick={() => setRefresh((prev) => !prev)}
      >
        <RefreshIcon />
      </IconButton>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingBlock: "8px",
        }}
      >
        <Typography variant="subtitle1">
          <span style={{ fontWeight: "bold" }}>Filter By:</span>
        </Typography>
        <FilterMenu
          values={yearOptions}
          setFilterValue={setYear}
          filterValue={year}
          label="Year"
        />
        <FilterMenu
          values={statusOptions}
          setFilterValue={setStatus}
          filterValue={status}
          label="Status"
        />
      </div>
    </Toolbar>
  );
}

export default function ReportTable() {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [totalRows, setTotalRows] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [sortBy, setSortBy] = React.useState("date");
  const [order, setOrder] = React.useState("desc");

  const [status, setStatus] = React.useState(defaultFilter);
  const [year, setYear] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [refresh, setRefresh] = React.useState(true);

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (property) => {
    setLoading(true);
    const isAsc = sortBy === property && order === "asc";
    const orderValue = isAsc ? "desc" : "asc";
    setOrder(orderValue);
    setSortBy(property);
  };

  const performSearch = React.useCallback(async () => {
    try {
      setLoading(true);
      const index = order === "desc" ? mainIndex : replicaIndex;

      const { hits, nbHits } = await index.search(query, {
        hitsPerPage: rowsPerPage,
        page: page,
        filters: status,
        numericFilters: year,
        cacheable: false,
      });

      setRows(hits);
      setTotalRows(nbHits);
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setLoading(false);
    }
  }, [query, rowsPerPage, page, order, status, year]);

  React.useEffect(() => {
    performSearch();
  }, [performSearch, refresh]);

  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <Spinner />
        </div>
      )}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <EnhancedTableToolbar
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          setQuery={setQuery}
          setStatus={setStatus}
          setYear={setYear}
          setRefresh={setRefresh}
        />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                  >
                    {column.id !== "date" ? (
                      column.label
                    ) : (
                      <TableSortLabel
                        active={sortBy === column.id}
                        direction={sortBy === column.id ? order : "asc"}
                        onClick={() => handleRequestSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
                <TableCell style={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.objectID}
                  >
                    {columns.map((column, index) => {
                      const value = row[column.id];
                      const customStyle = column.styleClass ?? null;
                      return (
                        <TableCell
                          key={index}
                          align={column.align}
                          className={customStyle}
                        >
                          {column.id === "status" && (
                            <div
                              className={`MUI-table-cell-status-circle status-${value}`}
                            ></div>
                          )}
                          {value}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <button
                        className="MUI-table-cell-button"
                        onClick={() => navigate(row.objectID)}
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 15, 20]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
