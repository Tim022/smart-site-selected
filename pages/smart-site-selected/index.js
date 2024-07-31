
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { GoogleMap, useLoadScript, PolygonF, PolylineF, RectangleF, MarkerF, OverlayView, OverlayViewF, CircleF } from '@react-google-maps/api'
import axios from 'axios'
import { AddressSearch } from '@/components/Search/search'
import { CENTER, SCALE_WIDTH, SCALE_VALUES, MAP_STYLES, MASK_POLYGON_PATH } from '@/constant/constant'
import { PolygonLabel } from '@/components/OverlayViews/overlayviews'
import { TitanIcon, PolygonIcon, PlusIcon, MinusIcon } from '@/components/Icons/icons'
import styles from './styles.module.css'
import { Button, Row, Col } from 'antd/lib'

const libraries = ['visualization', 'drawing', 'places'];  //要寫出來不然會報效能問題

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
  styles: MAP_STYLES
};

export default function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyA4mKpPVdsY-bsyJDkBuOAVYL8uUGPD5Qs',
    libraries: libraries,
  })
  let mapInstance;

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(CENTER);

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

    window.addEventListener('resize', handleNavigation);

    return () => {

      window.removeEventListener('resize', handleNavigation);
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

  const getPolygonOptions = (administrativeAreaLevel, index) => {
    let fillColor;
    let strokeColor;

    if (administrativeAreaLevel == "鄉鎮地區") {
      if (!hoveredPolygon) {
        fillColor = '#52CCCCB2';
        strokeColor = '#E5FFF580';
      } else {
        fillColor = hoveredPolygon === index ? '#E4FFBFCC' : '#52CCCC4D';
        strokeColor = hoveredPolygon === index ? '#FFFFFF' : '#E5FFF580';
      }
    } else if (administrativeAreaLevel == "村里") {
      if (!hoveredPolygon) {
        fillColor = '#9AD3CD';
        strokeColor = '#439999';
      } else {
        fillColor = hoveredPolygon === index ? '#E4FFBFCC' : '#9AD3CD';
        strokeColor = hoveredPolygon === index ? '#FFFFFF' : '#439999';
      }
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

  const onPolygonClick = (map, polygon) => {
    console.log('Map clicked at:', {
      lat: map.latLng.lat(),
      lng: map.latLng.lng(),
    });

    console.log('Polygon Clicked:', polygon);
    setAddressSearchString(polygon.fulladdress)
  };

  const handleMapClick = (event) => {
    console.log('Map clicked at:', {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    // console.log(event?.getOptions())
    // const geocoder = new google.maps.Geocoder();
    // geocoder.geocode({ location: { lat: event.latLng.lat(), lng: event.latLng.lng() }, language: 'zh-TW' }, (results, status) => {
    //   if (status === 'OK') {
    //     if (results[0]) {
    //       console.log(results[0])
    //       let city, town;
    //       if (type == '鄉鎮地區') {
    //         for (let i = 0; i < results[0].address_components.length; i++) {
    //           const component = results[0].address_components[i];
    //           if (component.types.includes('administrative_area_level_1')) {
    //             city = component.long_name;
    //           }
    //           if (component.types.includes('administrative_area_level_2')) {
    //             town = component.long_name;
    //           }
    //         }
    //       }

    //       //administrative_area_level_1 縣市
    //       //administrative_area_level_2 鄉鎮地區
    //       //administrative_area_level_3 村里

    //       const address = `${city}${town}`;
    //       console.log(address);
    //       setAddressSearchString(address);
    //     } else {
    //       console.log('No results found');
    //     }
    //   } else {
    //     console.log('Geocoder failed due to: ' + status);
    //   }
    // });
  };

  const getPolygonCenter = (paths) => {
    if (paths) {
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
    }
  };

  const [polygonFetchUrl, setPolygonFetchUrl] = useState('http://localhost:3000/TOWN_MOI_1120825_1.json');
  useEffect(() => {
    setIsDrawed(false)
  }, [polygonFetchUrl]);

  // 計算兩點之間的距離（單位：公尺）
  const getDistanceBetweenPoints = (p1, p2) => {
    const R = 6371000; // 地球半徑（公尺）
    const dLat = (p2.lat - p1.lat) * (Math.PI / 180);
    const dLng = (p2.lng - p1.lng) * (Math.PI / 180);
    const lat1 = p1.lat * (Math.PI / 180);
    const lat2 = p2.lat * (Math.PI / 180);

    const a = Math.sin(dLat / 2) ** 2 +
      Math.sin(dLng / 2) ** 2 *
      Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // 合併兩個圓形
  const mergeCircles = (circles) => {
    const merged = [];

    for (let i = 0; i < circles.length; i++) {
      let merge = false;
      for (let j = i + 1; j < circles.length; j++) {
        const dist = getDistanceBetweenPoints(circles[i].position, circles[j].position);
        if (dist < circles[i].radius + circles[j].radius) {
          merge = true;
          const newPosition = {
            lat: (circles[i].position.lat + circles[j].position.lat) / 2,
            lng: (circles[i].position.lng + circles[j].position.lng) / 2,
          };
          const newRadius = circles[i].radius + circles[j].radius;
          circles[i] = { position: newPosition, radius: newRadius, options: circles[i].options };
          circles.splice(j, 1);
          j--;
        }
        console.log(circles);
      }
      if (!merge) {
        merged.push(circles[i]);
      }
    }

    return circles;
  };

  // 產生圓形
  const [circles, setCircles] = useState([]);

  const draw = () => {
    const mapZoomLevel = mapInstance?.getZoom();
    setZoom(mapZoomLevel);

    let administrativeAreaLevel;
    // let polygonFetchUrl = 'http://localhost:3000/taiwan_district_boundaries.geojson'
    let polygonFetchUrl = 'http://localhost:3000/TOWN_MOI_1120825_1.json'
    if (mapZoomLevel >= 8 && mapZoomLevel < 14) {
      administrativeAreaLevel = "鄉鎮地區";
      // polygonFetchUrl = 'http://localhost:3000/taiwan_district_boundaries.geojson'
      polygonFetchUrl = 'http://localhost:3000/TOWN_MOI_1120825_1.json'
      setPolygonFetchUrl('http://localhost:3000/TOWN_MOI_1120825_1.json');
    }

    if (mapZoomLevel >= 14) {
      administrativeAreaLevel = "村里";
      // polygonFetchUrl = 'http://localhost:3000/taiwan_village_boundaries.geojson'
      polygonFetchUrl = 'http://localhost:3000/VILLAGE_NLSC_1130419_1.json'
      setPolygonFetchUrl('http://localhost:3000/VILLAGE_NLSC_1130419_1.json');
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(polygonFetchUrl); // 市區

        const geoJsonData = response.data;
        // console.log(geoJsonData)

        // Extract polygons from GeoJSON data
        const fetchedPolygons = geoJsonData.features.map((feature, index) => {
          let paths, fulladdress, label;

          if (administrativeAreaLevel == "鄉鎮地區") {
            fulladdress = feature.properties.COUNTYNAME + feature.properties.TOWNNAME;
            label = feature.properties.TOWNNAME;
          } else if (administrativeAreaLevel == "村里") {
            fulladdress = feature.properties.COUNTYNAME + feature.properties.TOWNNAME + feature.properties.VILLNAME;
            label = feature.properties.VILLNAME;
          }
          if (feature.geometry?.type == 'Polygon') {
            paths = feature.geometry?.coordinates.map((value, index) => {
              return value.map(latlng => ({ lat: latlng[1], lng: latlng[0] }))
            });
          } else if (feature.geometry?.type == 'MultiPolygon') {
            paths = feature.geometry?.coordinates.map((value, index) => {
              return value[0].map(latlng => ({ lat: latlng[1], lng: latlng[0] }))
            });
          }
          let result = {
            paths: paths,
            fulladdress: fulladdress,
            label: label,
            administrativeAreaLevel: administrativeAreaLevel
            // options: {
            //   strokeColor: '#E5FFF580',
            //   fillColor: '#52CCCCB2',
            //   strokeOpacity: 0.8,
            //   strokeWeight: 1,
            //   fillOpacity: 0.35,
            // },
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
        setIsDrawed(true)
      } catch (error) {
        console.error('Error fetching GeoJSON:', error);
      }
    };
    fetchData();

    //畫出、合併重疊的圓
    let newCircles = [];
    if (mapZoomLevel == 8) {
      newCircles = [
        {
          position: { lat: 25.183693066572452, lng: 121.43070597812499 },
          radius: 5400,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        },
        {
          position: { lat: 25.099813326574992, lng: 121.31162744687498 },
          radius: 10000,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        },
        {
          position: { lat: 25.02540812662252, lng: 121.45957110757337 },
          radius: 8000,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        },
        {
          position: { lat: 24.230891764611854, lng: 121.47331891874995 },
          radius: 5000,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        },
        {
          position: { lat: 24.561534547003482, lng: 121.0151493446274 },
          radius: 5000,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        }
      ];
    } else if (mapZoomLevel == 9) {
      newCircles = [
        {
          position: { lat: 25.183693066572452, lng: 121.43070597812499 },
          radius: 4400,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        },
        {
          position: { lat: 25.099813326574992, lng: 121.31162744687498 },
          radius: 9000,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        },
        {
          position: { lat: 25.02540812662252, lng: 121.45957110757337 },
          radius: 7000,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        },
        {
          position: { lat: 24.230891764611854, lng: 121.47331891874995 },
          radius: 5000,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        },
        {
          position: { lat: 24.561534547003482, lng: 121.0151493446274 },
          radius: 5000,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        }
      ];
    } else if (mapZoomLevel == 10) {
      newCircles = [
        {
          position: { lat: 25.183693066572452, lng: 121.43070597812499 },
          radius: 3400,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        },
        {
          position: { lat: 25.099813326574992, lng: 121.31162744687498 },
          radius: 8000,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        },
        {
          position: { lat: 25.02540812662252, lng: 121.45957110757337 },
          radius: 6000,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        },
        {
          position: { lat: 24.230891764611854, lng: 121.47331891874995 },
          radius: 5000,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        },
        {
          position: { lat: 24.561534547003482, lng: 121.0151493446274 },
          radius: 5000,
          options: {
            fillColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`,
            fillOpacity: 0.35,
            strokeColor: 'white',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }
        }
      ];
    }


    setCircles(mergeCircles(newCircles));
  }

  const handleMapBoundsChanged = () => {
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

    console.log('Center is:', { 'lat': centerlat, 'lng': centerlng });
    console.log('Distance in kilometers (latitude):', distanceLat);
    console.log('Distance in kilometers (longitude):', distanceLng);
  };
  const makeScale = () => {
    let zoom = mapInstance?.getZoom();

    // Calculate the width of 1 map pixel in meters
    // Based on latitude and zoom level
    // See https://groups.google.com/d/msg/google-maps-js-api-v3/hDRO4oHVSeM/osOYQYXg2oUJ
    let scale = 156543.03392 * Math.cos(mapInstance?.getCenter().lat() * Math.PI / 180) / Math.pow(2, zoom);

    let minScale = Math.floor(scale * SCALE_WIDTH.min);
    let maxScale = Math.ceil(scale * SCALE_WIDTH.max);
    // console.log(SCALE_VALUES)
    // Loop through scale values
    for (let i = 0; i < SCALE_VALUES.length; i++) {

      if (i !== SCALE_VALUES.length - 1) {

        // Select appropriate scale value
        if (((minScale <= SCALE_VALUES[i].val) && (SCALE_VALUES[i].val <= maxScale)) || ((minScale > SCALE_VALUES[i].val) && (maxScale) < SCALE_VALUES[i + 1].val)) {

          // Found appropriate scale value
          // Set scale width and value
          setScaleValues(scale, SCALE_VALUES[i]);

          // Break for loop
          break;
        }

      } else {

        // Reached the end of the values array
        // Found no match so far
        // Use array last value anyway

        // Set scale width and value

        setScaleValues(scale, SCALE_VALUES[i]);
      }
    }
  }
  const handleLoad = (map) => {
    mapInstance = map;
    setMap(mapInstance)
    draw();
    mapInstance.addListener('zoom_changed', draw);
    mapInstance.addListener('idle', handleMapBoundsChanged);
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

  const [addressSearchString, setAddressSearchString] = useState('');
  const [searchByClickArea, setSearchByClickArea] = useState(false);
  const [searchResult, setSearchResult] = useState();
  const handleSubmit = (value) => {
    if (!value.addressfullname) {
      setAddressSearchString('');
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
          console.log('viewport', viewport)
          console.log('map', map)

          // 計算忽略區域的寬度，假設右側忽略 432px
          const ignoredWidthPx = 432;
          const projection = map.getProjection();
          const boundsNE = projection.fromLatLngToPoint(viewport.getNorthEast());
          const boundsSW = projection.fromLatLngToPoint(viewport.getSouthWest());
          const mapWidthPx = map.getDiv().offsetWidth;
          const adjustmentFactor = ignoredWidthPx / mapWidthPx;

          // 調整左側邊界
          const adjustedBoundsSW = new google.maps.Point(
            boundsSW.x - adjustmentFactor * (boundsNE.x - boundsSW.x),
            boundsSW.y
          );
          const adjustedBoundsNE = new google.maps.Point(
            boundsNE.x - adjustmentFactor * (boundsNE.x - boundsSW.x),
            boundsNE.y
          );

          // 將調整後的邊界轉換回 LatLng
          const newBoundsSW = projection.fromPointToLatLng(adjustedBoundsSW);
          const newBoundsNE = projection.fromPointToLatLng(adjustedBoundsNE);

          // 更新地圖的邊界
          const newBounds = new google.maps.LatLngBounds(newBoundsSW, newBoundsNE);
          map.fitBounds(newBounds);
          setSearchByClickArea(true)

          // map.fitBounds(viewport);
          setZoom(map.getZoom());
          // setCenter({
          //   lat: lat(),
          //   lng: lng()
          // })
          // setZoom(15)
        }
      });

      // // place API 測試
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

  return (<>
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
                  <div id='scale-value' className={styles.scaleValue}></div>
                  <PolygonIcon color='#FFFFFF' innerStyle={{ position: 'relative', left: '2px' }} />
                  <div id='scale-bar' className={styles.scaleBar}></div>
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
          {/* 其他國家遮罩 */}
          <PolygonF
            paths={MASK_POLYGON_PATH}
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
          {circles.map((circle, index) => (
            <CircleF
              key={index}
              center={circle.position}
              radius={circle.radius}
              options={circle.options}
            />
          ))}
          {/* 行政區多邊形 */}
          {polygons.map((polygon, index) => {
            if (polygon.paths) {
              return (
                <PolygonF
                  onClick={(e) => onPolygonClick(e, polygon)}
                  key={index}
                  paths={polygon.paths}
                  options={getPolygonOptions(polygon.administrativeAreaLevel, index)}
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseOut={handleMouseOut}
                />
              )
            }
          })}
          {/* 行政區多邊形 label */}
          {/* {polygons.map((polygon, index) => {
            if (polygon.paths) {
              const pcenter = getPolygonCenter(polygon.paths);
              // console.log(pcenter)

              if (pcenter && showWaterMark) {
                return (
                  <PolygonLabel
                    key={index}
                    position={pcenter}
                    text={polygon.label}
                  />
                )
              }
            }
          })} */}
          {/* 線段 */}
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
            searchByClickArea={searchByClickArea}
            setSearchByClickArea={setSearchByClickArea}
            searchResult={searchResult}
            setSearchResult={setSearchResult}
          />
        </GoogleMap>
      </div>) : null}
  </>)
}