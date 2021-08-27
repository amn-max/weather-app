import React, { useState, useEffect } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import db, { auth } from "../firebase";
import "./AuthStyles.css";
import { useAlert } from "react-alert";
import { useHistory } from "react-router";
import { useStateValue } from "../StateProvider";
import { Link } from "react-router-dom";
const mailFormat =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passw = /^[A-Za-z]\w{7,14}$/;
const Auth = () => {
  const [{}, dispatch] = useStateValue();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const alert = useAlert();
  const history = useHistory();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = loggedInUser;
      dispatch({
        type: "SET_USER",
        user: foundUser,
      });
      history.push("/main");
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (email.match(mailFormat) && password.match(passw)) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCred) => {
          dispatch({
            type: "SET_USER",
            user: userCred,
          });

          db.collection("users")
            .doc(userCred.user.uid)
            .set({
              name: name,
              email: userCred.user.email,
            })
            .then(async (docRef) => {
              console.log("Document written");
              history.push("/");
              await localStorage.setItem("user", userCred.user);
            })
            .catch((error) => {
              console.error("Error adding document:", error);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert.error(errorMessage);
        });
    } else {
      alert.info("Email/Password does not match format");
    }
  };

  return (
    <div className="auth">
      <div className="auth__con container">
        <h2>Authentication</h2>
        <form className="auth__form">
          <InputGroup style={{ margin: 10 }}>
            <InputGroup.Text>Name</InputGroup.Text>
            <FormControl
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </InputGroup>
          <InputGroup style={{ margin: 10 }}>
            <InputGroup.Text>email</InputGroup.Text>
            <FormControl
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </InputGroup>
          <InputGroup style={{ margin: 10 }}>
            <InputGroup.Text>password</InputGroup.Text>
            <FormControl
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </InputGroup>

          <Button type="submit" onClick={handleAuth}>
            Register
          </Button>
          <Link to="/login">
            <Button variant="info">Already Have a Account? Login Here.</Button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Auth;
