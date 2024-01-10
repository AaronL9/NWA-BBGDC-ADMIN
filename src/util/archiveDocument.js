import { db } from "../config/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  limit,
  orderBy,
  startAt,
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

export async function getArchives(page, pageSize) {
  const archivesCollectionRef = collection(db, "archives");
  const q = query(
    archivesCollectionRef,
    orderBy("orderNum", "asc"),
    startAt((page - 1) * pageSize),
    limit(pageSize)
  );

  const querySnapshot = await getDocs(q);
  const { size } = await getDocs(archivesCollectionRef);
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  console.log(Math.ceil(size / 10));

  return { data, pageNum: Math.ceil(size / 10) };
}

export async function getRecord(id) {
  const docRef = doc(db, "archives", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
}
