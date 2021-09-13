import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./assets/sass/theme.scss";
import "./assets/sass/_main.scss";

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root"),
);
