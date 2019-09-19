import React, { Component } from "react";
import { withRouter } from "react-router";
import { Modal, Button, Form } from "react-bootstrap";
import { submitAuthentification } from "../api/backendApi";

class ModalLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
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
    this.props.setUser(user);
    if (this.props.user.status === 401) this.props.setOpenAlert(true);
    if (user) {
      this.props.history.push("/location");
    }
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              onChange={this.handleChangeEmail}
              isValid={this.checkValidEmail(this.state.email)}
              isInvalid={
                this.state.email && !this.checkValidEmail(this.state.email)
              }
              type="text"
              placeholder="Email"
            />
            <Form.Control
              style={{ marginTop: "20px" }}
              onChange={this.handleChangePassword}
              isValid={this.state.password.length > 5}
              type="Password"
              placeholder="Password"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => this.handleSubmit()}
            disabled={!this.state.email || !this.state.password}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default withRouter(ModalLogin);
