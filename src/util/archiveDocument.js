import { db } from "../config/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";

// Original and archive collection paths
const originalCollectionPath = "reports";
const archiveCollectionPath = "archives";

export async function archiveDocument(docId) {
  const originalDocRef = doc(db, originalCollectionPath, docId);
  const originalDocSnapshot = await getDoc(originalDocRef);

  if (originalDocSnapshot.exists()) {
    const originalDocData = originalDocSnapshot.data();
    originalDocData.status = "resolved";

    const archiveCollectionRef = collection(db, archiveCollectionPath);
    const archiveDocRef = doc(archiveCollectionRef, docId);

    await setDoc(archiveDocRef, originalDocData);
    await deleteDoc(originalDocRef);

    alert("Document archived successfully.");
  } else {
    alert("Document does not exist in the original collection.");
  }
}

export async function getArchives(setArchives, searchValue) {
  const archivesCollectionRef = collection(db, "archives");
  const q = query(
    archivesCollectionRef,
    where("offense", ">=", searchValue),
    where("offense", "<=", searchValue + "\uf8ff")
  );

  const querySnapshot = await getDocs(q);
  const data = [];

  querySnapshot.forEach((doc) => {
    const obj = doc.data();
    obj.id = doc.id;
    data.push(obj);
  });
  setArchives(data);
}

export async function getRecord(id) {
  const docRef = doc(db, "archives", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
}
