import React, { Component } from "react";
import "./style.css";
import sendImage from "./images/send.png";
const url = "https://api.nevah5.com";

class App extends Component {
  state = {
    messages: [],
    toastState: "none",
    delay: true,
    loading: true,
    lastQuestion: "",
  };

  render() {
    return (
      <React.Fragment>
        <div className="header">
          <div>
            <h1>Nevah5</h1>
            <h4>API</h4>
          </div>
          <h3>Nevah#0001</h3>
        </div>
        <div className="float" />
        <div className="chatfield">
          <div className="chat">
            {this.state.messages.map((msg, index) => (
              <div className="message" key={index}>
                <div className="img" id={msg.user !== "you" ? "u" : ""} />
                <h5>
                  {msg.user === "you" ? (
                    <React.Fragment>
                      Chatbot <i>(you)</i>
                    </React.Fragment>
                  ) : (
                    "User"
                  )}
                </h5>
                <p>{msg.message}</p>
              </div>
            ))}
            {this.state.loading ? (
              <div className="message" id="loading">
                <div className="img" id="u" />
                <h5>User</h5>
                <p></p>
              </div>
            ) : (
              ""
            )}
          </div>
          <form className="input" onSubmit={this.sendMessage}>
            <input type="text" placeholder="Type a response here..." />
            <input type="submit" name="message" id="submit" value="." />
            <label htmlFor="submit">
              <img src={sendImage} alt="send" />
            </label>
          </form>
        </div>
        <div className="toast" style={{ display: this.state.toastState }}>
          <span>You are sending messages to fast!</span>
        </div>
      </React.Fragment>
    );
  }

  componentDidMount() {
    this.apiRequest();
  }

  apiRequest = async (_) => {
    this.setState({ loading: true });
    let response = await fetch(`${url}/train/question`);
    let data = await response.json();

    this.setState({
      messages: [
        ...this.state.messages,
        { user: "user", message: data.question },
      ],
    });

    this.setState({
      delay: false,
      loading: false,
      lastQuestion: data.question,
    });
  };
  sendMessage = async (event) => {
    let message = document.querySelector('form.input input[type="text"]').value;
    event.preventDefault();
    if (this.message === null) return;
    if (this.state.delay) {
      this.setState({ toastState: "initial" });
      setTimeout((_) => {
        this.setState({ toastState: "none" });
      }, 4000);
      return;
    }

    this.setState({
      messages: [...this.state.messages, { user: "you", message }],
    });

    //send answer back to api
    await fetch(`${url}/train`, {
      method: "POST",
      headers: {
        question: this.state.lastQuestion,
        answer: message,
      },
    });

    //add delay to input
    this.setState({ delay: true });

    this.apiRequest();
    //clear
    document.querySelector('form.input input[type="text"]').value = "";
  };
}

export default App;
