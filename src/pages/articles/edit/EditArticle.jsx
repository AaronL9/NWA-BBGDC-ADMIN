import "./edit.css";
import { useEffect, useState } from "react";

// firebase
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";

// rich editor
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "../../../util/QuillTools";

// file upload
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { useParams } from "react-router-dom";
registerPlugin(FilePondPluginFileValidateType);

export default function EditArticle() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [media, setMedia] = useState([]);
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "articles", id), { title, body });
      console.log('updated')
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "articles", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const obj = docSnap.data();
        setTitle(obj.title);
        setBody(obj.body);
        console.log("Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <div className="publish">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="publish__form"
        >
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
              allowMultiple={true}
              acceptedFileTypes={["video/*", "image/*"]}
              allowFileTypeValidation={true}
              name="file"
              labelIdle='Upload image/videos or <span className="filepond--label-action">Browse</span>'
              required
            />
          </div>
          <button className="publish__btn">Update</button>
        </form>
        <br />
      </div>
    </>
  );
}
