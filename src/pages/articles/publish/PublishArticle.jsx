import "./publish_article.css";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// firebase
import { setDoc, doc } from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../config/firebase";

// rich editor
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "../../../util/QuillTools";

// file upload
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { AuthContext } from "../../../context/AuthContext";
import Spinner from "../../../components/global/spinner/Spinner";
import CustomizedSnackbars from "../../../components/global/snackbar/CustomizedSnackbars";
registerPlugin(FilePondPluginFileValidateType);

export default function PublishArticle() {
  const authCtx = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const docId = uuidv4();
      const unixTimestamp = new Date().getTime();

      const uploadPromises = media.map(async (obj) => {
        const storageRef = ref(storage, `news/${docId}/news_image`);
        return uploadBytes(storageRef, obj.file);
      });

      const snapshots = await Promise.all(uploadPromises);
      const imageUrl = [];
      for (const snapshot of snapshots) {
        const downloadURL = await getDownloadURL(
          ref(storage, snapshot.ref.fullPath)
        );
        imageUrl.push(downloadURL.toString());
      }

      await setDoc(doc(db, "news", docId), {
        title,
        body,
        createdAt: unixTimestamp,
        updatedAt: unixTimestamp,
        imageUrl,
      });

      fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/push/news-notification`, {
        method: "POST",
        body: JSON.stringify({ title }),
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.admin.accessToken,
        },
      });

      setShowSnackbar(true);
      setTitle("");
      setBody("");
      setMedia([]);
    } catch (error) {
      alert(`Error adding document: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomizedSnackbars
        message="Success! The news has been uploaded."
        setShow={setShowSnackbar}
        show={showSnackbar}
        severity="success"
        position={{ vertical: "top", horizontal: "center" }}
      />
      {loading && (
        <div className="loader-overlay">
          <Spinner />
        </div>
      )}
      <h2 className="banner__title">Publish News</h2>
      <div className="publish">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="publish__form"
        >
          <div className="publish__title">
            <label htmlFor="title">News Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="publish__description">
            <label>Body</label>
            <ReactQuill
              theme="snow"
              value={body}
              onChange={setBody}
              formats={formats}
              modules={modules}
            />
            <div className="publish_image-upload"></div>
          </div>
          <div className="publish__media">
            <FilePond
              files={media}
              onupdatefiles={setMedia}
              allowMultiple={false}
              acceptedFileTypes={["image/*"]}
              allowFileTypeValidation={true}
              name="file"
              labelIdle='Upload image or <span className="filepond--label-action">Browse</span>'
              required
            />
          </div>
          <button className="publish__btn">Publish</button>
        </form>
      </div>
    </>
  );
}
