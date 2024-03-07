import "./edit.css";
import { useEffect, useState } from "react";

// MUI
import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

// firebase
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../config/firebase";

// rich editor
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "../../../util/QuillTools";

// file upload
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/global/spinner/Spinner";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import ConfirmDeleteNews from "../../../components/articles/ConfirmDeleteReport";
import CustomizedSnackbars from "../../../components/global/snackbar/CustomizedSnackbars";
registerPlugin(FilePondPluginFileValidateType);

export default function EditArticle() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [media, setMedia] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const storageRef = ref(storage, `news/${id}/news_image`);

      if (media.length) await uploadBytes(storageRef, media[0].file);

      const url = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "news", id), {
        title,
        body,
        updatedAt: new Date().getTime(),
        imageUrl: [url],
      });
      setShowSnackbar(true);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "news", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const obj = docSnap.data();
        setTitle(obj.title);
        setBody(obj.body);
      } else {
        console.log("No such document!");
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <CustomizedSnackbars
        message="Success! The news has been updated."
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
      <div className="publish">
        <form className="publish__form">
          <div className="publish__title">
            <label htmlFor="title">Article</label>
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
          <Stack direction="row" spacing={2}>
            <ConfirmDeleteNews docID={id} setLoading={setLoading} />
            <Button
              variant="contained"
              endIcon={<CheckIcon />}
              color="success"
              onClick={handleSubmit}
            >
              Update
            </Button>
          </Stack>
        </form>
        <br />
      </div>
    </>
  );
}
