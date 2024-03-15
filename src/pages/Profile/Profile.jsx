import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import "./Profile.css";
import { useContext, useState } from "react";
import { styled } from "@mui/material/styles";
import { AuthContext } from "../../context/AuthContext";
import ChangeEmailDialog from "./components/ChangeEmailDialog";
import {
  doc,
  updateDoc,
  getDocs,
  collection,
  where,
  query,
} from "firebase/firestore";
import { auth, db, storage } from "../../config/firebase";
import Spinner from "../../components/global/spinner/Spinner";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import CustomizedSnackbars from "../../components/global/snackbar/CustomizedSnackbars";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function Profile() {
  const { admin, adminData, setAdminData } = useContext(AuthContext);
  const [edit, setEdit] = useState(false);
  const [newData, setNewData] = useState(adminData);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackBar] = useState(false);
  const [photoURL, setPhotoURL] = useState(admin.photoURL);

  const onCancelHandler = () => {
    setEdit(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setLoading(true);
        const storageRef = ref(storage, `${admin.uid}/profile_pic`);
        await uploadBytes(storageRef, file);

        const imageUrl = await getDownloadURL(storageRef);
        await updateProfile(auth.currentUser, { photoURL: imageUrl });

        const q = query(
          collection(db, "rooms"),
          where("admin.id", "==", admin.uid)
        );
        const rooms = await getDocs(q);
        rooms.forEach(async (document) => {
          const roomsRef = doc(db, "rooms", document.id);
          await updateDoc(roomsRef, { adminAvatarURL: imageUrl });
        });

        setPhotoURL(imageUrl);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const onSaveHandler = async () => {
    setEdit(false);
    try {
      setLoading(true);
      const adminRef = doc(db, "admins", admin.uid);

      setAdminData(newData);
      await updateDoc(adminRef, newData);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    setNewData((prev) => ({ ...prev, [key]: value }));
  };

  const verifyEmailHandler = () => {
    setLoading(true);
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setShowSnackBar(true);
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="profile-dashboard">
      {loading && (
        <div className="loader-overlay">
          <Spinner />
        </div>
      )}
      <CustomizedSnackbars
        severity="success"
        message="Email verification sent successfully"
        show={showSnackbar}
        setShow={setShowSnackBar}
        position={{ vertical: "top", horizontal: "center" }}
      />
      <div className="profile-dashboard__profile-pic">
        <Avatar
          alt="Remy Sharp"
          src={photoURL ?? "/images/profile-circle.png"}
          sx={{ width: "120px", height: "120px", marginBottom: "1.5rem" }}
        />
        <Button
          component="label"
          tabIndex={-1}
          variant="outlined"
          role={undefined}
          sx={{ textTransform: "capitalize" }}
        >
          change profile picture
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
      </div>
      <div className="profile-dashboard__fields">
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {edit ? (
            <>
              <IconButton
                onClick={onSaveHandler}
                aria-label="save"
                color="primary"
              >
                <DoneIcon />
              </IconButton>
              <IconButton
                onClick={onCancelHandler}
                color="error"
                aria-label="cancel"
              >
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={() => setEdit(true)} aria-label="delete">
              <EditIcon />
            </IconButton>
          )}
        </Stack>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
            justifyContent: "center",
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="First Name"
            id="outlined-size-small-firstname"
            value={newData.firstName}
            size="small"
            disabled={!edit}
            onChange={onChangeHandler}
            name="firstName"
          />
          <TextField
            label="Last Name"
            id="outlined-size-small-lastname"
            value={newData.lastName}
            size="small"
            disabled={!edit}
            onChange={onChangeHandler}
            name="lastName"
          />
        </Box>
        <br />
        <TextField
          label="Email"
          id="outlined-size-small-email"
          defaultValue={admin.email}
          size="small"
          disabled
        />
        {admin.emailVerified ? (
          <ChangeEmailDialog />
        ) : (
          <Button
            onClick={verifyEmailHandler}
            variant="outlined"
            sx={{ textTransform: "capitalize" }}
          >
            Verify email
          </Button>
        )}
      </div>
    </div>
  );
}
