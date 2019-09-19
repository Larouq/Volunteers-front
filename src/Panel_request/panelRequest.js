import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import SlidingPanel from "react-sliding-panel";
import "./panel-request.scss";
import moment from "moment";
import MapRequest from "../Map/map";
import { sendEmail } from '../api/backendApi';

class PanelRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
  }

  handleChangeMessage = elem => {
    this.setState({ message: elem.target.value });
  };

  handleSubmit = () => {
    sendEmail(localStorage.email, this.props.request.user_id, this.state.message)
    this.props.handleOpenAlert(true)
    this.props.setIsOpenPanel(false)
  };
  render() {
    const {
      title,
      address,
      created_at,
      description,
      lat,
      lng,
    } = this.props.request;
    return (
      <SlidingPanel
        type={this.props.type}
        isOpen={this.props.isOpen}
        closeFunc={this.props.onClose}
        className={'sliding_panel'}
      >
        <div className={"card-request-panel"}>
          <Card style={{ marginBottom: "20px" }}>
            <Card.Body>
              <Card.Title>{title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Posted at: {moment(created_at).format("YYYY-MM-DD")}
                <br />
                {address}
              </Card.Subtitle>
              <Card.Text>{description}</Card.Text>
            </Card.Body>
          </Card>
          <MapRequest
            height={"40vh"}
            className="map_request"
            requests={[this.props.request]}
            center={[lng, lat]}
            zoom={[14]}
            onClickPopup={() => false}
            onMoveEnd={() => false}
            onZoomEnd={() => false}
          />
          <div className={"message-area"}>
            <label className={"label"} form={"message"}>
              Send a message to help
            </label>
            <textarea
              className={"textarea"}
              name={"message"}
              onChange={this.handleChangeMessage}
            />
            <div style={{ width: "100%" }}>
              <Button
                className={"button-help"}
                variant="info"
                onClick={this.handleSubmit}
                disabled={!this.state.message}
              >
                Help!
              </Button>
            </div>
          </div>
        </div>
      </SlidingPanel>
    );
  }
}

export default PanelRequest;
