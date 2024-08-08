import React, { useState, useEffect } from "react";
import ReactECharts from 'echarts-for-react';

export const GaugeBasic = ({ dataValue, innerRef }) => {
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
            borderColor: '#4DBFB6', // This doesn't work :(
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

export const BarThisYearBase = ({ dataValue, innerRef }) => {
  let option = {
    grid:{
      containLabel:true,
      top:'22%',
      right:'2%',
      bottom:0,
      left:'2%'
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
      axisLabel:{
        color:'#FFF'
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
                  padding: [0, 0,0,0],
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