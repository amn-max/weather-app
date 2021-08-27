import React, { useState, useEffect } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { signInWithEmailAndPassword } from "firebase/auth";
import db, { auth } from "../firebase";
import "./AuthStyles.css";
import { useAlert } from "react-alert";
import { useHistory } from "react-router";
import { useStateValue } from "../StateProvider";
import { Link } from "react-router-dom";
const mailFormat =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passw = /^[A-Za-z]\w{7,14}$/;
const Login = () => {
  const [{}, dispatch] = useStateValue();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCred) => {
          dispatch({
            type: "SET_USER",
            user: userCred,
          });
          if (userCred) {
            await localStorage.setItem("user", userCred.user);
            history.push("/main");
          }
        })
        .catch((error) => {
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
        <h2>Login</h2>
        <form className="auth__form">
          <InputGroup style={{ margin: 10 }}>
            <InputGroup.Text>email</InputGroup.Text>
            <FormControl
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </InputGroup>
          <InputGroup style={{ margin: 10 }}>
            <InputGroup.Text>password</InputGroup.Text>
            <FormControl
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </InputGroup>

          <Link to="/login">
            <Button
              variant="info"
              type="submit"
              style={{ width: "100%" }}
              onClick={handleAuth}
            >
              Login
            </Button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
