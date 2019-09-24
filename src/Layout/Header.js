import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { slide as Menu } from "react-burger-menu";
import { submitAuthentification } from "../api/backendApi.js";
import "./Layout.scss";
import { withRouter } from "react-router";
import ModalCreateRequest from "../Modal_createRequest/modalRequest";
import ModalUserRequest from "../Modal_userRequest/modalUserRequest";
import ModalLogin from "../Modal_login/modalLogin"

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      user: {},
      openModal: false,
      openModalUserRequest: false,
      openAlert: false,
      displayBurger: true,
      openModalLogin: false
    };
  }

  listenScrollEvent = e => {
    if (window.scrollY > 50) {
      this.setState({ color: "rgba(0, 0, 0, 0.6)" });
    } else {
      this.setState({ color: "black" });
    }
  };

  listenResizeEvent = e => {
    if (window.innerWidth < 1024) {
      this.setState({ displayBurger: false });
    } else {
      this.setState({ displayBurger: true });
    }
  };

  componentDidMount() {
    window.addEventListener("scroll", this.listenScrollEvent);
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

  setUser = (value) => {
    this.setState({user: value})
  }

  setOpenAlert = (value) => {
    this.setState({openAlert: value})
  }
 
  render() {
    const isMenuOpen = function(state) {
      return state.isOpen;
    };
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
                <Form>
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
                      <Button
                        variant="success"
                        className="open-login-button"
                        onClick={() => {
                         this.setState({openModalLogin: true})
                        }}
                      >
                        Login
                      </Button>
                    </Col>
                  </Row>
                </Form>
              ) : this.state.displayBurger ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <div
                    className="navlink"
                    style={{ marginRight: "20px" }}
                    onClick={() =>
                      this.setState({ openModalUserRequest: true })
                    }
                  >
                    my resquest
                  </div>
                  <div
                    className="navlink"
                    onClick={() => this.setState({ openModal: true })}
                  >
                    create request
                  </div>
                  <div
                    className="navlink"
                    style={{ marginLeft: "20px" }}
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
                <Menu className="bm-menu-wrap" right onStateChange={isMenuOpen}>
                  <div
                    className="menu-item"
                    onClick={() =>{
                      this.setState({ openModalUserRequest: true })
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    my request
                  </div>
                  <div
                    className="menu-item"
                    onClick={() => this.setState({ openModal: true })}
                    style={{ cursor: "pointer" }}
                  >
                    create request
                  </div>
                  <div
                    className="menu-item"
                    style={{ marginLeft: "20px", cursor: "pointer" }}
                    onClick={async () => {
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
                    this.setState({ openModal: false })
                  }}
                  userId={localStorage.user_id}
                />
              }
              {
                <ModalUserRequest
                  show={this.state.openModalUserRequest}
                  onHide={() => {
                    this.setState({ openModalUserRequest: false });
                  }}
                  onCloseModal={() => {
                    this.setState({ openModalUserRequest: false });
                  }}
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
