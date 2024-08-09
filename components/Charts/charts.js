import React, { useState, useEffect } from "react";
import ReactECharts from 'echarts-for-react';

export const SiteRateBasic = ({ dataValue, innerRef }) => {
  let option = {
    series: [
      {
        startAngle: 220,
        endAngle: -40,
        min: 1,
        max: 10,
        type: 'gauge',
        radius: '95%',
        itemStyle: {
          color: '#00000000'
        },
        progress: {
          show: true,
          width: 18,
          roundCap: true,
        },
        pointer: {
          icon: 'circle',
          length: '17%',
          width: 60,
          offsetCenter: [0, '-85%'],
          itemStyle: {
            color: '#2B2F33',
            borderColor: '#4DBFB6',
            borderWidth: 9,
            shadowColor: 'rgba(10, 31, 68, 0.5)',
            shadowBlur: 2,
            shadowOffsetY: 1,
          },
        },
        axisLine: {
          show: true,
          roundCap: true,
          lineStyle: {
            width: 15,
            borderColor: '#2B2F33',
            borderWidth: 5,
            color: [
              [0.25, '#A1AAB2'],
              [0.3],
              [0.58, '#866DFF'],
              [0.63],
              [1, '#4DBFB6'],
            ],
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        anchor: {
          show: false
        },
        title: {
          fontSize: 14,
          color: '#FFF'
        },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '-9%'],
          fontSize: 48,
          fontWeight: 'bolder',
          formatter: 'LV.{value}',
          color: '#FFF'
        },
        data: [
          {
            value: dataValue,
            name: '推薦建站等級'
          }
        ]
      },
    ]
  };

  const [options, setOption] = useState(option);

  useEffect(() => {
    setOption(option);
  }, [dataValue]);

  const onEvents = {

  }

  return (
    <ReactECharts
      option={options}
      opts={{ renderer: 'svg' }}
      notMerge={true}
      onEvents={onEvents}
      ref={innerRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export const PenetrationRateBasic = ({ dataValue, innerRef }) => {
  let option = {
    series: [
      {
        type: 'gauge',
        data: [
          {
            value: 60,
            name: '電動車滲透率',
            title: {
              fontSize: 14,
              color: '#FFFFFF',
              offsetCenter: [0, '-26px'],
              formatter: function (params) {
                return `666`;
              },
            },
          }
        ],
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            color: '#4DBFB6'
          }
        },
        axisLine: {
          lineStyle: {
            width: 10,
            color: [
              [0, '#454B52'],
              [1, '#454B52']
            ]
          }
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '19px'],
          fontSize: 32,
          fontWeight: '700',
          formatter: function (params) {
            return `{a|60%}\n{b|3,128/12,512}`;
          },
          rich: {
            a: {
              fontSize: 32,
              fontFamily: 'Noto Sans CJK TC',
              fontWeight: 700,
              color: '#FFFFFF',
            },
            b: {
              fontSize: 10,
              fontFamily: 'Noto Sans CJK TC',
              fontWeight: 400,
              color: '#C3CED9',
            },
          },
          color: '#000'
        },
      }
    ]
  };

  const [options, setOption] = useState(option);

  useEffect(() => {
    setOption(option);
  }, [dataValue]);

  const onEvents = {

  }

  return (
    <ReactECharts
      option={options}
      opts={{ renderer: 'svg' }}
      notMerge={true}
      onEvents={onEvents}
      ref={innerRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export const PieBasic = ({ dataValue, type, innerRef }) => {
  let labelTitle = '';
  let labelTitleSize = 14;

  if (type == 1) {
    labelTitle = '所有種類';
    labelTitleSize = 14;
  } else if (type == 2) {
    labelTitle = 'AC';
    labelTitleSize = 20;
  } else if (type == 3) {
    labelTitle = 'DC';
    labelTitleSize = 20;
  }
  let option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        let name = params.name;
        let value = params.value;
        return `
              <div style="display: flex;flex-direction: column;">
                <div style="background:#565C66;padding:4px 6px;border-radius:6px;display: flex;justify-content: center;flex-direction: column;align-items: center;">
                  <div>
                   <span>${name}</span>
                   <div style="display: flex;align-items: center;">
                    <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:#FFF;"></span>
                    <span style="margin-right:3px;">樁數量</span>
                    <span>${value}</span>
                   </div>
                  </div>
                </div>
                <svg width="33" height="8" viewBox="0 0 33 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_2073_16321)">
                    <path d="M9.49849 0.000221252L16.5696 7.07129L23.6406 0.000221252L9.49849 0.000221252Z" fill="#565C66"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_2073_16321">
                      <rect width="33" height="7.07107" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>`;
      },
      position: function (point, params, dom, rect, size) {
        // point 是鼠標位置，您可以根據需要調整顯示位置
        return [point[0], point[1] - dom.offsetHeight]; // 在鼠標上方顯示
      },
      padding: [0, 0],
      backgroundColor: '#00000000',
      extraCssText: 'border: none; box-shadow: none;',
      textStyle: {
        color: '#FFF'
      }
    },
    grid: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          color: '#FFF',
          formatter: function (params) {
            return `{a|${labelTitle}}\n{c|}\n{b|共 666 樁}`;
          },
          rich: {
            a: {
              fontSize: labelTitleSize,
              fontFamily: 'Noto Sans CJK TC',
              fontWeight: 700,
            },
            b: {
              fontSize: 12,
              fontFamily: 'Noto Sans CJK TC',
              fontWeight: 400,
            },
            c: {
              padding: [-4, 0]
            }
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '星舟快充' },
          { value: 735, name: 'EV OASIS' },
          { value: 580, name: 'TAIL' },
          { value: 484, name: 'iCharging' },
          { value: 300, name: 'NHOA.TCC' }
        ]
      }
    ]
  };

  const [options, setOption] = useState(option);

  useEffect(() => {
    setOption(option);
  }, [dataValue]);

  const onEvents = {

  }

  return (
    <ReactECharts
      option={options}
      opts={{ renderer: 'svg' }}
      notMerge={true}
      onEvents={onEvents}
      ref={innerRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export const PieBasic2 = ({ dataValue, innerRef }) => {
  let labelTitle = '';
  let labelTitleSize = 14;
  let option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        let name = params.name;
        let value = params.value;
        return `
              <div style="display: flex;flex-direction: column;z-index:100">
                <div style="background:#565C66;padding:4px 6px;border-radius:6px;display: flex;justify-content: center;flex-direction: column;align-items: center;">
                  <div>
                   <span>${name}</span>
                   <div style="display: flex;align-items: center;">
                    <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:#FFF;"></span>
                    <span style="margin-right:3px;">樁數量</span>
                    <span>${value}</span>
                   </div>
                  </div>
                </div>
                <svg width="33" height="8" viewBox="0 0 33 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_2073_16321)">
                    <path d="M9.49849 0.000221252L16.5696 7.07129L23.6406 0.000221252L9.49849 0.000221252Z" fill="#565C66"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_2073_16321">
                      <rect width="33" height="7.07107" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>`;
      },
      position: function (point, params, dom, rect, size) {
        // point 是鼠標位置，您可以根據需要調整顯示位置
        return [point[0], point[1] - dom.offsetHeight]; // 在鼠標上方顯示
      },
      padding: [0, 0],
      backgroundColor: '#00000000',
      extraCssText: 'border: none; box-shadow: none;',
      textStyle: {
        color: '#FFF'
      }
    },
    grid: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['37%', '90%'],
        avoidLabelOverlap: false,
        label: {
          position: 'inside',
          formatter: '{d}%',
          color: '#FFFFFF',
          fontSize: 12
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: 1048,
            name: '星舟快充'
          },
          {
            value: 735,
            name: 'EV OASIS'
          },
        ]
      }
    ]
  };

  const [options, setOption] = useState(option);

  useEffect(() => {
    setOption(option);
  }, [dataValue]);

  const onEvents = {

  }

  return (
    <ReactECharts
      option={options}
      opts={{ renderer: 'svg' }}
      notMerge={true}
      onEvents={onEvents}
      ref={innerRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export const SunburstBasic = ({ dataValue, innerRef }) => {
  let data = [
    {
      name: '自用',
      value: 25,
      label: {
        rotate: 0,
        color: '#FFF',
        formatter: function (params) {
          let name = params.name;
          let percent = ((params.value / params.treePathInfo[0].value) * 100).toFixed(2);
          return `${name}\n${percent}%`;
        },
      },
      itemStyle: {
        color: '#6652CC'
      },
      children: [
        {
          name: '電動',
          value: 15,
          label: {
            rotate: 0,
            color: '#6652CC',
            formatter: function (params) {
              let name = params.name;
              let percent = ((params.value / params.treePathInfo[0].value) * 100).toFixed(2);
              return `${name}\n${percent}%`;
            },
          },
          itemStyle: {
            color: '#9F8CFF'
          },
        },
        {
          name: '非電',
          value: 10,
          label: {
            rotate: 0,
            color: '#565C66',
            formatter: function (params) {
              let name = params.name;
              let percent = ((params.value / params.treePathInfo[0].value) * 100).toFixed(2);
              return `${name}\n${percent}%`;
            },
          },
          itemStyle: {
            color: '#C3CED9'
          },
        }
      ]
    },
    {
      name: '營業',
      value: 10,
      label: {
        rotate: 0,
        color: '#FFF',
        formatter: function (params) {
          let name = params.name;
          let percent = ((params.value / params.treePathInfo[0].value) * 100).toFixed(2);
          return `${name}\n${percent}%`;
        },
      },
      itemStyle: {
        color: '#4DBFB6'
      },
      children: [
        {
          name: '電動',
          value: 4,
          label: {
            rotate: 0,
            color: '#337380',
            formatter: function (params) {
              let name = params.name;
              let percent = ((params.value / params.treePathInfo[0].value) * 100).toFixed(2);
              return `${name}\n${percent}%`;
            },
          },
          itemStyle: {
            color: '#8AE5CE'
          },
        },
        {
          name: '非電',
          value: 6,
          label: {
            rotate: 0,
            color: '#565C66',
            formatter: function (params) {
              let name = params.name;
              let percent = ((params.value / params.treePathInfo[0].value) * 100).toFixed(2);
              return `${name}\n${percent}%`;
            },
          },
          itemStyle: {
            color: '#E1EAF2'
          },
        }
      ]
    },
  ];

  let option = {
    tooltip: {
      formatter: function (params) {
        let name = params.name;
        let value = params.value;
        return `
            <div style="display: flex;flex-direction: column;">
              <div style="background:#565C66;padding:2px 4px;border-radius:6px;display: flex;justify-content: center;">
                ${value}
              </div>
              <svg width="33" height="8" viewBox="0 0 33 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_2073_16321)">
                  <path d="M9.49849 0.000221252L16.5696 7.07129L23.6406 0.000221252L9.49849 0.000221252Z" fill="#565C66"/>
                </g>
                <defs>
                  <clipPath id="clip0_2073_16321">
                    <rect width="33" height="7.07107" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>`;
      },
      position: function (point, params, dom, rect, size) {
        // point 是鼠標位置，您可以根據需要調整顯示位置
        return [point[0], point[1] - dom.offsetHeight]; // 在鼠標上方顯示
      },
      padding: [0, 0],
      backgroundColor: '#00000000',
      extraCssText: 'border: none; box-shadow: none;',
      textStyle: {
        color: '#FFF'
      }
    },
    series: {
      type: 'sunburst',
      emphasis: {
        focus: 'none'
      },
      data: data,
      radius: [0, '90%'],

    }
  };

  const [options, setOption] = useState(option);

  useEffect(() => {
    setOption(option);
  }, [dataValue]);

  const onEvents = {

  }

  return (
    <ReactECharts
      option={options}
      opts={{ renderer: 'svg' }}
      notMerge={true}
      onEvents={onEvents}
      ref={innerRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export const BarThisYearBase = ({ dataValue, innerRef }) => {
  let option = {
    grid: {
      containLabel: true,
      top: '22%',
      right: '2%',
      bottom: 0,
      left: '2%'
    },
    xAxis: {
      type: 'category',
      data: ['2024', '2025', '2026', '2027', '2028', '2029', '2030'],
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#FFF'
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      }
    },
    series: [
      {
        data: [12000, 20000, 15000, 8000, 7000, 11000, 13000],
        type: 'bar',
        itemStyle: {
          color: '#866DFF',
          barBorderRadius: 6
        },
        barWidth: '40%',
        label: {
          show: false // 預設不顯示所有數據的 label
        },
        emphasis: {
          label: {
            show: true,
            position: 'top',
            color: '#FFFFFF',
            fontWeight: 'bold',
            formatter: function (params) {
              return `{a|${params.value}}\n{arrow|}`;
            },
            rich: {
              a: {
                backgroundColor: '#565C66',
                borderRadius: 10,
                padding: [5, 7],
                align: 'center',
                verticalAlign: 'middle',
              },
              arrow: {
                backgroundColor: '#565C66',
                padding: [0, 0, 0, 0],
                align: 'center',
                verticalAlign: 'top',
                height: 8,
                width: 33,
                backgroundColor: {
                  image: 'data:image/svg+xml;base64,' + btoa(`
                        <svg width="33" height="8" viewBox="0 0 33 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clip-path="url(#clip0_2073_16321)">
                            <path d="M9.49849 0.000221252L16.5696 7.07129L23.6406 0.000221252L9.49849 0.000221252Z" fill="#565C66"/>
                          </g>
                          <defs>
                            <clipPath id="clip0_2073_16321">
                              <rect width="33" height="7.07107" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                    `)
                }
              }
            }
          }
        }
      },
    ]
  };

  const [options, setOption] = useState(option);

  useEffect(() => {
    setOption(option);
  }, [dataValue]);

  const handleChartEvent = (params) => {
    if (params.type === 'mouseover') {
      console.log('Mouse over event:', params);
    } else if (params.type === 'mouseout') {
      console.log('Mouse out event:', params);
    }
  };

  return (
    <ReactECharts
      option={options}
      opts={{ renderer: 'svg' }}
      notMerge={true}
      onEvents={{
        'mouseover': handleChartEvent,
        'mouseout': handleChartEvent
      }}
      ref={innerRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

