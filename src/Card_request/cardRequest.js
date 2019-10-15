import React, { Component } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import PanelRequest from "../Panel_request/panelRequest";
import "./cardRequest.scss";

class CardRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openPanel: false
    };
  }

  setIsOpenPanel = value => {
    this.setState({ openPanel: value });
  };
  render() {
    return (
      <div>
        <Row>
          <Col xs={12}>
            <Card className={"requests"} style={{height: "22vh"}}>
              <Card.Img
                variant="top"
                src={`https://source.unsplash.com/user/ravi_roshan_inc/_AdUs32i0jc`}
                style={{ width: "35%", height: "100%" }}
              />
              <Card.Body>
                <div className={'title_request'}>
                  <Card.Title>{this.props.title}</Card.Title>
                  <div className={`${this.props.category}__card`}>
                    {this.props.category}
                  </div>
                </div>
                <Card.Subtitle className="mb-2 text-muted">
                  {this.props.address}
                </Card.Subtitle>

                <Card.Text>{this.props.description}</Card.Text>
                <Button
                  onClick={() => this.setState({ openPanel: true })}
                  variant="primary"
                >
                  See more
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {this.state.openPanel && (
          <PanelRequest
            type={"side"}
            isOpen={this.state.openPanel}
            onClose={() => this.setState({ openPanel: false })}
            request={this.props.request}
            setIsOpenPanel={this.setIsOpenPanel}
            handleOpenAlert={this.props.handleOpenAlert}
          />
        )}
      </div>
    );
  }
}

export default CardRequest;
