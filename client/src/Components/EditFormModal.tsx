import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import axios from "axios";
import firebase from "firebase/app";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(0),
      width: "25ch",
      display: "flex",
      flexDirection: "column",
    },
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const EditFormModal = (props) => {
  const classes = useStyles();
  const [currentUser] = React.useState(props.currentUser);
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [newName, setNewName] = React.useState(props.currentUser.displayName);
  const [newEmail, setNewEmail] = React.useState(props.currentUser.email);
  const [newPhotoURL, setNewPhotoURL] = React.useState(
    props.currentUser.photoURL
  );
  const [updateError, setUpdateError] = React.useState(undefined);

  const getToken = async () => {
    try {
      console.log(currentUser);
      const user = currentUser;
      return await user.getIdToken();
    } catch (e) {
      return null;
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangedName = (event) => {
    setNewName(event.target.value);
  };

  const handleChangedEmail = (event) => {
    setNewEmail(event.target.value);
  };

  const handleChangedPhotoURL = (event) => {
    setNewPhotoURL(event.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      const token = await getToken();
      let url = `http://localhost:4200/api/users/${currentUser.uid}`;
      let data = {
        name: newName,
        email: newEmail,
      };
      await axios.put(url, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      const user = firebase.auth().currentUser;
      await user.updateEmail(newEmail);
      await user.updateProfile({
        displayName: newName,
        photoURL: newPhotoURL,
      });

      handleClose();
    } catch (error) {
      setUpdateError(error.messages);
      console.log(error.messages);
    }
  };

  let errorDiv;
  if (updateError) {
    errorDiv = <div>{updateError.messages}</div>;
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={handleSubmit} className={classes.root}>
        <h2 id="simple-modal-title">Edit Profile</h2>
        <TextField
          label="Name"
          variant="outlined"
          value={newName}
          onChange={handleChangedName}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Email"
          variant="outlined"
          value={newEmail}
          onChange={handleChangedEmail}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Photo URL"
          variant="outlined"
          value={newPhotoURL}
          onChange={handleChangedPhotoURL}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
      {errorDiv}
    </div>
  );

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Edit Profile
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
};

export default EditFormModal;
