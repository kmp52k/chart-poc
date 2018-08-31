import React, { Component } from 'react';
import logo from './logo.svg';
import MatchChart from './MatchChart';
import Amchart from './AmChart';

import * as d3 from "d3";

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
    this.margin = { left: 60, right: 40, top: 40, bottom: 40 };
    this.width = 800 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;
    this.svg = null;
    this.group1 = null;
    this.group2 = null;
    this.xScale = null;
    this.yScale = null;
    this.xAxisGroup1 = null;
    this.yAxisGroup1 = null;
    this.xAxisGroup2 = null;
    this.yAxisGroup2 = null;
    this.trans = d3.transition().duration(750);
    this.zoom = null;
  }

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

    this.zoom = d3.zoom().on('zoom', this.zoomHandler);

    this.svg = d3.select('#chart-cotainer')
      .append('svg')
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .call(this.zoom).append('g');
    // .attr('style', 'background: #222;');

    this.group1 = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')');
    // .attr('height', this.height / 2);
    this.group2 = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ', ' + (this.margin.top + (this.height / 2)) + ')');
    // .attr('height', this.height / 2);

    // X Scale
    this.xScale = d3.scaleBand()
      .range([0, this.width])
      .paddingInner(0.3)
      .paddingOuter(0.3);

    // Y Scale
    this.yScale = d3.scaleLinear().range([this.height / 2, 0]);

    // X Axis Group
    this.xAxisGroup1 = this.group1.append('g')
      .attr('class', 'x axis')
      .attr('style', 'color: #777;');
    this.xAxisGroup2 = this.group2.append('g')
      .attr('class', 'x axis')
      .attr('style', 'color: #777;');

    // Y Axis Group
    this.yAxisGroup1 = this.group1.append('g')
      .attr('class', 'y-axis')
      .attr('style', 'color: #777;');
    this.yAxisGroup2 = this.group2.append('g')
      .attr('class', 'y-axis')
      .attr('style', 'color: #777;');

    // Y Label
    this.group1.append('text')
      .attr('y', -30)
      .attr('x', -(this.height / 4))
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('fill', '#999')
      .text('R. Federer');
    this.group2.append('text')
      .attr('y', -30)
      .attr('x', -(this.height / 4))
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('fill', '#999')
      .text('R. Nadal');

    d3.json('data.json').then(data => {

      let count = 1;
      let intet = setInterval(() => {
        if (count > 5) {
          clearInterval(intet);
        } else {
          data.push({ point: (10 + count), rallylength: (count % 2) ? (3 + count) : -(3 + count) });
          count = count + 1;
          this.update(data);
        }
      }, 3000);
      this.update(data);
    }).catch(error => {
      console.log(error);
    });
  }

  update = (data) => {

    this.xScale.domain(data.map(item => { return item.point; }));
    this.yScale.domain(d3.extent(data, (item) => { return item.rallylength })).nice();

    var xAxisCall = d3.axisBottom(this.xScale);
    this.xAxisGroup1
      .attr('transform', 'translate(0, ' + this.yScale(0) + ')')
      .transition(this.trans)
      .call(xAxisCall)
      .selectAll('text')
      .attr('y', (item) => {
        if (data[item - 1].rallylength > 0) {
          return 15;
        }
        return -15;
      })
      .attr('class', 'x-labels');
    this.xAxisGroup2
      .attr('transform', 'translate(0, ' + this.yScale(0) + ')')
      .transition(this.trans)
      .call(xAxisCall)
      .selectAll('text')
      .attr('y', (item) => {
        if (data[item - 1].rallylength > 0) {
          return 15;
        }
        return -15;
      })
      .attr('class', 'x-labels');

    var yAxisCall = d3.axisLeft(this.yScale)
      .tickFormat((item) => {
        if (item >= 0) {
          return item;
        }
        return item * -1;
      });
    this.yAxisGroup1
      .transition(this.trans)
      .call(yAxisCall);
    this.yAxisGroup2
      .transition(this.trans)
      .call(yAxisCall);

    this.setupRects(this.group1.selectAll('rect').data(data));
    this.setupCircles(this.group1.selectAll('circle').data(data));
    this.setupRects(this.group2.selectAll('rect').data(data));
    this.setupCircles(this.group2.selectAll('circle').data(data));
  }

  setupRects = (rects) => {

    rects.exit().remove();
    rects.enter()
      .append('rect')
      .attr('x', (d, i) => {
        return this.xScale(d.point);
      })
      .attr('y', this.yScale(0))
      .attr('height', 0)
      .attr('width', this.xScale.bandwidth)
      .attr('fill', item => {
        if (item.rallylength > 0) {
          return 'yellow';
        }
        return 'grey';
      })
      .attr('class', item => {
        return item.serveclass;
      })
      .merge(rects)
      .transition(this.trans)
      .attr('x', (d, i) => {
        return this.xScale(d.point);
      })
      .attr('width', this.xScale.bandwidth)
      .attr('y', (d) => {
        if (d.rallylength > 0) {
          return this.yScale(d.rallylength);
        }
        return this.yScale(0);
      })
      .attr('height', (d) => {
        return Math.abs(this.yScale(d.rallylength) - this.yScale(0));
      });
  }

  setupCircles = (circles) => {

    circles.exit().remove();
    circles.enter()
      .append('circle')
      .attr('cx', (d, i) => {
        return this.xScale(d.point) + (this.xScale.bandwidth() / 2);
      })
      .attr('cy', (d) => {
        if (d.rallylength > 0) {
          return this.yScale(d.rallylength) - 20;
        }
        return this.yScale(0) + Math.abs(this.yScale(d.rallylength) - this.yScale(0)) - 20;
      })
      .attr('r', 0)
      .attr('fill', item => {
        if (item.rallylength > 0) {
          return 'yellow';
        }
        return 'red';
      })
      .attr('class', item => {
        return item.serveclass;
      })
      .merge(circles)
      .transition(this.trans)
      .attr('cx', (d, i) => {
        return this.xScale(d.point) + (this.xScale.bandwidth() / 2);
      })
      .attr('cy', (d) => {
        if (d.rallylength > 0) {
          return this.yScale(d.rallylength) - 20;
        }
        return this.yScale(0) + Math.abs(this.yScale(d.rallylength) - this.yScale(0)) - 20;
      })
      .attr('r', 13);
  }

  zoomHandler = (event) => {
    console.log(event, d3.event.transform);
    this.svg.attr('transform', d3.event.transform);
  }
}

export default App;
