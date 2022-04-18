import React, { Component } from 'react';
import './style.css';
import svg from './images/logo.svg'

class App extends Component {
  state = {  }
  render() {
    return (
      <React.Fragment>
        <div className='header'>
          <div>
            <h1>Nevah5</h1>
            <h4>API</h4>
          </div>
          <h3>Nevah#0001</h3>
        </div>
        <img className='float' src={svg} alt="floating logo" />
      </React.Fragment>
    );
  }
}

export default App;