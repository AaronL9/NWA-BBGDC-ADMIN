import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export default async function (status, id) {
  const reportRef = doc(db, "reports", id);

  await updateDoc(reportRef, { status });
}
