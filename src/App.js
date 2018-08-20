import React, { Component } from 'react';
import logo from './logo.svg';
import MatchChart from './MatchChart'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Manhattan POC</h1>
        </header>
        <MatchChart />
      </div>
    );
  }
}

export default App;
