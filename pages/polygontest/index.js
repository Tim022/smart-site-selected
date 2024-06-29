
import React, { useState, useEffect } from 'react'
import { GoogleMap, useLoadScript, PolygonF,PolylineF } from '@react-google-maps/api'
import axios from 'axios';
import { SearchControl } from '@/components/Search/search'
import styles from '@/pages/polygontest/styles.module.css'

const mapOptions = {
  disableDefaultUI: true,
  // restriction: {
  //   latLngBounds: {
  //     north: 25.5,
  //     south: 21.5,
  //     west: 118,
  //     east: 122,
  //   },
  //   strictBounds: false,
  // },
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

const center = {
  lat: 23.614090,
  lng: 120.861217
};

export default function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyC_Djjbddb_8D1SdiuU40ysEpRhaJo9NHs",
    libraries: ["visualization", "drawing"],
  })
  let mapInstance;

  const [polygons, setPolygons] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [isDrawed, setIsDrawed] = useState(true);
  const [zoom, setZoom] = useState(8);
  useEffect(() => {
    if (zoom == 8 || zoom > 10) {

      if (zoom == 8) {
        // setIsDrawed(false)
      }

      if (zoom > 10) {
        setTimeout(() => {
          setIsDrawed(false)
        }, 2000);
      }

      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:3000/taiwan_district_boundaries.geojson'); // 市區
          // const response = await axios.get('http://localhost:3000/taiwan_village_boundaries.geojson'); // 村里

          const geoJsonData = response.data;
          // console.log(geoJsonData)

          // Extract polygons from GeoJSON data
          const fetchedPolygons = geoJsonData.features.map(feature => ({
            paths: feature.geometry.coordinates[0].map(coord => coord.map(latlon => ({ lat: latlon[1], lng: latlon[0] }))),
            options: {
              strokeColor: '#E5FFF580',
              fillColor: '#52CCCCB2',
              // strokeOpacity: 0.8,
              strokeWeight: 1,
              // fillOpacity: 0.35,
            },
          }));

          // console.log(fetchedPolygons)
          setPolygons(fetchedPolygons);

          const responseL = await axios.get('http://localhost:3000/taiwan_road.geojson'); // Replace with your GeoJSON URL
          const geoJsonDataL = responseL.data;
          // console.log(geoJsonDataL)

          // Extract polylines from GeoJSON data
          const fetchedPolylines = geoJsonDataL.features.map(feature => ({
            paths: feature.geometry.coordinates[0].map(latlon => ({ lat: latlon[1], lng: latlon[0] })),
            options: {
              strokeColor: '#FF0000', // 線條顏色
              strokeOpacity: 1.0,
              strokeWeight: 2
            },
          }));

          // console.log(fetchedPolylines)
          setPolylines(fetchedPolylines);
          setTimeout(() => {
            setIsDrawed(true)
          }, 1000);
        } catch (error) {
          console.error('Error fetching GeoJSON:', error);
        }
      };
      fetchData();
    }

  }, [zoom]);

  const handleMapClick = (event) => {
    console.log('Map clicked at:', {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleMapZoomChanged = () => {
    console.log(google.maps)
    //取得放大等級
    const mapZoomLevel = mapInstance?.getZoom();
    setZoom(mapZoomLevel);
    console.log('Map zoom level changed:', mapZoomLevel);

    //取得中心經緯度與邊緣距離
    const mapCenter = mapInstance?.getCenter();
    const centerlat = mapCenter.lat();
    const centerlng = mapCenter.lng();
    const mapBounds = mapInstance?.getBounds();
    const ne = mapBounds.getNorthEast(); // Northeast corner of the map
    const sw = mapBounds.getSouthWest(); // Southwest corner of the map

    const distanceLat = google.maps.geometry?.spherical.computeDistanceBetween(ne, sw) / 1000;
    const distanceLng = google.maps.geometry?.spherical.computeDistanceBetween(ne, { lat: sw.lat(), lng: ne.lng() }) / 1000;

    // Calculate distance in kilometers

    console.log('Center is:', { "lat": centerlat, "lng": centerlng });
    console.log('Distance in kilometers (latitude):', distanceLat);
    console.log('Distance in kilometers (longitude):', distanceLng);
  };

  const handleLoad = (map) => {
    mapInstance = map;
    mapInstance.addListener('zoom_changed', handleMapZoomChanged);
    mapInstance.addListener('dragend', handleMapZoomChanged);
    // idle：當地圖進入空閒狀態時觸發。這表示地圖不再移動（包括平移和縮放）。
    // bounds_changed：當地圖的邊界框（範圍）發生變化時觸發。這可能是由於地圖的縮放或平移而導致的邊界框變化。
    // center_changed：當地圖的中心點位置發生變化時觸發。這表示地圖的中心點坐標已更新。
    // click：當用戶在地圖上點擊時觸發。事件對象包含點擊的位置信息（經緯度）。
    // dblclick：當用戶在地圖上進行雙擊時觸發。事件對象也包含雙擊位置的信息。
    // drag：當用戶在地圖上拖動時觸發。這可能是拖動地圖本身，或拖動地圖上的某些元素（如標記）。
    // dragend：當拖動操作結束時觸發。事件對象包含拖動結束時的位置信息。
    // dragstart：當開始進行拖動操作時觸發。事件對象包含開始拖動時的位置信息。
    // mousemove：當用戶在地圖上移動滑鼠指針時觸發。事件對象包含滑鼠指針當前位置的經緯度。
    // mouseout：當滑鼠指針移出地圖時觸發。
    // mouseover：當滑鼠指針移入地圖時觸發。
  };

  const handleSubmit = () => {

  }

  return isLoaded ? (
    <div className={styles.mapContainer}>
      {!isDrawed ? (
        <div className={styles.mapLoadingMask}>
          <div className={styles.mapLoadingSpinner}></div>
          <p>Loading...</p>
        </div>
      ) : null}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={8}
        // onLoad={onLoad}
        options={mapOptions}
        onLoad={handleLoad}
        onClick={handleMapClick}
      // onUnmount={onUnmount}
      >
        {polygons.map((polygon, index) => (
          <PolygonF
            onClick={handleMapClick}
            key={index}
            paths={polygon.paths}
            options={polygon.options}
          />
        ))}
        {polylines.map((polyline, index) => (
          <PolylineF
            key={index}
            path={polyline.paths}
            options={polyline.options}
          />
        ))}

        <SearchControl
          onSubmit={handleSubmit}
        />
      </GoogleMap>
    </div>
  ) : (
    <div className={styles.mapLoadingContainer}>
      <div className={styles.mapLoadingSpinner}></div>
      <p>Loading...</p>
    </div>
  )
}