import React from 'react';
import Highcharts from 'highcharts/highstock';
import highcharts3d from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';
import ServiceData from './Service';

highcharts3d(Highcharts);

var chartData = ServiceData();
var startDate;
var dataLength = chartData.length;
var xPoints = [];

const chart = Highcharts;
chart.setOptions({
  global: {
    useUTC: false
  },
  credits: {
    enabled: false
  }
});

const options = {
  chart: {
    options3d: {
      enabled: true,
      alpha: 0,
      beta: 15,
      depth: 100,
      viewDistance: 25
    },
    events: {
      load: function () {
        setTimeout(() => {
          var series = this.series[0], count = 0;
          let interval = setInterval(() => {
            if (count < dataLength) {
              var x = startDate + (count * 4000) + Number(chartData[count].pointid),
                y = Number(chartData[count].rallylength);//Math.round(Math.random() * 100) % 2 === 0 ? Math.round(Math.random() * 100) : Math.round(Math.random() * -100);
              series.addPoint([x, y], true, true);
              xPoints.push(x);
              count++;
            } else {
              clearInterval(interval);
            }
          }, 4000);
        }, 0);


      }
    }
  },

  xAxis: {

  },

  yAxis: {
    title: {
      text: '<b style="color: #980000 !important;">R. Nadal</b> - <b style="color: rgb(124, 181, 236) !important;">R. Federer</b>',
      useHTML: true
    },
    labels: {
      formatter: function () {
        // if (this.value === 50) {
        //   return 'R. Federer ' + this.value;
        // }
        // if(this.value === -50) {
        //   return 'R. Nadal ' + this.value;
        // }
        // if(this.value === 0) {
        //   return 'R. Federer <br>Shots <br>R. Nadal'
        // }
        if (this.value < 0) {
          return -1 * this.value;
        }
        return this.value
      }
    },
    opposite: false
  },

  rangeSelector: {
    // enabled: false,
    buttons: [{
      count: 1,
      type: 'minute',
      text: '1M'
    }, {
      count: 5,
      type: 'minute',
      text: '5M'
    }, {
      type: 'all',
      text: 'All'
    }],
    inputEnabled: false,
    selected: 0
  },

  title: {
    text: 'Live match: R. Federer VS R. Nadal'
  },

  exporting: {
    enabled: false
  },

  series: [{
    type: 'column',
    name: 'Random data',
    data: (() => {
      var data = [],
        i;
      startDate = (new Date()).getTime();

      for (i = -999; i <= 0; i += 1) {
        data.push([
          startDate + i * 1000,
          null
        ]);
      }
      return data;
    })()
  }],

  plotOptions: {
    column: {
      zones: [{
        value: 0,
        color: '#980000'
      }]
    },
    series: {
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(xPoints.indexOf(this.x) >= 0) {
            return chartData[xPoints.indexOf(this.x)].gamescore;
          }
          if (this.y < 0) {
            return -1 * this.y;
          }
          return this.y;
        }
      }
    }
  }
}

const MatchChart = () => <HighchartsReact
  highcharts={chart}
  constructorType={'stockChart'}
  options={options}
/>

export default MatchChart