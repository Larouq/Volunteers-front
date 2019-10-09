import React, { Component } from "react";
import { Modal, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { withRouter } from "react-router";
import { fetchRequests, deleteRequest } from "../api/backendApi";
import "./modelUserRequest.scss";

class ModalUserRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      openAlertDeleteRequest: false,
      requestTitle: ""
    };
  }

  async componentDidMount() {
    const { authentication_token, client, email } = localStorage;
    const requests = await fetchRequests(
      authentication_token,
      client,
      email,
      localStorage.user_id
    );
    this.setState({ requests });
  }

  handleSubmit = (requestId, requestTitle) => {
    deleteRequest(requestId);
    this.setState({ requestTitle, openAlertDeleteRequest: true });
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
          <Modal.Title>Your requests</Modal.Title>
        </Modal.Header>
        {this.state.openAlertDeleteRequest && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Alert
              variant="success"
              onClose={() => this.setState({ openAlertDeleteRequest: false })}
              dismissible
              style={{ width: "400px" }}
            >
              <Alert.Heading>
                Your Request {`${this.state.requestTitle}`} is done
              </Alert.Heading>
              <p>Hope you found a good help</p>
            </Alert>
          </div>
        )}
        <Modal.Body className={"user_request"}>
          {this.state.requests && this.state.requests.length
            ? this.state.requests.map(request => {
                return (
                  <div key={(Math.floor(Math.random() * 10000) + 1).toString()}>
                    <Row>
                      <Col xs={12}>
                        <Card className={"requests"}>
                          <Card.Img
                            variant="top"
                            src={`https://source.unsplash.com/user/erondu`}
                            style={{ width: "35%", height: "100%" }}
                          />
                          <Card.Body>
                            <Card.Title>{request.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              Status: {request.status}
                            </Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">
                              {request.address}
                            </Card.Subtitle>
                            <Card.Text className="text__request">{request.description}</Card.Text>
                            <Button
                              onClick={() =>
                                this.handleSubmit(request.id, request.title)
                              }
                              variant="primary"
                            >
                              Done
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                );
              })
            : "you don't have request"}
        </Modal.Body>
        <Modal.Footer variant="secondary">
          <Button variant="secondary" onClick={this.props.onCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default withRouter(ModalUserRequest);
