import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { withRouter } from "react-router";
import { fetchUserResponse, createMessage } from "../api/backendApi";
import "./modelUserMessage.scss";
import { ChatItem } from "react-chat-elements";
import "react-chat-elements/dist/main.css";

class ModalUserMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responses: [],
      text: "",
      userId: 0,
      responseId: 0
    };
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  async componentDidMount() {
    this.scrollToBottom();
    const { authentication_token, client, email } = localStorage;

    const responses = await fetchUserResponse(
      authentication_token,
      client,
      email,
      localStorage.user_id,
      this.props.requestId
    );

    this.setState({
      responses,
      userId: responses[0].user_id,
      responseId: responses[0].id
    });

    try {
      setInterval(async () => {
        this.refetchResponses()
      }, 2000);
    } catch (error) {
      return alert(new Error(`${error.response}`));
    }
  }

  refetchResponses = async () => {
    const { authentication_token, client, email } = localStorage;

    const responses = await fetchUserResponse(
      authentication_token,
      client,
      email,
      localStorage.user_id,
      this.props.requestId
    );

    this.setState({
      responses
    });
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  handleTextMessage = elem => {
    this.setState({ text: elem.target.value });
  };

  handleSubmitMessage = responseId => {
    const { authentication_token, client, email } = localStorage;
    createMessage(
      responseId,
      localStorage.user_id,
      this.state.text,
      authentication_token,
      client,
      email
    );
    this.setState({ text: "" });
  };

  displayConversation = async (userId, responseId) => {
    this.setState({ userId, responseId });
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
          <Modal.Title>Your messages</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="user_response">
            {this.state.responses &&
              this.state.responses.map(response => {
                return (
                  <div key={response.id}>
                    <Button
                      variant="outline-primary"
                      className="user_name"
                      active={response.user_id === this.state.userId}
                      onClick={() => {
                        this.displayConversation(response.user_id, response.id);
                      }}
                    >
                      {response.name}
                    </Button>
                  </div>
                );
              })}
          </div>
          <div>
            <div className="message-box">
              {this.state.responses &&
                this.state.responses
                  .filter(response => response.user_id === this.state.userId)
                  .map(response => {
                    return response.messages.map(message => {
                      return (
                        <div key={message.id} className="request_conversation">
                          <ChatItem
                            avatar={`https://source.unsplash.com/user/cassidyjames/demvKRNvtLY`}
                            alt={"Reactjs"}
                            title={message.name}
                            subtitle={message.content}
                            date={new Date(message.created_at)}
                            unread={0}
                          />
                        </div>
                      );
                    });
                  })}
              <div
                ref={el => {
                  this.messagesEnd = el;
                }}
              />
            </div>
          </div>
          <label className={"label"} form={"message"} />
          <textarea
            className={"text_message"}
            name={"message"}
            onChange={this.handleTextMessage}
            value={this.state.text}
          />
          <Button
            variant="success"
            onClick={() => {
              this.handleSubmitMessage(this.state.responseId);
              this.refetchResponses()
            }}
            disabled={!this.state.text || !this.state.responses.length}
          >
            Reply
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onCloseModal}>close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default withRouter(ModalUserMessage);
