import * as React from "react";
import * as Firestore from "firebase/firestore";
import { db } from "../../config/firebase";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  IconButton,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { formatDateReport } from "../../util/dateFormatter";
import { useNavigate } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import PropTypes from "prop-types";
import { SmallLoader } from "../../components/global/loader/Loader.jsx";

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

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

function EnhancedTableToolbar({
  onFilterClick,
  statusFilter,
  anchorEl,
  handleFilterClose,
  handleFilterSelect,
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
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
        />
      </Search>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="subtitle1" sx={{ marginRight: 2 }}>
          <span style={{ fontWeight: "bold" }}>Filter Status:</span>{" "}
          {statusFilter.length === 3 ? "none" : statusFilter[0]}
        </Typography>

        <Tooltip title="Status">
          <IconButton onClick={onFilterClick}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleFilterClose}
        >
          <MenuItem
            onClick={() => handleFilterSelect(status)}
            selected={statusFilter === "none"}
          >
            None
          </MenuItem>
          <MenuItem
            onClick={() => handleFilterSelect(["report"])}
            selected={statusFilter === "report"}
          >
            Report
          </MenuItem>
          <MenuItem
            onClick={() => handleFilterSelect(["ongoing"])}
            selected={statusFilter === "ongoing"}
          >
            Ongoing
          </MenuItem>
          <MenuItem
            onClick={() => handleFilterSelect(["resolved"])}
            selected={statusFilter === "resolved"}
          >
            Resolved
          </MenuItem>
        </Menu>
      </div>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  onFilterClick: PropTypes.func.isRequired,
  statusFilter: PropTypes.array,
  anchorEl: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  handleFilterClose: PropTypes.func.isRequired,
  handleFilterSelect: PropTypes.func.isRequired,
};

const columns = [
  { id: "reporteeName", label: "Reportee", minWidth: 170 },
  { id: "offense", label: "Offense", minWidth: 100 },
  {
    id: "orderNum",
    label: "order",
    minWidth: 170,
    align: "left",
  },
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

const status = ["report", "ongoing", "resolved"];
const collectionRef = Firestore.collection(db, "reports");

export default function ReportTable() {
  const navigate = useNavigate();

  const [totalRows, setTotalRows] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(2);
  const [orderBy, setOrderBy] = React.useState("date");
  const [order, setOrder] = React.useState("desc");
  const [statusFilter, setStatusFilter] = React.useState(status);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loading, setLoading] = React.useState(null);

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (status) => {
    setStatusFilter(status);
    setAnchorEl(null);
  };

  React.useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const { size } = await Firestore.getDocs(collectionRef);
        let cursor =
          order === "desc" ? size - 1 - rowsPerPage * page : page * rowsPerPage;

        let query = Firestore.query(
          collectionRef,
          Firestore.orderBy("orderNum", order),
          Firestore.startAt(cursor),
          Firestore.where("status", "in", statusFilter),
          Firestore.limit(rowsPerPage)
        );

        const { size: totalSize } = await Firestore.getDocs(
          Firestore.query(
            collectionRef,
            Firestore.where("status", "in", statusFilter)
          )
        );
        setTotalRows(totalSize);

        const querySnapshot = await Firestore.getDocs(query);
        const docs = querySnapshot.docs;

        const data = docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRows(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReport();
    setLoading(false);
  }, [orderBy, order, statusFilter, rowsPerPage, page]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <EnhancedTableToolbar
        onFilterClick={handleFilterClick}
        statusFilter={statusFilter}
        anchorEl={anchorEl} // Pass the anchorEl prop
        handleFilterClose={handleFilterClose} // Pass the handleFilterClose prop
        handleFilterSelect={handleFilterSelect} // Pass the handleFilterSelect prop
      />
      {loading ? (
        <SmallLoader></SmallLoader>
      ) : (
        <>
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
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : "asc"}
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        const customStyle = column.styleClass ?? null;
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            className={customStyle}
                          >
                            {column.id === "status" && (
                              <div
                                className={`MUI-table-cell-status-circle status-${value}`}
                              ></div>
                            )}
                            {column.format ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        <button
                          className="MUI-table-cell-button"
                          onClick={() => navigate(row.id)}
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
            rowsPerPageOptions={[2, 4, 6, 7]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
}
