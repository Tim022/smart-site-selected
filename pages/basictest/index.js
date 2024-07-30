import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
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
    lat: 23.614090,
    lng: 120.861217
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC_Djjbddb_8D1SdiuU40ysEpRhaJo9NHs'
  })

  const [map, setMap] = React.useState(null)

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])


  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={8}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      { /* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : <></>
}