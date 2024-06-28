
import React, { useState } from 'react'
import { GoogleMap, useLoadScript, RectangleF } from '@react-google-maps/api'

const mapOptions = {
  styles: [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#263c3f"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6b9a76"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#1f2835"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#f3d19c"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ]
};

const containerStyle = {
  width: '1519px',
  height: '738px'
};

// const center = {
//   lat: 37.765153,
//   lng: -122.418618
// };

const center = {
  lat: 23.614090,
  lng: 120.861217
};

export default function App() {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyC_Djjbddb_8D1SdiuU40ysEpRhaJo9NHs",
    libraries: ["visualization"],
  })

  const [map, setMap] = useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  if (!isLoaded) {
    return <div>Loading</div>
  }

  const rectangles = [
    {
      id: 1,
      bounds: {
        north: 23.614090,
        south: 23.514090,
        east: 120.861217,
        west: 120.761217,
      },
      color: '#FF0000'
    },
    {
      id: 2,
      bounds: {
        north: 23.514090,
        south: 23.414090,
        east: 120.761217,
        west: 120.661217,
      },
      color: '#00FF00'
    },
    {
      id: 3,
      bounds: {
        north: 23.414090,
        south: 23.314090,
        east: 120.661217,
        west: 120.561217,
      },
      color: '#0000FF'
    },
  ];

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={8}
      // onLoad={onLoad}
      options={mapOptions}
      onUnmount={onUnmount}
    >
      {rectangles.map(rectangle => (
        <RectangleF
          key={rectangle.id}
          bounds={rectangle.bounds}
          options={{
            strokeColor: rectangle.color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: rectangle.color,
            fillOpacity: 0.35,
          }}
        />
      ))}
    </GoogleMap>
  );
}