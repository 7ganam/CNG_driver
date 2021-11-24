
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import map_marker from './map_marker.png'

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class MapComponent extends Component {
    static defaultProps = {
        center: {
            lat: 30.55,
            lng: 30.33
        },
        zoom: 9
    };

    render() {
        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '90%', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyCMHjWCMD7QrzOCGjtI1pib3I1r3V9eqBA', language: 'en' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                >

                    <Marker lat={30.955413} lng={30} />
                    <Marker lat={30.655413} lng={30.1} />
                    <Marker lat={30.555413} lng={30.3} />
                    <Marker lat={30.755413} lng={30.1} />
                    <Marker lat={30} lng={30} />
                    <Marker lat={30.1} lng={29.5} />
                    <Marker lat={30.955413} lng={30.337844} />

                </GoogleMapReact>
            </div>
        );
    }
}

const Marker = props => {
    return <div className="SuperAwesomePin">
        <img style={{ width: '30px', height: 'auto' }} src={map_marker} alt="BigCo Inc. logo" />

    </div>
}

export default MapComponent;