import { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  endBefore,
  limitToLast,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import "./reports.css";

// component
import ReportCard from "../../components/reports/ReportCard";
import Loader from "../../components/global/loader/Loader.jsx";
import Nothing from "./Nothing.jsx";

const collectionRef = collection(db, "reports");

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstVisibleDocument, setFirstVisibleDocument] = useState(null);
  const [lastVisibleDocument, setLastVisibleDocument] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const pageSize = 13;

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(
        query(
          collectionRef,
          orderBy("status", "desc"),
          orderBy("date", "desc"),
          where("status", "in", ["report", "pending"]),
          limit(pageSize)
        )
      );

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (querySnapshot.docs.length === 13) {
        data.pop();
        const firstVisible = querySnapshot.docs[0];
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setFirstVisibleDocument(firstVisible);
        setLastVisibleDocument(lastVisible);
        setIsLastPage(false);
      } else {
        setIsLastPage(true);
      }
      setReports(data);
    };

    fetchReport();
    setLoading(false);
  }, []);

  const loadNextPage = async () => {
    try {
      if (lastVisibleDocument) {
        const nextPageQuery = query(
          collectionRef,
          orderBy("status", "desc"),
          orderBy("date", "desc"),
          startAfter(lastVisibleDocument),
          where("status", "in", ["report", "pending"]),
          limit(pageSize)
        );

        const nextPageSnapshot = await getDocs(nextPageQuery);

        const nextPageDocuments = nextPageSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReports(nextPageDocuments);
        setPageNum((prevNum) => prevNum + 1);

        const firstVisible = nextPageSnapshot.docs[0];
        setFirstVisibleDocument(firstVisible);

        if (nextPageSnapshot.docs.length === 13) {
          nextPageDocuments.pop();
          const lastVisible =
            nextPageSnapshot.docs[nextPageSnapshot.docs.length - 1];
          setLastVisibleDocument(lastVisible);
          setIsLastPage(false);
        } else {
          setIsLastPage(true);
        }
      }
    } catch (error) {
      console.error("Error loading next page:", error);
    }
  };

  const loadPreviousPage = async () => {
    try {
      if (firstVisibleDocument) {
        const previousPageQuery = query(
          collectionRef,
          orderBy("status", "desc"),
          orderBy("date", "desc"),
          endBefore(firstVisibleDocument),
          where("status", "in", ["report", "pending"]),
          limitToLast(pageSize)
        );

        const previousPageSnapshot = await getDocs(previousPageQuery);

        const previousPageDocuments = previousPageSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPageNum((prevNum) => prevNum - 1);

        if (previousPageSnapshot.docs.length === 13) {
          previousPageDocuments.pop();
          const firstVisible = previousPageSnapshot.docs[0];
          const lastVisible =
            previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
          setFirstVisibleDocument(firstVisible);
          setLastVisibleDocument(lastVisible);
          setIsLastPage(false);
        } else {
          setIsLastPage(true);
        }
        setReports(previousPageDocuments);
      }
    } catch (error) {
      console.error("Error loading previous page:", error);
    }
  };

  return (
    <div className="reports">
      {loading ? (
        <div className="global-loader">
          <Loader />
        </div>
      ) : !reports.length ? (
        <Nothing label="reports" />
      ) : (
        <div className="reports__cards-container">
          <div className="reports__cards-container--overlay"></div>
          {reports.map((report, index) => (
            <ReportCard key={index} data={report} />
          ))}
        </div>
      )}
      <div className="reports__pagination">
        <button disabled={pageNum === 1} onClick={loadPreviousPage}>
          prev
        </button>
        <p className="reports__page-number">{pageNum}</p>
        <button disabled={isLastPage} onClick={loadNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}
