import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { AddressSearch } from '@/components/Search/search'
import { CENTER, MAP_STYLES, MASK_POLYGON_PATH } from '@/constant/constant'
import { TitanIcon, PolygonIcon, PlusIcon, MinusIcon } from '@/components/Icons/icons'
import styles from './styles.module.css'
import { Button, Row, Col, notification } from 'antd/lib'
import { Marker, APIProvider, Map } from '@vis.gl/react-google-maps'
import { HandleLoad } from '@/components/HandleLoad/handleload'
import { Polygon } from '@/components/polygon'
import { Circle } from '@/components/circle'

const libraries = ['visualization', 'drawing', 'places'];

const pingIcon = `
  <svg width="50" height="62" viewBox="0 0 50 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_1351_32222)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M25 0C36.598 0 46 9.40202 46 21C46 31.1603 38.7844 39.6353 29.198 41.5803L25.6524 46.6575C25.5788 46.7633 25.4812 46.8497 25.3676 46.9093C25.254 46.9689 25.128 47 25 47C24.872 47 24.746 46.9689 24.6324 46.9093C24.5188 46.8497 24.4212 46.7633 24.3476 46.6575L20.802 41.5803C11.2156 39.6353 4 31.1603 4 21C4 9.40202 13.402 0 25 0Z" fill="#FF645A"/>
        <circle cx="25" cy="21" r="10" fill="white"/>
      <path d="M27 52C27 50.8954 26.1046 50 25 50C23.8954 50 23 50.8954 23 52C23 53.1046 23.8954 54 25 54C26.1046 54 27 53.1046 27 52Z" fill="#FF645A"/>
    </g>
    <defs>
      <filter id="filter0_d_1351_32222" x="0" y="0" width="50" height="62" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="2"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1351_32222"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1351_32222" result="shape"/>
      </filter>
    </defs>
  </svg>`;

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
  maxZoom: 15,
  styles: MAP_STYLES
};

const PolygonLabel = ({ map, position, text }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!map || !position || !text) return;

    const overlay = new google.maps.OverlayView();

    overlay.onAdd = () => {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.transform = 'translate(-50%, -50%)';
      div.style.fontSize = '14px';
      div.style.color = '#FFFFFF';
      div.style.userSelect = 'none';
      div.innerHTML = text;
      overlayRef.current = div;
      overlay.getPanes().overlayLayer.appendChild(div);
    };

    overlay.draw = () => {
      const projection = overlay.getProjection();
      const positionProjection = projection.fromLatLngToDivPixel(position);
      if (overlayRef.current) {
        overlayRef.current.style.left = `${positionProjection.x}px`;
        overlayRef.current.style.top = `${positionProjection.y}px`;
      }
    };

    overlay.onRemove = () => {
      if (overlayRef.current) {
        overlayRef.current.parentNode.removeChild(overlayRef.current);
        overlayRef.current = null;
      }
    };

    overlay.setMap(map);

    // Cleanup function to remove the overlay when the component unmounts or dependencies change
    return () => {
      overlay.setMap(null);
    };
  }, [map, position, text]);

  return null;
};

export default function App() {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [notificationKey, setNotificationKey] = useState(null);

  const openNotification = () => {
    setNotificationKey('1');

    notificationApi.open({
      key: '1',
      className: styles.pinConfirmNotification,
      message: (
        <div className={styles.pinConfirmNotificationMessage}>
          <span>是否釘選該位置 ?</span>
          <Button className={styles.btnPinConfirm}>
            確認
          </Button>
        </div>
      ),
      placement: 'top',
      duration: 0,
      closeIcon: null,
    });
  };

  const closeNotification = () => {
    if (notificationKey) {
      notificationApi.destroy(notificationKey);
      setNotificationKey(null); // Clear the key after destroying
    }
  };

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(CENTER);

  const [polygons, setPolygons] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [isDrawed, setIsDrawed] = useState(true);
  const [zoom, setZoom] = useState(8);
  //初始放大級數、國道：8 (比例尺20公里)
  //鄉鎮市區、省道、快速道路：10(比例尺10公里)
  //村里、所有POI：14(比例尺500公尺)

  const zoomOut = () => {
    map.setZoom(map.getZoom() - 1);
  }
  const zoomIn = () => {
    map.setZoom(map.getZoom() + 1);
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
    console.log(event)
    console.log('Map clicked at:', event.detail.latLng);
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

  // 產生圓形
  const [circles, setCircles] = useState([]);

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
    }
  }, [addressSearchString]);

  const [showWaterMark, setShowWaterMark] = useState(true);
  const hideWatermark = () => {
    setShowWaterMark(!showWaterMark);
  }

  const [pinPosition, setPinPosition] = useState();

  return (<>
    {contextHolder}
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
    <div className={styles.mapContainer}>
      {!isDrawed ? (
        <div className={`${styles.mapLoadingMask} ${styles.alignCenterV} ${styles.alignCenterH}`}>
          <div className={styles.mapLoadingModal}>
            <div className={styles.mapLoadingSpinner}></div>
            <p>運算中請稍候...</p>
          </div>
        </div>
      ) : null}
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={libraries}>
        <Map
          style={{ width: '100vw', height: '100vh' }}
          defaultCenter={center}
          defaultZoom={zoom}
          options={mapOptions}
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
          <AddressSearch
            onSubmit={handleSubmit}
            searchByClickArea={searchByClickArea}
            setSearchByClickArea={setSearchByClickArea}
            addressSearchString={addressSearchString}
            searchResult={searchResult}
            setSearchResult={setSearchResult}
            setHighlightPolygon={setHighlightPolygon}
            setMapPinning={setMapPinning}
            openNotification={openNotification}
            closeNotification={closeNotification}
          />
          <HandleLoad
            setMap={setMap}
            setPinPosition={setPinPosition}
            setPolygons={setPolygons}
            setCircles={setCircles}
            setIsDrawed={setIsDrawed}
            setZoom={setZoom}
            setCityGeo={setCityGeo}
            setScaleValues={setScaleValues}
          />
          {circles.map((circle, index) => {
            if (circle.position && showWaterMark) { //圓圈隨浮水印顯示
              return (
                <Circle
                  key={index}
                  center={circle.position}
                  radius={circle.radius}
                  options={circle.options}
                />
              )
            }
          })}
          {/* 其他國家遮罩 */}
          <Polygon
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
          {/* 行政區多邊形 */}
          {polygons.map((polygon, index) => {
            if (polygon.paths) {
              return (
                <Polygon
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
          {polygons.map((polygon, index) => {
            if (polygon.paths) {
              return (
                <PolygonLabel
                  key={index}
                  map={map}
                  position={polygon.labelpoint}
                  text={polygon.label}
                />
              )
            }
          })}
          {/* highlight 上一層的地區路徑 */}
          {highlightPolygon.map((polygon, index) => {
            if (polygon.paths) {
              return (
                <Polygon
                  key={index}
                  paths={polygon.paths}
                  options={polygon.options}
                  clickable={false}
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
          {
            mapPinning ?
              <Marker
                position={pinPosition}
                title={'AdvancedMarker with customized pin.'}
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pingIcon)}`
                }}
              >
              </Marker> : null
          }
        </Map>
      </APIProvider>
    </div>
  </>)
}