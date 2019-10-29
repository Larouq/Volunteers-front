import React, { Component, Fragment } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router";
import { fetchUserRequests, deleteRequest } from "../api/backendApi";
import ModalUserMessage from "../Modal_userMessage/modalUserMessage";
import "./userProposal.scss";

class UserProposal extends Component {
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

  handleSubmit = (requestId, requestTitle) => {
    const { authentication_token, client, email } = localStorage;
    deleteRequest(authentication_token, client, email, requestId);
    this.setState({ requestTitle, openAlertDeleteRequest: true });
  };

  render() {
    return (
      <Fragment>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {this.state.requests &&
            this.state.requests
              .filter(
                request =>
                  request.status === "unfulfilled" &&
                  request.statement === "working"
              )
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
                                this.setState({
                                  openModalUserMessage: true,
                                  requestId: request.id
                                })
                              }
                              variant="primary"
                            >
                              messages
                            </Button>
                          </Card.Body>
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

export default withRouter(UserProposal);
