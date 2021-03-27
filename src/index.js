import React from 'react';
import ReactDOM from 'react-dom';
import useFetch from 'use-http'
import './index.css';
import './dist/rpgui.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = props.handleChange.bind(this);
        this.handleSubmit = props.handleSubmit.bind(this);
    }

    render() {
        return (
  <div class="rpgui-container framed rpgui-draggable" style={{
      height: "350px",
      width: "290px",
      top: "50px",
      left: "350px"
  }}>
    <p>enter your email:</p>
    <hr />
    {/* style="height:350px; width:290px; top: 50px; left: 350px;" */}

    <input type="number" name="id" placeholder="ID" onChange={this.handleChange}/>
    <br/><br/>

    <script src="lib/list.js"></script>
    <button class="rpgui-button" type="button" onClick={this.handleSubmit} style={{width:"100%"}}><p>submit</p></button>
  </div>
        );
    }
}

  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            login: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({id: event.target.value});
    }

    handleSubmit(event) {
        this.setState({login: true})
    }

    render() {
        return (
          <div class="rpgui-content">
            {!this.state.login ? <Login handleChange={this.handleChange} handleSubmit={this.handleSubmit}/> : null}
          </div>
        );
    }
}
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  
function loadSession(id) {
    const { get, post, response, loading, error } = useFetch('http://127.0.0.1')
    get("/heros")
}
