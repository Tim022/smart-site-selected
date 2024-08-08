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

export const BarBasic = ({ dataValue, innerRef }) => {
  let option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
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
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
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
            show: true, // hover 時顯示 label
            position: 'top', // 標籤顯示在柱狀圖上方
            color: '#ff0000', // hover 時 label 的顏色
            fontWeight: 'bold', // hover 時 label 的字體加粗
            formatter: function (params) {
              // 使用 CSS 模擬圓角效果的內容
              return `{a|${params.value} units}`;
            },
            rich: {
              a: {
                backgroundColor: '#f5f5f5', // 背景顏色
                borderColor: '#ccc', // 邊框顏色
                borderWidth: 1, // 邊框寬度
                borderRadius: 10, // 圓角半徑
                padding: [10, 15], // 內邊距
                align: 'center',
                verticalAlign: 'middle',
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