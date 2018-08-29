import React, { Component } from 'react';
import logo from './logo.svg';
import MatchChart from './MatchChart';
import Amchart from './AmChart';

import * as d3 from "d3";

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Manhattan POC</h1>
        </header>
        <div><h3>D3 charts Lib</h3></div>
        <div id="chart-cotainer"></div>
        <div><h3>Amcharts Lib</h3></div>
        <Amchart />
        <div><h3>Highcharts Lib</h3></div>
        <MatchChart />
      </div>
    );
  }

  componentDidMount() {

    var margin = { left: 40, right: 40, top: 40, bottom: 40 };
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var svg = d3.select('#chart-cotainer')
      .append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.left + margin.right)
      .attr('style', 'background: #222;');

    var g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    d3.json('data.json').then(data => {
      var x = d3.scaleBand()
        .domain(data.map(item => {
          return item.point;
        }))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

      var y = d3.scaleLinear()
        .domain(d3.extent(data, (item) => { return item.rallylength })).nice();
      //   [0, d3.max(data, (item) => {
      //   return item.rallylength;
      // })]
      // )
      y.range([height, 0]);

      var xAxisCall = d3.axisBottom(x);
      g.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + y(0) + ')')
        .attr('style', 'color: #777;')
        .call(xAxisCall)
        .selectAll('text')
        .attr('y', (item) => {
          if (data[item - 1].rallylength > 0) {
            return 15;
          }
          return -15;
        })
        .attr('class', 'x-labels');

      var yAxisCall = d3.axisLeft(y)
        .tickFormat((item) => {
          if (item >= 0) {
            return item;
          }
          return item * -1;
        });

      g.append('g')
        .attr('class', 'y-axis')
        .attr('style', 'color: #777;')
        .call(yAxisCall);

      var rects = g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d, i) => {
          return x(d.point);
        })
        .attr('y', (d) => {
          if (d.rallylength > 0) {
            return y(d.rallylength);
          }
          return y(0);
        })
        .attr('height', (d) => {
          return Math.abs(y(d.rallylength) - y(0));
          // return height - y(d.rallylength);
        })
        .attr('width', x.bandwidth)
        .attr('fill', item => {
          if (item.rallylength > 0) {
            return 'yellow';
          }
          return 'grey';
        })
        .attr('class', item => {
          return item.serveclass;
        });

      var rects = g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => {
          return x(d.point) + (x.bandwidth() / 2);
        })
        .attr('cy', (d) => {
          if (d.rallylength > 0) {
            return y(d.rallylength) - 20;
          }
          return y(0) + Math.abs(y(d.rallylength) - y(0)) - 20;
        })
        .attr('r', 13)
        .attr('fill', item => {
          if (item.rallylength > 0) {
            return 'yellow';
          }
          return 'red';
        })
        .attr('class', item => {
          return item.serveclass;
        });



    }).catch(error => {
      console.log(error);
    });
  }
}

export default App;
