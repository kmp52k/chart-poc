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
    this.group = null;
    this.xScale = null;
    this.yScale = null;
    this.xAxisGroup = null;
    this.yAxisGroup = null;
    this.trans = d3.transition().duration(750);
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

    this.svg = d3.select('#chart-cotainer')
      .append('svg')
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('style', 'background: #222;');

    this.group = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')');

    // X Scale
    this.xScale = d3.scaleBand()
      .range([0, this.width])
      .paddingInner(0.3)
      .paddingOuter(0.3);

    // Y Scale
    this.yScale = d3.scaleLinear().range([this.height, 0]);

    // X Axis Group
    this.xAxisGroup = this.group.append('g')
      .attr('class', 'x axis')
      .attr('style', 'color: #777;');

    // Y Axis Group
    this.yAxisGroup = this.group.append('g')
      .attr('class', 'y-axis')
      .attr('style', 'color: #777;');

    // Y Label
    this.group.append('text')
      .attr('y', -30)
      .attr('x', -(this.height / 2))
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('fill', '#999')
      .text('R. Nadal VS R. Federer');

    d3.json('data.json').then(data => {

      let count = 1;
      let intet = setInterval(() => {
        if(count > 5) {
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
    this.xAxisGroup
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
    this.yAxisGroup
      .transition(this.trans)
      .call(yAxisCall);

    var rects = this.group.selectAll('rect').data(data);
    var circles = this.group.selectAll('circle').data(data);

    rects.exit().remove();
    circles.exit().remove();

    // Using merge method
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

    // without merge method

    // rects.transition(this.trans)
    //   .attr('x', (d, i) => {
    //     return this.xScale(d.point);
    //   })
    //   .attr('y', (d) => {
    //     if (d.rallylength > 0) {
    //       return this.yScale(d.rallylength);
    //     }
    //     return this.yScale(0);
    //   })
    //   .attr('height', (d) => {
    //     return Math.abs(this.yScale(d.rallylength) - this.yScale(0));
    //   })
    //   .attr('width', this.xScale.bandwidth)
    //   .attr('class', item => {
    //     return item.serveclass;
    //   });

    // circles.transition(this.trans)
    //   .attr('cx', (d, i) => {
    //     return this.xScale(d.point) + (this.xScale.bandwidth() / 2);
    //   })
    //   .attr('cy', (d) => {
    //     if (d.rallylength > 0) {
    //       return this.yScale(d.rallylength) - 20;
    //     }
    //     return this.yScale(0) + Math.abs(this.yScale(d.rallylength) - this.yScale(0)) - 20;
    //   })
    //   .attr('r', 13)
    //   .attr('class', item => {
    //     return item.serveclass;
    //   });

    // rects.enter()
    //   .append('rect')
    //   .attr('x', (d, i) => {
    //     return this.xScale(d.point);
    //   })
    //   .attr('y', this.yScale(0))
    //   .attr('height', 0)
    //   .attr('width', this.xScale.bandwidth)
    //   .attr('fill', item => {
    //     if (item.rallylength > 0) {
    //       return 'yellow';
    //     }
    //     return 'grey';
    //   })
    //   .attr('class', item => {
    //     return item.serveclass;
    //   })
    //   .transition(this.trans)
    //     .attr('y', (d) => {
    //       if (d.rallylength > 0) {
    //         return this.yScale(d.rallylength);
    //       }
    //       return this.yScale(0);
    //     })
    //     .attr('height', (d) => {
    //       return Math.abs(this.yScale(d.rallylength) - this.yScale(0));
    //     });

    // circles.enter()
    //   .append('circle')
    //   .attr('cx', (d, i) => {
    //     return this.xScale(d.point) + (this.xScale.bandwidth() / 2);
    //   })
    //   .attr('cy', (d) => {
    //     if (d.rallylength > 0) {
    //       return this.yScale(d.rallylength) - 20;
    //     }
    //     return this.yScale(0) + Math.abs(this.yScale(d.rallylength) - this.yScale(0)) - 20;
    //   })
    //   .attr('r', 0)
    //   .attr('fill', item => {
    //     if (item.rallylength > 0) {
    //       return 'yellow';
    //     }
    //     return 'red';
    //   })
    //   .attr('class', item => {
    //     return item.serveclass;
    //   })
    //   .transition(this.trans)
    //   .attr('r', 13);
  }
}

export default App;
