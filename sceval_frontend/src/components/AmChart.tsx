import React, { useEffect, useState, useRef, useContext } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import moment from 'moment';
import { Context, context } from '../context/Context';
import { SensorDataBundle } from '../components/entities/SensorModule';
am4core.useTheme(am4themes_animated);

interface AmChartProps extends React.Props<any> {
  // amchart chart identifier
  identifier: string;
  // time series data passed to chart
  TSDB: SensorDataBundle;
  timespanNumeric: number;
  // timespan
  timespan: string;
}

export const AmChart: React.FC<AmChartProps> = (props: AmChartProps) => {
  // expanded or closed mode state
  const [expandedMode, setExpandedMode] = useState<boolean>(false);
  // graph height state
  const [graphHeight, setGraphHeight] = useState<string>('300px');
  // latest real-time value state
  const [latestRTVal, setlatestRTVal] = useState();
  // latest date state
  const [latestDate, setlatestDate] = useState();
  // sensor chart state
  const [sensorChart, setSensorChart] = useState<am4charts.XYChart>();
  // declare context hook
  const sensorContext: Context = useContext(context);
  // declare useEffect hook

  useEffect(() => {
    // create amChart instance with custom identifier
    const chart = am4core.create(props.identifier, am4charts.XYChart);
    setSensorChart(chart);
    const graphData: Array<any> = [];
    var dbData: any = [];
    var dateArray: any = [];
    // if TSDB data exists
    if (props.TSDB) {
      // map over TSDB data and push data to dataArray
      props.TSDB.TSDBData.data.map((sensorDataPoint: any, index: any) => {
        if (!dateArray.includes(sensorDataPoint[0])) {
          dbData.push({
            date: moment(sensorDataPoint[0]).toISOString(),
            value: sensorDataPoint[1].toFixed(2)
          });
          dateArray.push(sensorDataPoint[0]);
        }
      });
    }
    chart.data = dbData;

    // push  new x-value axis
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.labels.template.fill = am4core.color('#7FCBCF');
    dateAxis.renderer.labels.template.rotation = -90;
    // format chart x axis
    dateAxis.dateFormatter = new am4core.DateFormatter();
    chart.dateFormatter.dateFormat = 'i';
    chart.dateFormatter.inputDateFormat = 'i';
    // push new y-value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fill = am4core.color('#7FCBCF');
    valueAxis.renderer.minWidth = 60;
    valueAxis.extraMin = 0.1;
    if (props.timespan === 'minute') {
      valueAxis.extraMax = 1.0;
      valueAxis.extraMin = 1.0;
    } else {
      valueAxis.extraMax = 0.2;
    }

    // format data series:
    let series = chart.series.push(new am4charts.LineSeries());
    series.name = props.TSDB.type;
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';

    // format tooltip:
    series.tooltipText = '{valueY.value}';
    if (series.tooltip) {
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color('#7FCBCF');
    }
    series.fill = am4core.color('#7FCBCF');
    series.stroke = am4core.color('#7FCBCF');
    series.fillOpacity = 1;

    // format graph gradient:
    var gradient = new am4core.LinearGradient();
    gradient.addColor(chart.colors.getIndex(0), 0.5);
    gradient.addColor(chart.colors.getIndex(0), 0);
    // gradient.rotation = 90;
    series.fill = gradient;
    // format cursor:
    chart.cursor = new am4charts.XYCursor();
    let scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX = scrollbarX;

    // graph smoothness
    // series.tensionX = 0.77;
    dateAxis.renderer.grid.template.strokeOpacity = 0.07;
    valueAxis.renderer.grid.template.strokeOpacity = 0.07;
    return function cleanup() {
      if (chart) {
        chart.dispose();
      }
    };
  },        []);

  useEffect(() => {
    // Listen to the sensorChart, timespan, and rtValues changes and update the chart
    // data but only for real-time data view
    if (
      props.timespan === 'real-time' &&
      sensorChart &&
      sensorContext.state.rtValues
    ) {
      const sData = sensorContext.state.rtValues.filter((sensor: any) => {
        return sensor.type === props.TSDB.type;
      });
      if (sData.length > 0) {
        sensorChart.removeData(1);
        sensorChart.addData({
          date: moment().toISOString(),
          value: sData[0].val.toFixed(2)
        });
      }
    }
    // invoke dependencies
  },        [sensorChart, props.timespan, sensorContext.state.rtValues]);

  return (
    <div>
      <div
        onClick={() => {
          if (!expandedMode) {
            setExpandedMode(true);
            setGraphHeight('500px');
          }
        }}
        id={props.identifier}
        style={{ width: '100%', height: graphHeight }}
      />
      {expandedMode && (
        <button
          className="compress-button"
          onClick={() => {
            setGraphHeight('300px');
            setExpandedMode(false);
          }}
        >
          Close
        </button>
      )}
    </div>
  );
};

export default AmChart;
