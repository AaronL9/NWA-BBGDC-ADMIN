import { storage } from "../../config/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";

export const getReportMedia = async (folderPath) => {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);

    const downloadURLs = [];

    for (const itemRef of result.items) {
      const url = await getDownloadURL(itemRef);
      downloadURLs.push(url);
    }

    return downloadURLs;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
