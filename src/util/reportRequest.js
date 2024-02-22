import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getNumberOfReports = async (path) => {
  const collectionRef = collection(db, path);

  if (path === "reports") {
    const filterReport = query(collectionRef, where("status", "==", "report"));
    const filterPending = query(
      collectionRef,
      where("status", "==", "ongoing")
    );

    const { size: totalReports } = await getDocs(collectionRef);
    const { size: totalNewReports } = await getDocs(filterReport);
    const { size: totalOnprogressReports } = await getDocs(filterPending);
    return { totalReports, totalNewReports, totalOnprogressReports };
  }

  const { size: totalReports } = await getDocs(collectionRef);
  return { totalReports };
};
