import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMeh,faSmile, faGrin, faLaugh, faLaughBeam } from "@fortawesome/free-regular-svg-icons";
import { faFrownOpen,faFrown, faAngry, faMehRollingEyes } from "@fortawesome/free-regular-svg-icons";


const mapStyles = {
  width: '100%',
  height: '90%'
};


export class MapContainer extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {}, 
        fields: {},
        marker: {name:"", position: {}},
        values: [0],
        icon : "faMeh",
        color: "#E5FF00"
      }
    }


    // function to set appropriate icon and colour for sentiment
    setIcon(sentiment){
      if (sentiment > 0.2){
          if (sentiment < 0.4){
            this.setState({icon : faSmile, color:"#5F9F00"})
          }else if (sentiment <0.6){
            this.setState({icon : faGrin, color:"#3FBF00"})
          }else if (sentiment < 0.8){
            this.setState({icon : faLaugh, color:"#1FDF00"})
          }else{
            this.setState({icon : faLaughBeam, color:"#00FF00"})
          }
      }else if (sentiment < -0.2){
          if (sentiment > -0.4){
            this.setState({icon : faMehRollingEyes, color:"#9F5F00"})
          }else if (sentiment > -0.6){
            this.setState({icon : faFrownOpen, color:"#BF3F00"})
          }else if (sentiment > -0.8){
            this.setState({icon : faFrown, color:"#DF1F00"})
          }else{
            this.setState({icon : faAngry, color:"#FF0000"})
          }
      }else{
      this.setState({icon : faMeh, color:"#7F7F00"})
      }
    }


    // show info box on marker click
    onMarkerClick = (props, marker, e) => {
      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      });
    }


    // when the map is clicked, make post  request to get sentiment in area clicked
    onMapClick = (mapProps, map, clickEvent) => {
      const lat= clickEvent.latLng.lat();
      const lng = clickEvent.latLng.lng();
      fetch("/getSentiment",
        {
          method: 'post',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({"lat": lat,"lng":lng})
        }
      ).then(response => response.json().then(data => {
        console.log(data["sentiment"])

        // calls function to set appropriate icon and colour
        this.setIcon(data["sentiment"])
        
        // creates marker on click
        this.setState({
          marker: {name:data["sentiment"],
                    position: {lat, lng}}
        })
      }))
    }


    // handle closing info window
    onClose = (props) => {
      this.setState({
              showingInfoWindow: false,
              activeMarker: null
            })
    }
  
    
    render() {
        return (
          <div>

            <h1 style={{textAlign:"center"}}>
                  Positivity Checker
            </h1>

          <div>
            <Map 
              google={this.props.google} 
              zoom={14} 
              style={mapStyles}
              initialCenter={{
                lat: 55.8642,
                lng: -4.2518
              }}
              onClick={this.onMapClick}>

              <Marker onClick={this.onMarkerClick}
                      name={this.state.marker.name}
                      position={this.state.marker.position} />


              <InfoWindow style={{color:"black"}}
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClose={this.onClose}>

                  <div>
                    <h1>People are feeling</h1>
                    <h1 style={{textAlign:"center"}}> 
                      <FontAwesomeIcon icon={this.state.icon} 
                          style={{color:this.state.color}} />
                    </h1>
                  </div>
              </InfoWindow>
            
            </Map>
            </div>
          </div>
        );
  }
}


const MAPS_KEY = process.env.REACT_APP_MAPS_API_KEY
export default GoogleApiWrapper({
    apiKey: MAPS_KEY,
})(MapContainer);