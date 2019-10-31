import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { withRouter } from "react-router";
import "./modalProposalMessage.scss";
import { ChatItem } from "react-chat-elements";
import { createMessage } from "../api/backendApi";
import "react-chat-elements/dist/main.css";

class ModalProposalMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }

  handleTextMessage = elem => {
    this.setState({ text: elem.target.value });
  };

  handleSubmitMessage = responseId => {
    createMessage(responseId, localStorage.user_id, this.state.text);
    this.setState({ text: "" });
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
          <div className="message-box">
            {this.props.proposals[0] &&
              this.props.proposals[0].messages.map(message => {
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
              })}
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
              this.handleSubmitMessage(this.props.proposals[0].id);
            }}
            disabled={!this.state.text}
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

export default withRouter(ModalProposalMessage);