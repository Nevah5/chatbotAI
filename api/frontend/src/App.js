import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import sendImage from './images/send.png'

class App extends Component {
  messages = []
  delay = false
  state = { toastState : "none" }
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
          <form className='input' onSubmit={this.sendMessage}>
            <input type="text" placeholder='Type a response here...' />
            <input type="submit" name="message" id="submit" value="." />
            <label htmlFor='submit'><img src={sendImage} alt="send" /></label>
          </form>
        </div>
        <div className='toast' style={{display: this.state.toastState}}>
          <span>You are sending messages to fast!</span>
        </div>
      </React.Fragment>
    );
  }

  sendMessage = event => {
    let message = document.querySelector('form.input input[type="text"]').value
    event.preventDefault()
    if(this.message === "") return
    if(this.delay) {
      this.setState({toastState: "initial"})
      setTimeout(_ => {
        this.setState({toastState: "none"})
      }, 4000)
      return
    }

    let chatfield = ReactDOM.createRoot(document.querySelector('.chatfield .chat'))
    this.messages.push({user: "you", message})

    chatfield.render(
      <React.Fragment>
        {this.messages.map(msg => (
          <div className='message'>
            <div className='img' />
            <h5>{msg.user === "you" ? <React.Fragment>Chatbot <i>(you)</i></React.Fragment> : "User"}</h5>
            <p>{msg.message}</p>
          </div>
        ))}
      </React.Fragment>
    )

    //add delay to input
    this.delay = true

    //TODO: make api request

    //clear
    document.querySelector('form.input input[type="text"]').value = ""
  }
}



export default App;