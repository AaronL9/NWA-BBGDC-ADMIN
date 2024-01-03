import "./publish_article.css";
import { useState } from "react";

// firebase
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
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
registerPlugin(FilePondPluginFileValidateType);

export default function PublishArticle() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [media, setMedia] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "articles"), {
        title,
        body,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      const uploadPromises = media.map(async (obj) => {
        const storageRef = ref(storage, `articles/${docRef.id}/${obj.file.name}`);
        return uploadBytes(storageRef, obj.file);
      });

      const snapshots = await Promise.all(uploadPromises);
      const imageUrl = []
      for (const snapshot of snapshots) {
        const downloadURL = await getDownloadURL(
          ref(storage, snapshot.ref.fullPath)
        );
        imageUrl.push(downloadURL.toString());
      }

      console.log(imageUrl)

      await updateDoc(doc(db, "articles", docRef.id), {
        imageUrl
      });

      setTitle("");
      setBody("");
      setMedia([]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

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
          <button className="publish__btn">Publish</button>
        </form>
      </div>
    </>
  );
}
