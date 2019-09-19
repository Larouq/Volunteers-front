import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Home from "./Home";
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import Location from "./Location/Location";
import "./App.css";
import { PrivateRoute } from "./helpers/PrivateRoute";

function App() {
  return (
    <Router>
      <Header />
      <div>
        <Route
          exact
          path="/"
          render={() => (
            localStorage.authentication_token ? (
              <Redirect to="/location" />
            ) : (
              <Home />
            )
          )}
        />
        <PrivateRoute exact path="/location" component={Location} />
      </div>
      <Footer />
    </Router>
  );
}

export default App;
