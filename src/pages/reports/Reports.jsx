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
import ReportTable from "./ReportTable.jsx";

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
          where("status", "in", ["report", "ongoing"]),
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
    <>
      <h2 className="banner__title">Reports</h2>
      <div className="reports">
        <div className="reports__cards-container">
          <div className="reports__cards-container--overlay"></div>
          <ReportTable />
        </div>
      </div>
    </>
  );
}
