import React, { Component, Fragment } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router";
import {
  fetchUserRequests,
  deleteRequest,
  republishRequest
} from "../api/backendApi";
import ModalUserMessage from "../Modal_userMessage/modalUserMessage";
import "./userRequest.scss";
import moment from "moment";

class UserRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      requestId: null,
      openModalUserMessage: false
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

  handleDeleteRequest = requestId => {
    const { authentication_token, client, email } = localStorage;
    deleteRequest(authentication_token, client, email, requestId);
  };

  handleRepublish = requestId => {
    const { authentication_token, client, email } = localStorage;
    republishRequest(authentication_token, client, email, requestId);
  };

  isRepublish = (now, updatedAt) => {
    const timeDiff = now - updatedAt;
    if (timeDiff > 86400000) return true;
  };

  render() {
    return (
      <Fragment>
        <Row style={{ justifyContent: "center" }}>
          <Col xs={6}>
            {!this.state.requests.length && (
              <Card>
                <Card.Body>You have no request</Card.Body>
              </Card>
            )}
          </Col>
        </Row>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {this.state.requests &&
            this.state.requests
              .filter(request => request.statement === "working")
              .map(request => {
                return (
                  <div key={(Math.floor(Math.random() * 10000) + 1).toString()}>
                    <Row style={{ justifyContent: "center" }}>
                      <Col xs={6}>
                        <Card className={"requests"}>
                          <Card.Img
                            variant="top"
                            src={`https://source.unsplash.com/user/ravi_roshan_inc/_AdUs32i0jc`}
                            style={{ width: "35%", height: "100%" }}
                          />
                          <Card.Body>
                            <Card.Title>
                              {request.title}{" "}
                              {request.count_helper !== 0
                                ? `(${request.count_helper} helpers)`
                                : "(no helper)"}
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              Status: {request.status}
                            </Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">
                              {request.address}
                            </Card.Subtitle>
                            <Card.Text className="text__request">
                              {request.description}
                            </Card.Text>
                            {request.count_helper !== 0 && (
                              <Button
                                onClick={() =>
                                  this.setState({
                                    openModalUserMessage: true,
                                    requestId: request.id
                                  })
                                }
                                variant="primary"
                              >
                                See messages
                              </Button>
                            )}
                          </Card.Body>
                          <Card.Footer>
                            <Button
                              onClick={() => {
                                this.handleDeleteRequest(request.id);
                                window.location.reload();
                              }}
                              variant="dark"
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
                                  onClick={() => {
                                    console.log("requestId", request.id);
                                    this.handleRepublish(request.id);
                                    window.location.reload();
                                  }}
                                >
                                  Republish
                                </Button>
                              )}
                          </Card.Footer>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                );
              })}
        </div>
        {this.state.requestId !== null && (
          <ModalUserMessage
            requestId={this.state.requestId}
            show={this.state.openModalUserMessage}
            onHide={() => {
              this.setState({ requestId: null });
            }}
            onCloseModal={() => {
              this.setState({ requestId: null });
            }}
          />
        )}
      </Fragment>
    );
  }
}

export default withRouter(UserRequest);
