import React, { Component, Fragment } from "react";
import { Container, Alert, Card } from "react-bootstrap";
import "./Location.scss";
import { fetchRequests } from "../api/backendApi";
import MapRequest from "../Map/map";
import CardRequest from "../Card_request/cardRequest";
import PanelRequest from "../Panel_request/panelRequest";
import turf from "turf";

class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      requestId: null,
      openAlert: false,
      center: [2.3514616, 48.8566969],
      zoom: [12],
      isMobileSize: false
    };
  }

  async componentDidMount() {
    this.getMyPosition();
    const { authentication_token, client, email } = localStorage;
    const requests = await fetchRequests(
      authentication_token,
      client,
      email,
      null
    );
    this.setState({
      requests: requests.map(request => {
        const result = {
          point: turf.point([request.lng, request.lat]),
          ...request
        };
        return result;
      })
    });
    try {
      setInterval(async () => {
        const requests = await fetchRequests(
          authentication_token,
          client,
          email,
          null
        );
        this.setState({
          requests: requests.map(request => {
            const result = {
              point: turf.point([request.lng, request.lat]),
              ...request
            };
            return result;
          })
        });
      }, 3600000);
    } catch (error) {
      console.log(error);
    }
  }

  handleOpenAlert = value => {
    this.setState({ openAlert: value });
  };

  onSortRequests = (requests, center) => {
    requests.sort((a, b) => {
      if (turf.distance(center, a.point) < turf.distance(center, b.point))
        return -1;
      if (turf.distance(center, a.point) > turf.distance(center, b.point))
        return 1;
      return 0;
    });
  };

  getMyPosition = () => {
    window.navigator.geolocation.getCurrentPosition(position => {
      const newCenter = [position.coords.longitude, position.coords.latitude];
      this.setState({ center: newCenter });
    });
  };

  getStatRequest = arrayRequests => {
    const filterRequests = arrayRequests.filter(
      request => request.status === "unfulfilled"
    );
    return filterRequests.length;
  };

  render() {
    return (
      <Fragment>
        <div
          style={{ display: "flex", flexDirection: "row" }}
          className={"location-container"}
        >
          <div className={"map_request"}>
            <MapRequest
              className="map_location"
              width={"100%"}
              height={window.innerWidth < 820 ? "88vh" : "83vh"}
              requests={this.state.requests.filter(
                request =>
                  request.status === "unfulfilled" &&
                  request.statement === "working"
              )}
              center={this.state.center}
              onMoveEnd={center => {
                const mapCenter = [center.lng, center.lat];
                const pointCenter = turf.point(mapCenter);
                const sortRequest = this.onSortRequests(
                  this.state.requests,
                  pointCenter
                );
                this.setState({ request: sortRequest, center: mapCenter });
              }}
              zoom={this.state.zoom}
              onZoomEnd={center => {
                const mapCenter = [center.lng, center.lat];
                const pointCenter = turf.point(mapCenter);
                const sortRequest = this.onSortRequests(
                  this.state.requests,
                  pointCenter
                );
                this.setState({ request: sortRequest, center: mapCenter });
              }}
              styleCursor={{ cursor: "pointer" }}
              onClickPopup={requestId => this.setState({ requestId })}
            />
          </div>
          <div className={"request-container"} style={{ width: "50%" }}>
            <Container>
              {this.state.openAlert && (
                <div>
                  <Alert
                    variant="success"
                    onClose={() => this.setState({ openAlert: false })}
                    dismissible
                    style={{ width: "100%" }}
                  >
                    <Alert.Heading>Your email is Send</Alert.Heading>
                    <p>email was sending to the user</p>
                  </Alert>
                </div>
              )}
              <Card>
                <Card.Body>
                  {this.state.requests
                    ? `Hey, we have ${this.state.requests &&
                        this.getStatRequest(
                          this.state.requests
                        )} unfulfilled requests, 
                do not hesitate to offer your help!`
                    : "No unfulfilled request for the moment"}
                </Card.Body>
              </Card>
              {this.state.requests &&
                this.state.requests
                  .filter(
                    request =>
                      request.status === "unfulfilled" &&
                      request.statement === "working"
                  )
                  .map(request => {
                    return (
                      <div
                        key={(Math.floor(Math.random() * 10000) + 1).toString()}
                      >
                        <CardRequest
                          title={request.title}
                          description={request.description}
                          address={request.address}
                          category={request.category}
                          request={request}
                          handleOpenAlert={this.handleOpenAlert}
                        />
                      </div>
                    );
                  })}
            </Container>
          </div>
          {this.state.requestId !== null && (
            <PanelRequest
              type={"side"}
              isOpen
              onClose={() => this.setState({ requestId: null })}
              request={this.state.requests.find(
                request => request.id === this.state.requestId
              )}
              handleOpenAlert={this.handleOpenAlert}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

export default Location;
