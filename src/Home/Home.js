import React, { Component } from "react";
import { Card, Container, Row, Col, Form, Button } from "react-bootstrap";
import "./Home.scss";
import "bootstrap/dist/css/bootstrap.css";
import { submitRegistration } from "../api/backendApi.js";
import { withRouter } from "react-router";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      isSubmit: false,
      isValidEmail: false
    };
  }
  handleChangeFirstName = elem => {
    this.setState({ firstName: elem.target.value });
  };

  handleChangeLastName = elem => {
    this.setState({ lastName: elem.target.value });
  };

  handleChangeEmail = elem => {
    this.setState({ email: elem.target.value });
  };

  handleChangePassword = elem => {
    this.setState({ password: elem.target.value });
  };

  checkValidEmail = email => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email.length > 0) {
      return emailRegex.test(email);
    }

    return false;
  };

  handleSubmit = async () => {
    await submitRegistration({...this.state})
    this.props.history.push("/location");
  };
  render() {
    return (
      <Container className={'home-container'} style={{ marginTop: "30px" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "white"
          }}
        >
          <h1>Become the hero of your neighborhood</h1>
        </div>
        <Row>
          <Col xs={12}>
            <Card
              bg={"light"}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Card.Header>
                <div>
                  Welcome on Volunteers!{" "}
                  <span role={"img"} aria-label="smile">
                    😀
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#5b5b5b",
                    fontStyle: "italic"
                  }}
                >
                  Fill out the form below to register
                </div>
              </Card.Header>
              <Card.Body>
                <div className="small-container">
                  <Form>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formBasicFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          onChange={this.handleChangeFirstName}
                          style={{ height: "50px" }}
                          isValid={this.state.firstName.length > 5}
                          isInvalid={
                            this.state.firstName &&
                            this.state.firstName.length < 5
                          }
                          type="text"
                          placeholder="First name"
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formBasicLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          onChange={this.handleChangeLastName}
                          style={{ height: "50px" }}
                          isValid={this.state.lastName.length > 5}
                          isInvalid={
                            this.state.lastName &&
                            this.state.lastName.length < 5
                          }
                          type="text"
                          placeholder="Last name"
                        />
                      </Form.Group>
                    </Form.Row>
                  </Form>
                  <Form>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        onChange={this.handleChangeEmail}
                        style={{ height: "50px" }}
                        isValid={this.checkValidEmail(this.state.email)}
                        isInvalid={
                          this.state.email &&
                          !this.checkValidEmail(this.state.email)
                        }
                        type="email"
                        placeholder="Enter email"
                      />
                    </Form.Group>
                  </Form>
                  <Form>
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        onChange={this.handleChangePassword}
                        isValid={this.state.password.length > 5}
                        isInvalid={
                          this.state.password && this.state.password.length < 5
                        }
                        style={{ height: "50px" }}
                        type="password"
                        placeholder="Password"
                      />
                    </Form.Group>
                  </Form>
                  <Button
                    variant="success"
                    onClick={() => this.handleSubmit()}
                    disabled={
                      !this.state.firstName ||
                      !this.state.lastName ||
                      !this.state.email ||
                      !this.state.password ||
                      !this.checkValidEmail(this.state.email)
                    }
                  >
                    Submit
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Home);
