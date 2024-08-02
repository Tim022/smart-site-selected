export const CENTER = {
  lat: 23.614090,
  lng: 120.861217
}

export const SCALE_WIDTH = {
  min: 50,
  max: 80
}

export const SCALE_VALUES = [{
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
]

export const MAP_STYLES = [
  {
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#2B2F33'
      }
    ]
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#2B2F33'
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
  { //隱藏預設的行政區名稱
    'featureType': 'administrative',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off'
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
  { //隱藏預設的POI
    'featureType': 'poi',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off'
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
        'color': '#2B2F33'
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
        'color': '#2B2F33'
      }
    ]
  }
]

export const MASK_POLYGON_PATH = [
  {
    'lat': 90,
    'lng': 0
  },
  {
    'lat': 90,
    'lng': 122.56805640410275
  },
  {
    'lat': 26.559603825454303,
    'lng': 122.56805640410275
  },
  {
    'lat': 26.45927358654475,
    'lng': 120.43692159366769
  },
  {
    'lat': 26.305727867423737,
    'lng': 119.97990251557094
  },
  {
    'lat': 26.17392797569266,
    'lng': 119.87278581635219
  },
  {
    'lat': 25.850574225446113,
    'lng': 119.86454607025844
  },
  {
    'lat': 25.58837533199154,
    'lng': 120.03842572366102
  },
  {
    'lat': 25.12564449755215,
    'lng': 120.0315592685829
  },
  {
    'lat': 24.98631019373373,
    'lng': 119.1766564835979
  },
  {
    'lat': 24.42682604943217,
    'lng': 118.64748207020892
  },
  {
    'lat': 24.476830847184466,
    'lng': 118.51015296864642
  },
  {
    'lat': 24.558046273706864,
    'lng': 118.41264930653705
  },
  {
    'lat': 24.543056609454414,
    'lng': 118.31377235341205
  },
  {
    'lat': 24.432165750205392,
    'lng': 118.18433893035863
  },
  {
    'lat': 24.377139898107572,
    'lng': 118.19120538543676
  },
  {
    'lat': 22.55265424455404,
    'lng': 119.24822538028224
  },
  {
    'lat': 20.58343648417251,
    'lng': 116.4250156049256
  },
  {
    'lat': 20.58343648417251,
    'lng': 117.08439919308324
  },
  {
    'lat': 21.628959591583115,
    'lng': 119.7769037728001
  },
  {
    'lat': 21.628959591583115,
    'lng': 122.56805640410275
  },
  {
    'lat': -90,
    'lng': 122.56805640410275
  },
  {
    'lat': -90,
    'lng': 0
  }
]
