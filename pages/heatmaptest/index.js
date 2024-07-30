
import React, { useState } from 'react'
import { GoogleMap, useLoadScript, HeatmapLayerF } from '@react-google-maps/api'

const mapOptions = {
  styles: [
    {
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#242f3e'
        }
      ]
    },
    {
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'color': '#242f3e'
        }
      ]
    },
    {
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#746855'
        }
      ]
    },
    {
      'featureType': 'administrative.locality',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#d59563'
        }
      ]
    },
    {
      'featureType': 'poi',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#d59563'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#263c3f'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#6b9a76'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#38414e'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#212a37'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#9ca5b3'
        }
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#746855'
        }
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#1f2835'
        }
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#f3d19c'
        }
      ]
    },
    {
      'featureType': 'transit',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#2f3948'
        }
      ]
    },
    {
      'featureType': 'transit.station',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#d59563'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#17263c'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#515c6d'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'color': '#17263c'
        }
      ]
    }
  ]
};

const containerStyle = {
  width: '1519px',
  height: '738px'
};

const center = {
  lat: 37.765153,
  lng: -122.418618
};

// const center = {
//   lat: 23.614090,
//   lng: 120.861217
// };

export default function App() {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyC_Djjbddb_8D1SdiuU40ysEpRhaJo9NHs',
    libraries: ['visualization'],
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

  const heatmapData =
    [
      new window.google.maps.LatLng(37.765153, -122.418618),
      new window.google.maps.LatLng(37.765136, -122.419112),
      new window.google.maps.LatLng(37.765129, -122.419378),
      new window.google.maps.LatLng(37.765119, -122.419481),
      new window.google.maps.LatLng(37.7651, -122.419852),
    ]

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      // onLoad={onLoad}
      options={mapOptions}
      onUnmount={onUnmount}
    >
      <HeatmapLayerF data={heatmapData} />
    </GoogleMap>
  );
}