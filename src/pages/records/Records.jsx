import "./crime_records.css";
import { useState, useEffect } from "react";
import { crimeSort } from "../../util/sorting_data";
import { getArchives } from "../../util/archiveDocument";

// components
import CrimeRecordsTable from "../../components/records/CrimeRecordsTable";
import TableFeatures from "../../components/records/TableFeatures";

export default function Records() {
  const [archives, setArchives] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("Newest to Oldest");

  useEffect(() => {
    const fetchArchives = async () => {
      await getArchives(setArchives, searchValue);
    };
    fetchArchives();
  }, [searchValue]);
  return (
    <div className="crime-records">
      <TableFeatures
        setSearch={setSearchValue}
        selectedValue={sortBy}
        setSelectedValue={setSortBy}
        options={crimeSort}
      />
      <CrimeRecordsTable archives={archives} />
    </div>
  );
}
