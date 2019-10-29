import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { withRouter } from "react-router";
import { fetchUserMessage, createMessage } from "../api/backendApi";
import "./modelUserMessage.scss";
import { ChatItem } from "react-chat-elements";
import "react-chat-elements/dist/main.css";

class ModalUserMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      text: ""
    };
  }

  async componentDidMount() {
    const { authentication_token, client, email } = localStorage;

    const messages = await fetchUserMessage(
      authentication_token,
      client,
      email,
      localStorage.user_id,
      this.props.requestId
    );

    this.setState({ messages });
  }

  handleTextMessage = elem => {
    this.setState({ text: elem.target.value });
  };

  handleSubmitMessage = () => {
    createMessage(this.props.requestId, localStorage.user_id, this.state.text);
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
          {this.state.messages && this.state.messages.length
            ? this.state.messages.map(message => {
                return (
                  <div key={message.id}>
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
              })
            : "you don't have message for this request"}
          <label className={"label"} form={"message"} />
          <textarea
            className={"text_message"}
            name={"message"}
            onChange={this.handleTextMessage}
          />
          <Button
            variant="success"
            onClick={this.handleSubmitMessage}
            disabled={!this.state.text || !this.state.messages.length}
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
