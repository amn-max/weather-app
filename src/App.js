import "./App.css";
import React, { useEffect } from "react";
import Main from "./components/Main";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Auth from "./components/Auth";
import AlertTemplate from "react-alert-template-basic";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import Login from "./components/Login";
import { useStateValue } from "./StateProvider";
import Navbar from "./components/Navbar";

function App() {
  const [{ user }, dispatch] = useStateValue();
  const options = {
    // you can also just use 'bottom center'
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: "30px",
    // you can also just use 'scale'
    transition: transitions.FADE,
  };

  return (
    <div>
      <AlertProvider template={AlertTemplate} {...options}>
        Tes
        <div>
          <BrowserRouter>
            <Switch>
              <Route path="/main">
                <Navbar />
                <Main />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route exact path="/">
                <Auth />
              </Route>
            </Switch>
          </BrowserRouter>
        </div>
      </AlertProvider>
    </div>
  );
}

export default App;
