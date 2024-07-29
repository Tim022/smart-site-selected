
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { GoogleMap, useLoadScript, PolygonF, PolylineF, RectangleF, MarkerF } from '@react-google-maps/api'
import axios from 'axios';
import { AddressSearch } from '@/components/Search/search'
import { PolygonLabel } from '@/components/OverlayViews/overlayviews'
import { TitanIcon, PolygonIcon, PlusIcon, MinusIcon } from '@/components/Icons/icons'
import styles from './styles.module.css'
import { Button, Row, Col } from 'antd/lib'

const libraries = ["visualization", "drawing", "places"];  //要寫出來不然會報效能問題

const minScaleWidth = 50;
const maxScaleWidth = 80;
const scaleValues = [{
  val: 2,
  dspVal: '2 公尺'
}, {
  val: 5,
  dspVal: '5 公尺'
},
{
  val: 10,
  dspVal: '10 公尺'
},
{
  val: 20,
  dspVal: '20 公尺'
},
{
  val: 50,
  dspVal: '50 公尺'
},
{
  val: 100,
  dspVal: '100 公尺'
},
{
  val: 200,
  dspVal: '200 公尺'
},
{
  val: 500,
  dspVal: '500 公尺'
},
{
  val: 1000,
  dspVal: '1 公里'
},
{
  val: 2000,
  dspVal: '2 公里'
},
{
  val: 5000,
  dspVal: '5 公里'
},
{
  val: 10000,
  dspVal: '10 公里'
},
{
  val: 20000,
  dspVal: '20 公里'
},
{
  val: 50000,
  dspVal: '50 公里'
},
{
  val: 100000,
  dspVal: '100 公里'
},
{
  val: 200000,
  dspVal: '200 公里'
},
{
  val: 500000,
  dspVal: '500 公里'
},
{
  val: 1000000,
  dspVal: '1000 公里'
},
{
  val: 2000000,
  dspVal: '2000 公里'
},
{
  val: 5000000,
  dspVal: '5000 公里'
}
];

const setScaleValues = (scale, values) => {
  let scaleWidth = values.val / scale;
  // console.log(scaleWidth)
  // console.log(values.dspVal)
  // Set scale HTML elements width and display value
  document.getElementById('scale-bar').style.width = scaleWidth + 'px';
  document.getElementById('scale-value').innerHTML = values.dspVal;
}

const mapOptions = {
  disableDefaultUI: true,
  // restriction: {
  //   latLngBounds: {
  //     north: 26.8,
  //     south: 20.5,
  //     west: 119,
  //     east: 122,
  //   },
  //   strictBounds: false,
  // },
  // minZoom: 8,
  // scaleControl: true,
  // zoomControl: true,
  styles: [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2B2F33"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#2B2F33"
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
    { //隱藏預設的行政區名稱
      "featureType": "administrative",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
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
          "color": "#2B2F33"
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
          "color": "#2B2F33"
        }
      ]
    }
  ]
};

// const containerStyle = {
//   width: '1519px',
//   height: '738px'
// };

export default function App() {
  // const [seconds, setSeconds] = useState(0);
  // const [isActive, setIsActive] = useState(true);
  // useEffect(() => {
  //   let interval = null;

  //   if (isActive) {
  //     interval = setInterval(() => {
  //       setSeconds(prevSeconds => prevSeconds + 1);
  //     }, 1000); // 每秒更新一次秒数

  //   } else if (!isActive && seconds !== 0) {
  //     clearInterval(interval);
  //   }

  //   return () => clearInterval(interval);
  // }, [isActive, seconds]);


  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyA4mKpPVdsY-bsyJDkBuOAVYL8uUGPD5Qs",
    libraries: libraries,
  })
  let mapInstance;

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({
    lat: 23.614090,
    lng: 120.861217
  })
  // const center = {
  //   lat: 23.614090,
  //   lng: 120.861217
  // };

  const [winWidth, setwinWidth] = useState();
  const [winHeight, setwinHeight] = useState();
  const handleNavigation = useCallback(
    (e) => {
      setwinWidth(window.innerWidth);
      setwinHeight(window.innerHeight);
    },
    [winHeight]
  );

  //取得當前螢幕長寬
  useEffect(() => {
    setwinWidth(window.innerWidth);
    setwinHeight(window.innerHeight);

    window.addEventListener("resize", handleNavigation);

    return () => {

      window.removeEventListener("resize", handleNavigation);
    };

  }, [handleNavigation]);

  const [polygons, setPolygons] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [isDrawed, setIsDrawed] = useState(true);
  const [zoom, setZoom] = useState(8);
  //初始放大級數、國道：8 (比例尺20公里)
  //鄉鎮市區、省道、快速道路：10(比例尺10公里)
  //村里、所有POI：14(比例尺500公尺)

  const zoomOut = () => {
    setZoom(zoom - 1);
  }
  const zoomIn = () => {
    setZoom(zoom + 1);
  }

  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const handleMouseOver = useCallback((index) => {
    setHoveredPolygon(index);
  }, []);

  const handleMouseOut = useCallback(() => {
    setHoveredPolygon(null);
  }, []);

  const getPolygonOptions = (index) => {
    let fillColor;
    let strokeColor;
    if (!hoveredPolygon) {
      fillColor = '#52CCCCB2';
      strokeColor = '#E5FFF580';
    } else {
      fillColor = hoveredPolygon === index ? '#E4FFBFCC' : '#52CCCC4D';
      strokeColor = hoveredPolygon === index ? '#FFFFFF' : '#E5FFF580';
    }
    let option = {
      fillColor: fillColor,
      // fillOpacity: 0.6,
      strokeColor: strokeColor,
      // strokeOpacity: 1,
      strokeWeight: 1
    }
    return option;
  };

  const handleMapClick = (event, type) => {
    console.log('Map clicked at:', {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat: event.latLng.lat(), lng: event.latLng.lng() }, language: 'zh-TW' }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results[0])
          let city, town;
          if (type == "鄉鎮地區") {
            for (let i = 0; i < results[0].address_components.length; i++) {
              const component = results[0].address_components[i];
              if (component.types.includes('administrative_area_level_1')) {
                city = component.long_name;
              }
              if (component.types.includes('administrative_area_level_2')) {
                town = component.long_name;
              }
            }
          }

          //administrative_area_level_1 縣市
          //administrative_area_level_2 鄉鎮地區
          //administrative_area_level_3 村里

          const address = `${city}${town}`;
          console.log(address);
          setAddressSearchString(address);
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  };

  const getPolygonCenter = (paths) => {
    let latSum = 0;
    let lngSum = 0;
    const n = paths[0].length;

    paths[0].forEach((point) => {
      latSum += point.lat;
      lngSum += point.lng;
    });

    return {
      lat: latSum / n,
      lng: lngSum / n,
    };

  };

  const draw = () => {
    const mapZoomLevel = mapInstance?.getZoom();
    setZoom(mapZoomLevel);
    // let polygonFetchUrl = "http://localhost:3000/taiwan_district_boundaries.geojson"
    let polygonFetchUrl = "http://localhost:3000/TOWN_MOI_1120825_1.json"
    if (mapZoomLevel == 8 || mapZoomLevel > 10) {

      if (mapZoomLevel == 8) {
        // polygonFetchUrl = "http://localhost:3000/taiwan_district_boundaries.geojson"
        polygonFetchUrl = "http://localhost:3000/TOWN_MOI_1120825_1.json"
        setIsDrawed(false)
      }

      if (mapZoomLevel > 10) {
        // polygonFetchUrl = "http://localhost:3000/taiwan_village_boundaries.geojson"
        // polygonFetchUrl = "http://localhost:3000/VILLAGE_NLSC_1130419_1.json"
        // setTimeout(() => {
        // setSeconds(0)
        // setIsActive(true)
        // setIsDrawed(false)
        // }, 1500);
      }

      const fetchData = async () => {
        try {
          const response = await axios.get(polygonFetchUrl); // 市區

          const geoJsonData = response.data;
          // console.log(geoJsonData)

          // Extract polygons from GeoJSON data
          const fetchedPolygons = geoJsonData.features.map((feature, index) => {
            let paths;
            // let label = feature.properties.COUNTYNAME;TOWNNAME
            let label = feature.properties.TOWNNAME;
            if (feature.geometry?.type == "Polygon") {
              paths = feature.geometry?.coordinates.map((value, index) => {
                return value.map(latlng => ({ lat: latlng[1], lng: latlng[0] }))
              });
            } else if (feature.geometry?.type == "MultiPolygon") {
              paths = feature.geometry?.coordinates.map((value, index) => {
                return value[0].map(latlng => ({ lat: latlng[1], lng: latlng[0] }))
              });
            }
            let result = {
              paths: paths,
              label: label,
              options: {
                strokeColor: '#E5FFF580',
                fillColor: '#52CCCCB2',
                // strokeOpacity: 0.8,
                strokeWeight: 1,
                // fillOpacity: 0.35,
              },
            }

            return result
          });

          // console.log(fetchedPolygons)
          setPolygons(fetchedPolygons);

          // const responseL = await axios.get('http://localhost:3000/taiwan_road.geojson'); // Replace with your GeoJSON URL
          const responseL = await axios.get('http://localhost:3000/simpify_road.json');
          const geoJsonDataL = responseL.data;
          // console.log(geoJsonDataL)

          // Extract polylines from GeoJSON data
          const fetchedPolylines = geoJsonDataL.features.map(feature => ({
            paths: feature.geometry.coordinates.map(latlon => ({ lat: latlon[1], lng: latlon[0] })),
            options: {
              strokeColor: '#E9FE03', // 線條顏色
              strokeOpacity: 1.0,
              strokeWeight: 2
            },
          }));

          // console.log(fetchedPolylines)
          setPolylines(fetchedPolylines);
          setTimeout(() => {
            setIsDrawed(true)
            // setIsActive(false)
          }, 1000);
        } catch (error) {
          console.error('Error fetching GeoJSON:', error);
        }
      };
      fetchData();
    }
  }

  const handleMapZoomChanged = () => {
    console.log(google.maps)
    // console.log(map)
    //取得放大等級
    const mapZoomLevel = mapInstance?.getZoom();
    // setZoom(mapZoomLevel);
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
  const makeScale = () => {
    let zoom = mapInstance?.getZoom();

    // Calculate the width of 1 map pixel in meters
    // Based on latitude and zoom level
    // See https://groups.google.com/d/msg/google-maps-js-api-v3/hDRO4oHVSeM/osOYQYXg2oUJ
    let scale = 156543.03392 * Math.cos(mapInstance?.getCenter().lat() * Math.PI / 180) / Math.pow(2, zoom);

    let minScale = Math.floor(scale * minScaleWidth);
    let maxScale = Math.ceil(scale * maxScaleWidth);
    // console.log(scaleValues)
    // Loop through scale values
    for (let i = 0; i < scaleValues.length; i++) {

      if (i !== scaleValues.length - 1) {

        // Select appropriate scale value
        if (((minScale <= scaleValues[i].val) && (scaleValues[i].val <= maxScale)) || ((minScale > scaleValues[i].val) && (maxScale) < scaleValues[i + 1].val)) {

          // Found appropriate scale value
          // Set scale width and value
          setScaleValues(scale, scaleValues[i]);

          // Break for loop
          break;
        }

      } else {

        // Reached the end of the values array
        // Found no match so far
        // Use array last value anyway

        // Set scale width and value

        setScaleValues(scale, scaleValues[i]);
      }
    }
  }
  const handleLoad = (map) => {
    mapInstance = map;
    setMap(mapInstance)
    draw();
    mapInstance.addListener('zoom_changed', draw);
    mapInstance.addListener('idle', handleMapZoomChanged);
    mapInstance.addListener('idle', makeScale);

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

  const [addressSearchString, setAddressSearchString] = useState("");

  const handleSubmit = (value) => {
    if (!value.addressfullname) {
      setAddressSearchString("");
    } else {
      setAddressSearchString(value.addressfullname);
    }
  }

  const [places, setPlaces] = useState([]);
  useEffect(() => {
    if (map) {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address: addressSearchString }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          const viewport = results[0].geometry.viewport;
          console.log(viewport)
          console.log(map)
          map.fitBounds(viewport);
          setZoom(map.getZoom());
          // setCenter({
          //   lat: lat(),
          //   lng: lng()
          // })
          // setZoom(15)
        } else {
        }
      });

      //   const service = new google.maps.places.PlacesService(map);
      //   service.nearbySearch({
      //     location: map.getCenter(),
      //     radius: 5000,
      //     type: 'restaurant'
      //   }, (results, status, pagination) => {
      //     if (status === google.maps.places.PlacesServiceStatus.OK) {
      //       setPlaces(results);
      //     }
      //   });
    }
  }, [addressSearchString]);

  const generateRandomPOI = () => {
    const poiLocations = [];
    const numPOI = 70;
    const range = 1.0; // 1 度的範圍

    for (let i = 0; i < numPOI; i++) {
      const lat = center.lat + (Math.random() - 0.5) * range;
      const lng = center.lng + (Math.random() - 0.5) * range;
      poiLocations.push({ lat, lng });
    }

    return poiLocations;
  };

  const poiLocations = generateRandomPOI();

  const [showWaterMark, setShowWaterMark] = useState(true);
  const hideWatermark = () => {
    setShowWaterMark(!showWaterMark);
  }

  const maskpolygonpath = [{ "lat": 90, "lng": 0 }, { "lat": 90, "lng": 122.56805640410275 }, { "lat": 26.559603825454303, "lng": 122.56805640410275 }, { "lat": 26.45927358654475, "lng": 120.43692159366769 }, { "lat": 26.305727867423737, "lng": 119.97990251557094 }, { "lat": 26.17392797569266, "lng": 119.87278581635219 }, { "lat": 25.850574225446113, "lng": 119.86454607025844 }, { "lat": 25.58837533199154, "lng": 120.03842572366102 }, { "lat": 25.12564449755215, "lng": 120.0315592685829 }, { "lat": 24.98631019373373, "lng": 119.1766564835979 }, { "lat": 24.42682604943217, "lng": 118.64748207020892 }, { "lat": 24.476830847184466, "lng": 118.51015296864642 }, { "lat": 24.558046273706864, "lng": 118.41264930653705 }, { "lat": 24.543056609454414, "lng": 118.31377235341205 }, { "lat": 24.432165750205392, "lng": 118.18433893035863 }, { "lat": 24.377139898107572, "lng": 118.19120538543676 }, { "lat": 21.628959591583115, "lng": 119.7769037728001 }, { "lat": 21.628959591583115, "lng": 122.56805640410275 }, { "lat": -90, "lng": 122.56805640410275 }, { "lat": -90, "lng": 0 }];
  return (<>
    {/* <div className={styles.counter}>
      <h1 style={{ fontSize: '50px', fontWeight: '700', color: '#FFFFFF' }}>繪製秒數： {seconds + 3}</h1>
    </div> */}
    {showWaterMark ? <div className={styles.watermark}></div> : null}
    <div className={styles.headercontainer}>
      <div className={`${styles.header} ${styles.alignCenterV}`}>
        <TitanIcon innerStyle={{ marginLeft: '32px' }} color='#FFFFFF' />
      </div>
      <div className={styles.headertopline}></div>
      <div className={styles.headerIconRow}>
        <div className={`${styles.headerIcon} ${styles.alignCenterV} ${styles.alignCenterH}`} onClick={hideWatermark}>HD</div>
      </div>
    </div>
    {isLoaded ? (
      <div className={styles.mapContainer}>
        {!isDrawed ? (
          <div className={`${styles.mapLoadingMask} ${styles.alignCenterV} ${styles.alignCenterH}`}>
            <div className={styles.mapLoadingSpinner}></div>
            <p>Loading...</p>
          </div>
        ) : null}
        <GoogleMap
          mapContainerStyle={{
            width: winWidth - 0.5,
            height: winHeight - 0.5
          }}
          center={center}
          zoom={zoom}
          options={mapOptions}
          onLoad={handleLoad}
          onClick={handleMapClick}
        // onUnmount={onUnmount}
        >
          <div className={styles.bottomTools}>
            <Row className={`${styles.bottomToolsRow} ${styles.alignCenterV} ${styles.alignCenterH}`}>
              <div className={styles.gradiantLevelList}>
                <Row>
                  <Col className={styles.gradiantLevelTitle}>
                    <span className={styles.gradiantLevelSpan}>人口、小客車熱力圖示</span>
                  </Col>
                  <Col className={styles.alignCenterV}>
                    <div style={{ border: '0.5px solid #FFFFFF', width: '0px', height: '15px', margin: '0px 8px' }}></div>
                  </Col>
                  <Col>
                    <Row className={styles.alignCenterV}>
                      <span className={styles.gradiantLevelSpan}>少</span>
                      <div className={`${styles.gradiantLevel} ${styles.gradiantLevelColor1}`}></div>
                      <span className={styles.gradiantLevelSpan}>多</span>
                    </Row>
                  </Col>
                </Row>
                <Row >
                  <Col className={styles.gradiantLevelTitle}>
                    <span className={styles.gradiantLevelSpan}>車流量熱力圖示</span>
                  </Col>
                  <Col className={styles.alignCenterV}>
                    <div style={{ border: '0.5px solid #FFFFFF', width: '0px', height: '15px', margin: '0px 8px' }}></div>
                  </Col>
                  <Col>
                    <Row className={styles.alignCenterV}>
                      <span className={styles.gradiantLevelSpan}>少</span>
                      <div className={`${styles.gradiantLevel} ${styles.gradiantLevelColor2}`}></div>
                      <span className={styles.gradiantLevelSpan}>多</span>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Row>
            <Row className={`${styles.bottomToolsRow} ${styles.alignCenterV} ${styles.alignCenterH}`}>
              <div className={styles.alignCenterH} style={{ width: '200px' }}>
                <div className={`${styles.scale} ${styles.alignCenterV}`}>
                  <div id="scale-value" className={styles.scaleValue}></div>
                  <PolygonIcon color='#FFFFFF' innerStyle={{ position: 'relative', left: '2px' }} />
                  <div id="scale-bar" className={styles.scaleBar}></div>
                  <PolygonIcon color='#FFFFFF' innerStyle={{ transform: 'rotate(180deg)', position: 'relative', right: '2px' }} />
                </div>
              </div>

              <div className={`${styles.zoomContainer} ${styles.alignCenterV} ${styles.alignCenterH}`}>
                <Button onClick={zoomOut} className={styles.zoomButton}><MinusIcon color='#FFFFFF' /></Button>
                <div style={{ border: '0.5px solid #A1AAB2', height: '100%', margin: '0px 8px' }}></div>
                <Button onClick={zoomIn} className={styles.zoomButton}><PlusIcon color='#FFFFFF' /></Button>
              </div>
            </Row>

          </div>
          <PolygonF
            paths={maskpolygonpath}
            options={{
              fillColor: '#2B2F33',
              fillOpacity: 1,
              strokeColor: '#2B2F33',
              strokeOpacity: 1,
              strokeWeight: 0,
              cursor: 'grab'
            }}
          />
          <RectangleF
            bounds={{
              north: 90,
              south: -90,
              east: 0,
              west: 122.56805640410275,
            }}
            options={{
              fillColor: '#2B2F33',
              fillOpacity: 1,
              strokeColor: '#2B2F33',
              strokeOpacity: 1,
              strokeWeight: 0,
              cursor: 'grab'
            }}
          />
          {polygons.map((polygon, index) => {
            const pcenter = getPolygonCenter(polygon.paths);
            // console.log(pcenter)
            return (
              <div key={index}>
                <PolygonF
                  onClick={(e) => handleMapClick(e, "鄉鎮地區")}
                  key={index}
                  paths={polygon.paths}
                  options={getPolygonOptions(index)}
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseOut={handleMouseOut}
                />
                {/* <PolygonLabel
                  position={pcenter}
                  text={polygon.label}
                /> */}
              </div>
            )
          })}
          {polylines.map((polyline, index) => (
            <PolylineF
              key={index}
              path={polyline.paths}
              options={polyline.options}
            />
          ))}
          {/* {poiLocations.map((poi, index) => (
          <MarkerF
            key={index}
            position={poi}
          />
        ))} */}
          <AddressSearch
            onSubmit={handleSubmit}
          />
        </GoogleMap>
      </div>) : (
      <div className={`${styles.mapLoadingContainer} ${styles.alignCenterV} ${styles.alignCenterH}`}>
        <div className={styles.mapLoadingSpinner}></div>
        <p>Loading...</p>
      </div>
    )}
  </>)
}