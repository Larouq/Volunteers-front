import React, { Component } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <Container className="footer_nav" style={{ marginTop: "10px" }}>
        <Row>
          <Col xs={12}>
            <Card style={{ backgroundColor: "black", color: "white" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "40%",
                    justifyContent: "space-between"
                  }}
                >
                  <p>Volunteers larouq - All right Reserved</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Footer;
