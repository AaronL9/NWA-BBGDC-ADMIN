import { db } from "../config/firebase";
import {
  collection,
  doc,
  updateDoc,
  getDocs,
  where,
  query,
  orderBy,
} from "firebase/firestore";

// Original and archive collection paths
const CollectionPath = "reports";

export async function moveToInterventions(docId) {
  const docRef = doc(db, CollectionPath, docId);
  try {
    await updateDoc(docRef, { status: "resolving" });
  } catch (error) {
    console.log(error);
  }
}

export async function getInterventions(setData) {
  const collectionRef = collection(db, "reports");
  const q = query(
    collectionRef,
    where("status", "==", "resolving"),
    orderBy("date", "desc")
  );

  const querySnapshot = await getDocs(q);
  const data = [];

  querySnapshot.forEach((doc) => {
    const obj = doc.data();
    obj.id = doc.id;
    data.push(obj);
  });
  setData(data);
}
