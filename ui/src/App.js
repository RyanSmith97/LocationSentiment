import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import { Range } from 'react-range';
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
        values: [0] 
      }
    }

    
  
    onMarkerClick = (props, marker, e) => {
      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      });
      console.log("marker click")
    }

    //  = (props) => {
    //   console.log(props)
    //   if (this.state.showingInfoWindow) {
    //     this.setState({
    //       showingInfoWindow: false,
    //       activeMarker: null
    //     })
    //   }
    //   console.log("map click")
    // };

    // onMapClick = (location, map) => {
    //   onMarkerClick = (markerProps, marker, clickEvent) => {
    //     console.log(marker.latLng)
    //     const loc = clickEvent.location
    //     console.log(loc)
    //   this.setState(prev => ({
    //     fields: {
    //       loc
    //     }
    //   }));
    //   // console.log(location.lat(), location.lng())
    //   // fetch("/getSentinment").then(response => response.json().then(data => {
    //   //   console.log(data)
    //   //   this.setState({
    //   //     selectedPlace: props,
    //   //   })
    //   // }))
    // };

    onMapClick = (mapProps, map, clickEvent) => {
      const lat= clickEvent.latLng.lat();
      const lng = clickEvent.latLng.lng();
      console.log(JSON.stringify({"lat":lat, "lng":lng}))
      console.log(lat)
      fetch("/getSentinment"
        ,{
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({"lat": lat,"lng":lng})
      }
      ).then(response => response.json().then(data => {
        console.log(data["sentiment"])
        this.setState({
          marker: {name:data["sentiment"],
                    position: {lat, lng}}
        })
      }))
    }
    onClose = (props) => {
      this.setState({
              showingInfoWindow: false,
              activeMarker: null
            })
    }
    markerClick = (location, map) => {
      console.log(location.lat())

    }
    render() {
      
        return (
          <div>
            <h1><Range
                    step={0.1}
                    min={-1}
                    max={1}
                    values={this.state.values}
                    onChange={values => this.setState({ values })}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: '6px',
                          width: '300px',
                          backgroundColor: '#ccc'
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: '42px',
                          width: '42px',
                          backgroundColor: '#999'
                        }}
                      />
                    )}
                  /></h1>
            <div>
          <Map 
            google={this.props.google} 
            zoom={14} 
            style={mapStyles}
            initialCenter={{
              lat: 55.8642,
              lng: -4.2518
            }}
            // onClick={(t, map, c) => this.onMapClick(c.latLng, map)}
            onClick={this.onMapClick}
          >

            {/* <Marker onClick={this.onMarkerClick}
                    name={'Current location'} /> */}
            {/* <Marker onClick={(t, map, c) => this.markerClick(c.latLng, map)} */}
            <Marker onClick={this.onMarkerClick}
                    name={this.state.marker.name}
                    position={this.state.marker.position} />

            <Marker onClick={this.onMarkerClick}
              position={this.state.fields.location} />

            <InfoWindow 
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
              onClose={this.onClose}>
                <div>
                  {/* <h1>{this.state.selectedPlace.name}</h1> */}
                  <Range
                    step={0.1}
                    min={0}
                    max={100}
                    values={this.state.values}
                    onChange={values => this.setState({ values })}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: '6px',
                          width: '300px',
                          backgroundColor: '#ccc'
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: '42px',
                          width: '42px',
                          backgroundColor: '#999'
                        }}
                      />
                    )}
                  />
                </div>
            </InfoWindow>
         </Map>
         </div>
         
         <div>
         
       </div>
       </div>
    );
  }
}


const MAPS_KEY = process.env.REACT_APP_MAPS_API_KEY
export default GoogleApiWrapper({
    apiKey: MAPS_KEY
})(MapContainer);