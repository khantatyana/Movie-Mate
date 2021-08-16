import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";

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
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [newName, setNewName] = React.useState(props.name);
  const [newEmail, setNewEmail] = React.useState(props.email);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // do update stuff
  };

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
        <Button variant="contained" color="primary" onClick={handleClose}>
          Submit
        </Button>
      </form>
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
