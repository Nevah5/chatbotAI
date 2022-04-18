import React, { Component } from 'react';
import './style.css';
import sendImage from './images/send.png'

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
        <div className='float' />
        <div className='chatfield'>
          <div className='chat'>
            <div className='message'>
              <div className='img' id='u' />
              <h5>User</h5>
              <p>What are you?</p>
            </div>
            <div className='message'>
              <div className='img' />
              <h5>Chatbot <i>(you)</i></h5>
              <p>I dont know.</p>
            </div>
          </div>
          <form className='input'>
            <input type="text" placeholder='Type a response here...' />
            <input type="submit" id="submit" value="." />
            <label for="submit"><img src={sendImage} alt="send" /></label>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default App;