import React, { Component } from "react";
import ReactMapboxGl, { Popup } from "react-mapbox-gl";
import config from "../config";

const Map = ReactMapboxGl({
  accessToken: config.MAPBOX_API
});

class MapRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.mapRef = React.createRef();
  }

  render() {
    return (
      <Map
        style={"mapbox://styles/mapbox/streets-v8"}
        containerStyle={{
          height: this.props.height,
          width: this.props.width
        }}
        center={this.props.center}
        zoom={this.props.zoom}
        onMoveEnd={map => this.props.onMoveEnd(map.getCenter())}
        onZoomEnd={map => this.props.onZoomEnd(map.getCenter())}
      >
        {this.props.requests &&
          this.props.requests.map(request => {
            return (
              <Popup
                coordinates={[request.lng, request.lat]}
                key={request.id}
                offset={{
                  "bottom-left": [12, -38],
                  bottom: [0, -38],
                  "bottom-right": [-12, -38]
                }}
                style={this.props.styleCursor}
                onClick={() => this.props.onClickPopup(request.id)}
              >
                <p>{request.title}</p>
                <img
                  src={"https://source.unsplash.com/user/erondu"}
                  style={{ borderRadius: "50%", width: "70px", height: "70px" }}
                />
              </Popup>
            );
          })}
      </Map>
    );
  }
}

export default MapRequest;
