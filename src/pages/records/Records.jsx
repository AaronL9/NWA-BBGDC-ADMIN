import "./crime_records.css";
import { useState, useEffect } from "react";
import { crimeSort } from "../../util/sorting_data";
import { getArchives } from "../../util/archiveDocument";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

// components
import CrimeRecordsTable from "../../components/records/CrimeRecordsTable";
import TableFeatures from "../../components/records/TableFeatures";

export default function Records() {
  const [archives, setArchives] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("Newest to Oldest");
  const [page, setPage] = useState(1);
  const [paginationCount, setPaginationCount] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    const fetchArchives = async () => {
      const { pageNum, data } = await getArchives(page, 10);
      setPaginationCount(pageNum);
      setArchives(data);
      console.log(data);
    };
    fetchArchives();
  }, [page]);

  return (
    <div className="crime-records">
      <TableFeatures
        setSearch={setSearchValue}
        selectedValue={sortBy}
        setSelectedValue={setSortBy}
        options={crimeSort}
      />
      <CrimeRecordsTable archives={archives} />
      <div className="crime-records__pagination">
        <Stack spacing={2}>
          <Pagination
            count={paginationCount}
            page={page}
            onChange={handleChange}
            shape="rounded"
            siblingCount={1}
            boundaryCount={2}
          />
        </Stack>
      </div>
    </div>
  );
}
