
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { GoogleMap, useJsApiLoader, PolygonF, PolylineF, RectangleF, MarkerF, OverlayView, OverlayViewF, CircleF } from '@react-google-maps/api'
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
  minZoom: 8,
  styles: MAP_STYLES
};

export default function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
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

    if (administrativeAreaLevel == '縣市') {
      if (!hoveredPolygon) {
        fillColor = '#52CCCCB2';
        strokeColor = '#52CCCCB2';
      } else {
        fillColor = hoveredPolygon === index ? '#E4FFBFCC' : '#52CCCC4D';
        strokeColor = hoveredPolygon === index ? '#FFFFFF' : '#E5FFF580';
      }
    } else if (administrativeAreaLevel == '鄉鎮市區') {
      if (!hoveredPolygon) {
        fillColor = '#66B1C8';
        strokeColor = '#66B1C8';
      } else {
        fillColor = hoveredPolygon === index ? '#DAEBEB' : '#66B1C8';
        strokeColor = hoveredPolygon === index ? '#FFFFFF' : '#439999';
      }
    } else {
      if (!hoveredPolygon) {
        fillColor = '#9AD3CD';
        strokeColor = '#9AD3CD';
      } else {
        fillColor = hoveredPolygon === index ? '#E4FFBFCC' : '#9AD3CD';
        strokeColor = hoveredPolygon === index ? '#FFFFFF' : '#439999';
      }
    }

    let option = {
      fillColor: fillColor,
      // fillOpacity: 0.6,
      strokeColor: strokeColor,
      strokeOpacity: 1,
      strokeWeight: 1
    }
    return option;
  };

  const [highlightPolygon, setHighlightPolygon] = useState([]);
  const [cityGeo, setCityGeo] = useState([]);

  //點擊多邊形區塊
  const onPolygonClick = (mapclick, polygon) => {
    console.log('Map clicked at:', {
      lat: mapclick.latLng.lat(),
      lng: mapclick.latLng.lng(),
    });

    console.log('Polygon Clicked:', polygon);

    const bounds = new window.google.maps.LatLngBounds();

    if (polygon.administrativeAreaLevel == '縣市') {
      bounds.extend({ lat: polygon.bbox[1], lng: polygon.bbox[0] });
      bounds.extend({ lat: polygon.bbox[3], lng: polygon.bbox[2] });
    } else {
      polygon.paths[0].forEach(coord => bounds.extend(coord));
    }

    // 計算忽略區域的寬度，假設右側忽略 432px
    const ignoredWidthPx = 432;
    const projection = map.getProjection();
    const boundsNE = projection.fromLatLngToPoint(bounds.getNorthEast());
    const boundsSW = projection.fromLatLngToPoint(bounds.getSouthWest());
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
    if (polygon.administrativeAreaLevel == '縣市') {
      if (map.getZoom() < 10) {
        map.setZoom(10)
      }
    } else if (polygon.administrativeAreaLevel == '鄉鎮市區') {
      if (map.getZoom() < 14) {
        map.setZoom(14)
      }
    }

    setSearchByClickArea(true)
    setAddressSearchString(polygon.fulladdress)

    const getHighLightArea = async () => {
      try {
        const response = await axios.get(`http://blaze-be.titansiteanalysis.home/api/taiwan/reverse/address/?lat=${mapclick.latLng.lat()}&lon=${mapclick.latLng.lng()}`);
        let highlightData = response.data;

        let geoFetchURL;
        if (polygon.administrativeAreaLevel == '縣市') {
          geoFetchURL = `http://blaze-be.titansiteanalysis.home/api/taiwan/geo/city/${highlightData.city_code}/`;
        } else if (polygon.administrativeAreaLevel == '鄉鎮市區') {
          geoFetchURL = `http://blaze-be.titansiteanalysis.home/api/taiwan/geo/district/${highlightData.district_code}/`;
        } else if (polygon.administrativeAreaLevel == '村里') {
          geoFetchURL = `http://blaze-be.titansiteanalysis.home/api/taiwan/geo/village/${highlightData.village_code}/`;
        }

        try {
          const geoResult = await axios.get(geoFetchURL);
          let highlightGeo = geoResult.data;

          let paths;
          if (highlightGeo.geometry?.type == 'Polygon') {
            paths = highlightGeo.geometry?.coordinates.map((value, index) => {
              return value.map(latlng => ({ lat: latlng[1], lng: latlng[0] }))
            });
          } else if (highlightGeo.geometry?.type == 'MultiPolygon') {
            paths = highlightGeo.geometry?.coordinates.map((value, index) => {
              return value[0].map(latlng => ({ lat: latlng[1], lng: latlng[0] }))
            });
          }
          let polygonResult = [{
            paths: paths,
            options: {
              strokeColor: '#FFFFFF',
              fillColor: '#FFFFFF',
              strokeOpacity: 1,
              strokeWeight: 2,
              fillOpacity: 0,
              clickable: false,
              zIndex: 5
            }
          }]

          if (polygon.administrativeAreaLevel == '縣市') {
            const cityMaskGeo = cityGeo.features.filter(obj => obj.properties.name !== polygon.label);
            let citymaskPaths;
            for (let i = 0; i < cityMaskGeo.length; i++) {
              if (cityMaskGeo[i].geometry.type == 'Polygon') {
                citymaskPaths = cityMaskGeo[i].geometry.coordinates.map((value, index) => {
                  return value.map(latlng => ({ lat: latlng[1], lng: latlng[0] }))
                });
              } else if (cityMaskGeo[i].geometry.type == 'MultiPolygon') {
                citymaskPaths = cityMaskGeo[i].geometry.coordinates.map((value, index) => {
                  return value[0].map(latlng => ({ lat: latlng[1], lng: latlng[0] }))
                });
              }

              polygonResult.push(
                {
                  paths: citymaskPaths,
                  options: {
                    strokeColor: '#000000',
                    fillColor: '#000000',
                    strokeOpacity: 0,
                    strokeWeight: 1,
                    fillOpacity: 0.25,
                    clickable: false,
                    zIndex: 5
                  }
                }
              )
            }
          }

          console.log('HIGHLIGHT target', highlightGeo)
          setHighlightPolygon(polygonResult);

        } catch (error) {
          console.error('Error fetching GeoJSON:', error);
        }
      } catch (error) {
        console.error('Error fetching Area:', error);
      }
    };
    getHighLightArea();
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
    //       if (type == '鄉鎮市區') {
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
    //       //administrative_area_level_2 鄉鎮市區
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

  const [polygonFetchUrl, setPolygonFetchUrl] = useState();

  // 產生圓形
  const [circles, setCircles] = useState([]);
  // 計算兩點之間的距離（地球表面的距離）
  const getDistanceBetweenPoints = (latLng1, latLng2) => {
    const R = 6371000; // 地球半徑，單位：公里
    const dLat = (latLng2.lat - latLng1.lat) * (Math.PI / 180);
    const dLng = (latLng2.lng - latLng1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(latLng1.lat * (Math.PI / 180)) *
      Math.cos(latLng2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 判斷兩圓是否重疊
  const circlesOverlap = (circle1, circle2) => {
    const distance = getDistanceBetweenPoints(circle1.position, circle2.position);
    return distance < (circle1.radius + circle2.radius);
  };

  // 合併圓形的中心和半徑
  const mergeCircles = (circles) => {
    let mergedCenter = { lat: 0, lng: 0 };
    let totalRadius = 0;
    let administrativeAreaLevel;
    let count = 0;

    circles.forEach(circle => {
      mergedCenter.lat += circle.position.lat;
      mergedCenter.lng += circle.position.lng;
      totalRadius += circle.radius;
      administrativeAreaLevel = circle.administrativeAreaLevel;
      if (administrativeAreaLevel == "縣市") {
        if (totalRadius >= 20000) {
          totalRadius = 20000;
        }
      } else if (administrativeAreaLevel == "鄉鎮市區") {
        if (totalRadius >= 10000) {
          totalRadius = 10000;
        }
      }

      count += 1;
    });

    // 計算平均中心點
    mergedCenter.lat /= count;
    mergedCenter.lng /= count;

    return {
      position: mergedCenter,
      radius: totalRadius,
      options: {
        fillColor: '#85A4A0',
        fillOpacity: 0.6,
        strokeColor: '#85A4A0',
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: false,
        zIndex: 10
      },
      administrativeAreaLevel: administrativeAreaLevel
    };
  };

  // 使用圓形數據進行檢測和合併
  const detectAndMergeOverlap = (circles) => {
    const mergedCircles = [];
    const processed = new Array(circles.length).fill(false);

    for (let i = 0; i < circles.length; i++) {
      if (processed[i]) continue;

      const overlappingCircles = [circles[i]];
      processed[i] = true;

      for (let j = i + 1; j < circles.length; j++) {
        if (processed[j]) continue;

        if (circlesOverlap(circles[i], circles[j])) {
          overlappingCircles.push(circles[j]);
          processed[j] = true;
        }
      }

      if (overlappingCircles.length > 0) {
        mergedCircles.push(mergeCircles(overlappingCircles));
      }
    }

    return mergedCircles;
  };

  const setAdministrativeAreaLevel = () => {
    const mapZoomLevel = mapInstance?.getZoom();
    setZoom(mapZoomLevel);

    let polygonFetchUrl = 'http://blaze-be.titansiteanalysis.home/api/taiwan/geo/city/'
    if (mapZoomLevel >= 8 && mapZoomLevel < 10) {
      polygonFetchUrl = 'http://blaze-be.titansiteanalysis.home/api/taiwan/geo/city/'
    }

    if (mapZoomLevel >= 10 && mapZoomLevel < 14) {
      polygonFetchUrl = 'http://blaze-be.titansiteanalysis.home/api/taiwan/geo/district/'
    }

    if (mapZoomLevel >= 14) {
      const mapBounds = mapInstance?.getBounds();
      const ne = mapBounds.getNorthEast();
      const sw = mapBounds.getSouthWest();
      const bbox = sw.lng() + ',' + sw.lat() + ',' + ne.lng() + ',' + ne.lat();
      polygonFetchUrl = `http://blaze-be.titansiteanalysis.home/api/taiwan/geo/village/?in_bbox=${bbox}`
    }
    setPolygonFetchUrl(polygonFetchUrl);
  }

  useEffect(() => {
    if (polygonFetchUrl) {
      setIsDrawed(false)
      console.log(polygonFetchUrl)
      const fetchData = async () => {
        try {
          const response = await axios.get(polygonFetchUrl);
          let geoJsonData;

          const hasPagination = async (response) => {
            let pageCount = Math.ceil(response.data.count / 60);
            let totalFeatures = [];

            const url = new URL(polygonFetchUrl);
            const params = new URLSearchParams(url.search);
            for (let i = 0; i < pageCount; i++) {
              params.set('page', i + 1);
              const pageResponse = await axios.get(`${url.origin + url.pathname}?${params.toString()}`);
              const pageGeoJsonData = pageResponse.data;
              totalFeatures = [...totalFeatures, ...pageGeoJsonData.features];
            }

            return {
              features: totalFeatures
            };
          }

          let administrativeAreaLevel;
          if (polygonFetchUrl.includes('taiwan/geo/city')) {
            administrativeAreaLevel = '縣市';
            geoJsonData = response.data;
            setCityGeo(geoJsonData);

          } else if (polygonFetchUrl.includes('taiwan/geo/district')) {
            administrativeAreaLevel = '鄉鎮市區';

            geoJsonData = await hasPagination(response);
          } else if (polygonFetchUrl.includes('taiwan/geo/village')) {
            administrativeAreaLevel = '村里';

            geoJsonData = await hasPagination(response);
          } else {
            geoJsonData = response.data;
          }

          console.log('空間統計list', geoJsonData)
          // Extract polygons from GeoJSON data
          const fetchedPolygons = geoJsonData.features.map((feature, index) => {
            let paths, fulladdress;

            let label = feature.properties.name;
            let labelpoint = { lat: feature.properties.center_latitude, lng: feature.properties.center_longitude };

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
              bbox: feature.geometry?.bbox,
              labelpoint: labelpoint,
              administrativeAreaLevel: administrativeAreaLevel
            }

            return result
          });

          // console.log(fetchedPolygons)
          setPolygons(fetchedPolygons);

          let fetchedCircles = [];

          if (!polygonFetchUrl.includes('taiwan/geo/village')) {
            fetchedCircles = geoJsonData.features.map((feature, index) => {
              let result = {
                position: { lat: feature.properties.center_latitude, lng: feature.properties.center_longitude },
                radius: 7000,
                administrativeAreaLevel: administrativeAreaLevel
              }

              return result
            });
          }

          setCircles(detectAndMergeOverlap(detectAndMergeOverlap(detectAndMergeOverlap(fetchedCircles))));

          //畫路線段
          // // const responseL = await axios.get('http://localhost:3000/taiwan_road.geojson'); // Replace with your GeoJSON URL
          // const responseL = await axios.get('http://localhost:3000/simpify_road.json');
          // const geoJsonDataL = responseL.data;
          // // console.log(geoJsonDataL)

          // // Extract polylines from GeoJSON data
          // const fetchedPolylines = geoJsonDataL.features.map(feature => ({
          //   paths: feature.geometry.coordinates.map(latlon => ({ lat: latlon[1], lng: latlon[0] })),
          //   options: {
          //     strokeColor: '#E9FE03', // 線條顏色
          //     strokeOpacity: 1.0,
          //     strokeWeight: 2
          //   },
          // }));

          // // console.log(fetchedPolylines)
          // setPolylines(fetchedPolylines);
          setTimeout(() => {
            setIsDrawed(true)
          }, 500);
        } catch (error) {
          console.error('Error fetching GeoJSON:', error);
        }
      };
      fetchData();
    }

  }, [polygonFetchUrl]);

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

  const getMapPinningPosition = () => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds(map.getCenter());
      const projection = map.getProjection();
      const boundsNE = projection.fromLatLngToPoint(bounds.getNorthEast());
      const boundsSW = projection.fromLatLngToPoint(bounds.getSouthWest());

      const offset = -432 / Math.pow(2, map.getZoom());
      const newBoundsNE = new google.maps.Point(boundsNE.x - offset, boundsNE.y);
      const newBoundsSW = boundsSW;

      const newNE = projection.fromPointToLatLng(newBoundsNE);
      const newSW = projection.fromPointToLatLng(newBoundsSW);

      const newCenterLat = (newNE.lat() + newSW.lat()) / 2;
      const newCenterLng = (newNE.lng() + newSW.lng()) / 2;
      return { lat: newCenterLat, lng: newCenterLng };
    }

  }
  const handleLoad = (map) => {
    mapInstance = map;
    setMap(mapInstance)
    setAdministrativeAreaLevel();
    getMapPinningPosition();
    // const bounds = new window.google.maps.LatLngBounds(center);
    // bounds.extend({ lat: 22.156313582498615, lng: 119.41642519021222 });
    // bounds.extend({ lat: 25.184191640088198, lng: 122.03024641210216 });
    // map.fitBounds(bounds)

    mapInstance.addListener('idle', setAdministrativeAreaLevel);
    mapInstance.addListener('idle', handleMapBoundsChanged);
    mapInstance.addListener('idle', makeScale);
    mapInstance.addListener('drag', getMapPinningPosition);
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

  const [mapPinning, setMapPinning] = useState(false);
  //搜尋
  useEffect(() => {
    if (map) {
      if (!searchByClickArea) {
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

            // map.fitBounds(viewport);
            setZoom(map.getZoom());
            // setCenter({
            //   lat: lat(),
            //   lng: lng()
            // })
            // setZoom(15)
          }
        });
      }


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

  // const generateRandomPOI = () => {
  //   const poiLocations = [];
  //   const numPOI = 70;
  //   const range = 1.0; // 1 度的範圍

  //   for (let i = 0; i < numPOI; i++) {
  //     const lat = center.lat + (Math.random() - 0.5) * range;
  //     const lng = center.lng + (Math.random() - 0.5) * range;
  //     poiLocations.push({ lat, lng });
  //   }

  //   return poiLocations;
  // };

  // const poiLocations = generateRandomPOI();

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
            <div className={styles.mapLoadingModal}>
              <div className={styles.mapLoadingSpinner}></div>
              <p>運算中請稍候...</p>
            </div>
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
              west: 123.8252204304766,
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
          {circles.map((circle, index) => {
            if (circle.position && showWaterMark) { //圓圈隨浮水印顯示
              return (
                <CircleF
                  key={index}
                  center={circle.position}
                  radius={circle.radius}
                  options={circle.options}
                />
              )
            }
          })}
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
          {/* highlight 上一層的地區路徑 */}
          {highlightPolygon.map((polygon, index) => {
            if (polygon.paths) {
              return (
                <PolygonF
                  key={index}
                  paths={polygon.paths}
                  options={polygon.options}
                  clickable={false}
                />
              )
            }
          })}
          {/* 行政區多邊形 label */}
          {polygons.map((polygon, index) => {
            if (polygon.paths) {
              return (
                <PolygonLabel
                  key={index}
                  position={polygon.labelpoint}
                  text={polygon.label}
                />
              )
            }
          })}
          {/* 路線段 */}
          {/* {polylines.map((polyline, index) => (
            <PolylineF
              key={index}
              path={polyline.paths}
              options={polyline.options}
            />
          ))} */}
          {/* {poiLocations.map((poi, index) => (
          <MarkerF
            key={index}
            position={poi}
          />
        ))} */}
          {
            mapPinning ?
              <MarkerF
                position={getMapPinningPosition()}
              /> : null
          }

          <AddressSearch
            onSubmit={handleSubmit}
            searchByClickArea={searchByClickArea}
            setSearchByClickArea={setSearchByClickArea}
            searchResult={searchResult}
            setSearchResult={setSearchResult}
            setHighlightPolygon={setHighlightPolygon}
            setMapPinning={setMapPinning}
          />
        </GoogleMap>
      </div>) : null}
  </>)
}