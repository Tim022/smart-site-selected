import React, { useState, useEffect } from 'react'
import { useMap } from '@vis.gl/react-google-maps';
import axios from 'axios'
import { SCALE_WIDTH, SCALE_VALUES } from '@/constant/constant'

export const HandleLoad = ({ setMap, setPinPosition, setPolygons, setCircles, setIsDrawed, setZoom, setCityGeo, setScaleValues }) => {
  const map = useMap();
  const handleMapBoundsChanged = () => {
    console.log(google.maps)
    // console.log(map)
    //取得放大等級
    const mapZoomLevel = map?.getZoom();
    // setZoom(mapZoomLevel);
    console.log('Map zoom level changed:', mapZoomLevel);

    //取得中心經緯度與邊緣距離
    const mapCenter = map?.getCenter();
    const centerlat = mapCenter.lat();
    const centerlng = mapCenter.lng();
    const mapBounds = map?.getBounds();
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
    let zoom = map?.getZoom();

    // Calculate the width of 1 map pixel in meters
    // Based on latitude and zoom level
    // See https://groups.google.com/d/msg/google-maps-js-api-v3/hDRO4oHVSeM/osOYQYXg2oUJ
    let scale = 156543.03392 * Math.cos(map?.getCenter().lat() * Math.PI / 180) / Math.pow(2, zoom);

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
    setPinPosition({ lat: newCenterLat, lng: newCenterLng })
  }

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

  const [polygonFetchUrl, setPolygonetchUrl] = useState();
  const setAdministrativeAreaLevel = () => {
    const mapZoomLevel = map?.getZoom();
    setZoom(mapZoomLevel);

    let polygonFetchUrl = 'http://blaze-be.titansiteanalysis.home/api/taiwan/geo/city/'
    if (mapZoomLevel >= 8 && mapZoomLevel < 10) {
      polygonFetchUrl = 'http://blaze-be.titansiteanalysis.home/api/taiwan/geo/city/'
    }

    if (mapZoomLevel >= 10 && mapZoomLevel < 14) {
      polygonFetchUrl = 'http://blaze-be.titansiteanalysis.home/api/taiwan/geo/district/'
    }

    if (mapZoomLevel >= 14) {
      const mapBounds = map?.getBounds();
      const ne = mapBounds.getNorthEast();
      const sw = mapBounds.getSouthWest();
      const bbox = sw.lng() + ',' + sw.lat() + ',' + ne.lng() + ',' + ne.lat();
      polygonFetchUrl = `http://blaze-be.titansiteanalysis.home/api/taiwan/geo/village/?in_bbox=${bbox}`
    }
    setPolygonetchUrl(polygonFetchUrl);
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

  useEffect(() => {
    if (map) {
      setMap(map);
      // const bounds = new window.google.maps.LatLngBounds(center);
      // bounds.extend({ lat: 22.156313582498615, lng: 119.41642519021222 });
      // bounds.extend({ lat: 25.184191640088198, lng: 122.03024641210216 });
      // map.fitBounds(bounds)

      map.addListener('idle', setAdministrativeAreaLevel);
      map.addListener('idle', handleMapBoundsChanged);
      map.addListener('idle', makeScale);
      map.addListener('drag', getMapPinningPosition);
      map.addListener('idle', getMapPinningPosition);
    }
  }, [map]);

  return (<></>);
}

export default function None() {
  return (<></>)
}