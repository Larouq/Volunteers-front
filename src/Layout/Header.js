import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { slide as Menu } from "react-burger-menu";
import { submitAuthentification } from "../api/backendApi.js";
import "./Layout.scss";
import { withRouter } from "react-router";
import ModalCreateRequest from "../Modal_createRequest/modalRequest";
import ModalLogin from "../Modal_login/modalLogin";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      user: {},
      openModal: false,
      openAlert: false,
      displayBurger: true,
      openModalLogin: false,
      openModalMessage: false,
      isOpenBurgerMenu: false
    };
  }

  listenResizeEvent = () => {
    if (window.innerWidth < 1030) {
      this.setState({ displayBurger: false });
    } else {
      this.setState({ displayBurger: true });
    }
  };

  componentDidMount() {
    window.addEventListener("resize", this.listenResizeEvent);
  }

  checkValidEmail = email => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email.length > 0) {
      return emailRegex.test(email);
    }

    return false;
  };

  handleChangeEmail = elem => {
    this.setState({ email: elem.target.value });
  };

  handleChangePassword = elem => {
    this.setState({ password: elem.target.value });
  };

  async handleSubmit() {
    const user = await submitAuthentification({ ...this.state });
    this.setState({ user });
    if (this.state.user.status === 401) this.setState({ openAlert: true });
    if (user) {
      this.props.history.push("/location");
    }
  }

  setUser = value => {
    this.setState({ user: value });
  };

  setOpenAlert = value => {
    this.setState({ openAlert: value });
  };

  setModalLogin = value => {
    this.setState({ openModalLogin: value });
  };

  closeMenu() {
    this.setState({ isOpenBurgerMenu: false });
  }

  handleStateChange(state) {
    this.setState({ isOpenBurgerMenu: state.isOpen });
  }

  render() {
    return (
      <div>
        <header className="App-header" style={{ background: "black" }}>
          <nav>
            <Link
              style={{ textDecoration: "none" }}
              to={this.state.user ? "/location" : "/"}
            >
              <h1 className="name">Volunteers</h1>
            </Link>
            <div className="navbar">
              {!localStorage.authentication_token ? (
                <div>
                  <Form className="form_header">
                    <Row>
                      <Col xs={5}>
                        <Form.Control
                          onChange={this.handleChangeEmail}
                          className="default_login"
                          isValid={this.checkValidEmail(this.state.email)}
                          isInvalid={
                            this.state.email &&
                            !this.checkValidEmail(this.state.email)
                          }
                          type="text"
                          placeholder="Email"
                        />
                      </Col>
                      <Col xs={5}>
                        <Form.Control
                          onChange={this.handleChangePassword}
                          className="default_login"
                          isValid={this.state.password.length > 5}
                          type="Password"
                          placeholder="Password"
                        />
                      </Col>
                      <Col xs={2}>
                        <Button
                          variant="success"
                          className="default_login"
                          onClick={() => {
                            this.handleSubmit();
                          }}
                          disabled={
                            !this.state.email ||
                            !this.state.password ||
                            !this.checkValidEmail(this.state.email)
                          }
                        >
                          login
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  <Button
                    variant="success"
                    className="open-login-button"
                    onClick={() => {
                      this.setState({ openModalLogin: true });
                    }}
                  >
                    Login
                  </Button>
                </div>
              ) : window.innerWidth > 1030 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                  className="burger__menu"
                >
                  <div
                    className="navlink"
                    style={{ marginRight: "20px" }}
                    onClick={() => this.props.history.push("/proposal")}
                  >
                    my proposals
                  </div>
                  <div
                    className="navlink"
                    style={{ marginRight: "20px" }}
                    onClick={() => this.props.history.push("/request")}
                  >
                    my requests
                  </div>
                  <div
                    className="navlink"
                    onClick={() => this.setState({ openModal: true })}
                  >
                    create request
                  </div>
                  <div
                    className="navlink"
                    style={{ marginLeft: "70px" }}
                    onClick={async () => {
                      await localStorage.clear();
                      this.setState({ email: "", password: "" });
                      this.props.history.push("/");
                    }}
                  >
                    log out
                  </div>
                </div>
              ) : (
                <Menu
                  className="bm-menu-wrap"
                  right
                  isOpen={this.state.isOpenBurgerMenu}
                  onStateChange={state => this.handleStateChange(state)}
                >
                  <div
                    className="menu-item"
                    onClick={() => {
                      this.props.history.push("/request");
                      this.closeMenu();
                    }}
                  >
                    my requests
                  </div>
                  <div
                    className="menu-item"
                    onClick={() => {
                      this.setState({ openModal: true });
                      this.closeMenu();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    create request
                  </div>
                  <div
                    className="menu-item"
                    style={{ marginLeft: "20px", cursor: "pointer" }}
                    onClick={async () => {
                      this.closeMenu();
                      await localStorage.clear();
                      this.setState({ email: "", password: "" });
                      this.props.history.push("/");
                    }}
                  >
                    log out
                  </div>
                </Menu>
              )}
              {
                <ModalCreateRequest
                  show={this.state.openModal}
                  onHide={() => this.setState({ openModal: false })}
                  onCloseModal={() => {
                    this.setState({ openModal: false });
                  }}
                  userId={localStorage.user_id}
                />
              }
              {
                <ModalLogin
                  show={this.state.openModalLogin}
                  onHide={() => {
                    this.setState({ openModalLogin: false });
                  }}
                  onCloseModal={() => {
                    this.setState({ openModalLogin: false });
                  }}
                  setModalLogin={this.setModalLogin}
                  setUser={this.setUser}
                  setOpenAlert={this.setOpenAlert}
                  user={this.state.user}
                />
              }
            </div>
          </nav>
        </header>
        {this.state.openAlert && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Alert
              variant="danger"
              onClose={() => this.setState({ openAlert: false })}
              dismissible
              style={{ width: "400px" }}
            >
              <Alert.Heading>Authentification failed</Alert.Heading>
              <p>Invalid login credentials. Please try again</p>
            </Alert>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Header);
