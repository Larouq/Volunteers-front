import React, { Component } from "react";
import { Modal, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { withRouter } from "react-router";
import {
  fetchUserRequests,
  deleteRequest,
  republishRequest
} from "../api/backendApi";
import "./modelUserRequest.scss";
import moment from "moment";

class ModalUserRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      requestId: null,
      openAlertDeleteRequest: false,
      openAlertRepublish: false,
      requestTitle: ""
    };
  }

  async componentDidMount() {
    const { authentication_token, client, email } = localStorage;
    const requests = await fetchUserRequests(
      authentication_token,
      client,
      email,
      localStorage.user_id
    );
    this.setState({ requests });
  }

  handleSubmit = (requestId, requestTitle) => {
    const { authentication_token, client, email } = localStorage;
    deleteRequest(authentication_token, client, email, requestId);
    this.setState({ requestTitle, openAlertDeleteRequest: true });
  };

  handleRepublish = (requestId, requestTitle) => {
    republishRequest(requestId);
    this.setState({ requestTitle, openAlertRepublish: true });
  };

  isRepublish = (now, updatedAt) => {
    const timeDiff = now - updatedAt;
    if (timeDiff > 86400000) return true;
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
        {this.state.openAlertRepublish && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Alert
              variant="success"
              onClose={() => this.setState({ openAlertRepublish: false })}
              dismissible
              style={{ width: "400px" }}
            >
              <Alert.Heading>
                Your Request {`${this.state.requestTitle}`} is republish
              </Alert.Heading>
              <p>Hope you found a good help</p>
            </Alert>
          </div>
        )}
        <Modal.Body className={"user_request"}>
          {this.state.requests && this.state.requests.length
            ? this.state.requests
                .filter(request => request.statement === "working")
                .map(request => {
                  return (
                    <div
                      key={(Math.floor(Math.random() * 10000) + 1).toString()}
                    >
                      <Row>
                        <Col xs={12}>
                          <Card className={"requests"}>
                            <Card.Img
                              variant="top"
                              src={`https://source.unsplash.com/user/ravi_roshan_inc/_AdUs32i0jc`}
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
                              <Card.Text className="text__request">
                                {request.description}
                              </Card.Text>
                              <Button
                                onClick={() =>
                                  this.handleSubmit(request.id, request.title)
                                }
                                variant="primary"
                              >
                                Done
                              </Button>
                              {request &&
                                request.status === "fulfilled" &&
                                this.isRepublish(
                                  moment(),
                                  moment(request.updated_at)
                                ) && (
                                  <Button
                                    style={{ marginLeft: "5px" }}
                                    variant="success"
                                    onClick={() =>
                                      this.handleRepublish(
                                        request.id,
                                        request.title
                                      )
                                    }
                                  >
                                    Republish
                                  </Button>
                                )}
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
