import React, { Component } from "react";
import { Modal, Button, Form, Alert, Dropdown } from "react-bootstrap";
import { getAddress, submitRequest } from "../api/backendApi";
import debounce from "lodash.debounce";
import { withRouter } from "react-router";

class ModalCreateRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestTitle: "",
      address: "",
      description: "",
      category: "Choose category",
      userId: this.props.userId,
      geoObject: {},
      openAlert: false
    };
  }

  handleChangeRequestTitle = elem => {
    this.setState({ requestTitle: elem.target.value });
  };
  handleChangeDescription = elem => {
    this.setState({ description: elem.target.value });
  };

  async onSearchAddress(value) {
    const result = await getAddress(value);
    if (
      result.status === 400 ||
      !result.data.response.GeoObjectCollection.featureMember[0]
    )
      this.setState({ openAlert: true });
    else {
      const {
        GeoObject
      } = result.data.response.GeoObjectCollection.featureMember[0];
      this.setState({ geoObject: GeoObject });
    }
  }

  handleChangeAddress = elem => {
    this.setState({ address: elem.target.value });
  };

  onBlurAddress = () => {
    if (this.state.address.length > 0)
      debounce(() => {
        this.onSearchAddress(this.state.address);
      }, 500)();
  };

  handleSubmitRequest = () => {
    const { requestTitle, description, geoObject, address, category } = this.state;
    const { authentication_token, client, email, user_id } = localStorage;
    const form = {
      title: requestTitle,
      description,
      geoObject,
      address,
      user_id,
      category
    };

    submitRequest(authentication_token, client, email, form);
    this.setState({category: "Choose category"})
    window.location.reload();
  };

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Request</Modal.Title>
        </Modal.Header>
        {this.state.openAlert && (
          <div>
            <Alert
              variant="danger"
              onClose={() => this.setState({ openAlert: false })}
              dismissible
              style={{ width: "400px" }}
            >
              <Alert.Heading>Search address failed</Alert.Heading>
              <p>Invalid address. Please try again</p>
            </Alert>
          </div>
        )}
        <Modal.Body>
          <Form>
            <Form.Group controlId="request-title">
              <Form.Label>Request title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Request title"
                onChange={this.handleChangeRequestTitle}
              />
            </Form.Group>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <input
                placeholder={"Address"}
                type="text"
                onChange={this.handleChangeAddress}
                onBlur={this.onBlurAddress}
                className="form-control"
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows="4"
                onChange={this.handleChangeDescription}
              />
            </Form.Group>
          </Form>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {this.state.category}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => this.setState({ category: "home & garden" })}
              >
                Home
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.setState({ category: "DIY" })}>
                DIY
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => this.setState({ category: "Mechanical" })}
              >
                Mechanical
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => this.setState({ category: "Other" })}
              >
                Other
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={this.handleSubmitRequest}
            disabled={
              !this.state.requestTitle ||
              !this.state.address ||
              !this.state.description
            }
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default withRouter(ModalCreateRequest);
