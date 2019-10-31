import React, { Component, Fragment } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router";
import { fetchResponses } from "../api/backendApi";
import ModalProposalMessage from "../Modal_proposalMessage/modalProposalMessage";

class UserProposal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposals: [],
      responseId: null,
      openModalProposalMessage: false
    };
  }

  componentDidMount() {
    this.fetchProposal();
  }

  fetchProposal = async () => {
    const { authentication_token, client, email, user_id } = localStorage;
    const proposals = await fetchResponses(authentication_token, client, email);

    this.setState({
      proposals: proposals.filter(proposal => {
        return proposal.user_id.toString() === user_id;
      })
    });
  };

  render() {
    return (
      <Fragment>
        <Row style={{ justifyContent: "center" }}>
          <Col xs={6}>
            {!this.state.proposals.length && (
              <Card>
                <Card.Body>You have no proposal</Card.Body>
              </Card>
            )}
          </Col>
        </Row>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {this.state.proposals &&
            this.state.proposals.map(proposal => {
              return (
                <div key={proposal.id}>
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
                            {proposal.request.title}{" "}
                            {`(${proposal.messages.length} messages)`}
                          </Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            Status: {proposal.request.status}
                          </Card.Subtitle>
                          <Card.Subtitle className="mb-2 text-muted">
                            {proposal.request.address}
                          </Card.Subtitle>
                          <Card.Text className="text__request">
                            {proposal.request.description}
                          </Card.Text>
                          <Button
                            onClick={() =>
                              this.setState({
                                openModalProposalMessage: true,
                                responseId: proposal.id
                              })
                            }
                            variant="primary"
                          >
                            See messages
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              );
            })}
        </div>
        {this.state.openModalProposalMessage && (
          <ModalProposalMessage
            show={this.state.openModalProposalMessage}
            proposals={
              this.state.responseId !== null &&
              this.state.proposals.filter(
                proposal => proposal.id === this.state.responseId
              )
            }
            refetch={this.fetchProposal}
            onHide={() => {
              this.setState({ openModalProposalMessage: false });
            }}
            onCloseModal={() => {
              this.setState({ openModalProposalMessage: false });
            }}
          />
        )}
      </Fragment>
    );
  }
}

export default withRouter(UserProposal);
