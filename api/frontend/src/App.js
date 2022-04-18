import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import sendImage from './images/send.png'

class App extends Component {
  messages = []
  delay = true
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
            <div className='message' id="loading">
              <div className='img' id='u' />
              <h5>User</h5>
              <p></p>
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

  componentDidMount(){
    this.apiRequest()
  }

  apiRequest = async _ => {
    let response = await fetch('https://api.geeler.net/question')
    let data = await response.json()

    this.messages.push({user: "user", message: data.question})

    this.delay = false

    this.renderChat()
  }
  sendMessage = event => {
    let message = document.querySelector('form.input input[type="text"]').value
    event.preventDefault()
    if(this.message === null) return
    if(this.delay) {
      this.setState({toastState: "initial"})
      setTimeout(_ => {
        this.setState({toastState: "none"})
      }, 4000)
      return
    }

    this.messages.push({user: "you", message})

    this.renderChat(true)

    //add delay to input
    this.delay = true

    this.apiRequest()

    //clear
    document.querySelector('form.input input[type="text"]').value = ""
  }

  renderChat = (loading) => {
    let chatfield = ReactDOM.createRoot(document.querySelector('.chatfield .chat'))
    chatfield.render(
      <React.Fragment>
        {this.messages.map((msg, index) => (
          <div className='message' key={index}>
            <div className='img' id={msg.user !== "you" ? "u" : ""} />
            <h5>{msg.user === "you" ? <React.Fragment>Chatbot <i>(you)</i></React.Fragment> : "User"}</h5>
            <p>{msg.message}</p>
          </div>
        ))}
        {
          loading ?
          <div className='message' id='loading'>
            <div className='img' id="u" />
            <h5>User</h5>
            <p></p>
          </div>
          :
          ""
        }
      </React.Fragment>
    )
  }
}



export default App;