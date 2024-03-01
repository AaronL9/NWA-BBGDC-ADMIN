import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Toolbar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import PropTypes from "prop-types";
import algoliasearch from "algoliasearch";
import Spinner from "../../components/global/spinner/Spinner.jsx";
import ChangedStatusBtn from "./ChangedStatusBtn.jsx";

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_KEY
);
const mainIndex = searchClient.initIndex("user");

const columns = [
  {
    id: "name",
    label: "Name",
    minWidth: 170,
    styleClass: "MUI-table-cell-capitalize",
  },
  {
    id: "phoneNumber",
    label: "Phone Number",
    minWidth: 100,
    styleClass: "MUI-table-cell-capitalize",
  },
  {
    id: "age",
    label: "Age",
    minWidth: 100,
    styleClass: "MUI-table-cell-capitalize",
    align: "center",
  },
  {
    id: "address",
    label: "Address",
    minWidth: 170,
    align: "center",
  },
  {
    id: "disabled",
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
};

function EnhancedTableToolbar({ setSearchValue, searchValue, setQuery }) {
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
    </Toolbar>
  );
}

export default function UsersTable() {
  const [loading, setLoading] = React.useState(true);
  const [totalRows, setTotalRows] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [status, setStatus] = React.useState();
  const [searchValue, setSearchValue] = React.useState("");
  const [query, setQuery] = React.useState("");

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    const performSearch = async () => {
      try {
        setLoading(true);

        const { hits, nbHits } = await mainIndex.search(query, {
          hitsPerPage: rowsPerPage,
          page: page,
        });

        console.log(hits);
        setRows(hits);
        setTotalRows(nbHits);
      } catch (error) {
        console.error("Error performing search:", error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, rowsPerPage, page, totalRows, status]);

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
                    {column.label}
                  </TableCell>
                ))}
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
                          {column.id === "disabled" ? (
                            <ChangedStatusBtn
                              uid={row.objectID}
                              disabled={value}
                            />
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
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
