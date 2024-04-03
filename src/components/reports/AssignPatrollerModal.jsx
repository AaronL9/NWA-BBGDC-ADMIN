import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Select from "react-select";
import MapView from "./MapView";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../../config/firebase";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";

export default function AssignPatrollerModal({ fetchReport }) {
  const authCtx = React.useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const { id } = useParams();

  const [patrollerOption, setPatrollerOption] = React.useState([]);
  const [selectedPatroller, setSelectedPatroller] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  const [details, setDetails] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
      setSelectedPatroller([]);
    }
  };

  async function getAllPatrollers() {
    const querySnapshot = await getDocs(collection(db, "patrollers"));

    setPatrollerOption(
      querySnapshot.docs.map((doc) => ({
        label: `${doc.data().firstName} ${doc.data().lastName}`,
        value: doc.id,
      }))
    );
  }

  React.useEffect(() => {
    getAllPatrollers();
  }, []);

  async function handleSave() {
    const data = selectedPatroller.map((data) => data.value);
    const patroller = selectedPatroller.map((data) => data.label);
    try {
      setLoading(true);
      const assignRef = doc(db, "live_location", id);
      await setDoc(assignRef, {
        coords: details.geoPoint,
        location: details.location,
        offense: details.offense,
        assignPatrollers: data,
      });

      const assignPatroller = doc(db, "reports", id);
      await updateDoc(assignPatroller, {
        assignPatroller: patroller,
        responderId: data,
      });

      fetch(`http://localhost:3000/api/push/alert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.admin.accessToken,
        },
        body: JSON.stringify({ reportType: details.offense }),
      });

      alert("This report location is live to patrollers");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      setOpen(false);
      setSelectedPatroller([]);
      fetchReport();
    }
  }

  React.useEffect(() => {
    const fetchReport = async () => {
      try {
        const docRef = doc(db, "reports", id);
        const docSnap = await getDoc(docRef);
        setDetails({ ...docSnap.data(), docID: id });
      } catch (error) {
        console.log(error);
      }
    };
    fetchReport();
  }, [id]);

  return (
    <div>
      <Button onClick={handleClickOpen} variant="contained">
        Assign
      </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Assign Patroller</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1, minWidth: 420, minHeight: 500 }}>
              <Select
                isMulti
                name="colors"
                options={patrollerOption}
                value={selectedPatroller}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(value) => setSelectedPatroller(value)}
              />
            </FormControl>
          </Box>
          <Box sx={{ width: 200 }}>
            <MapView coords={{ lat: 16, lng: 182 }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
