import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import './dist/rpgui.css';
// import './dist/rpgui.js';
const fetch = require('node-fetch');
const https = require('https');

const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
});

var appURL = 'https://app.eastus.cloudapp.azure.com:8000';

const Layout = ({children}) => {
    return (
        <div className="rpgui-content">
          <div className="rpgui-container framed rpgui-draggable" style={{
            height: "600px",
            width: "800px",
            top: "100px",
            left: "400px"
          }}>
          {children}
          </div>
        </div>
    );
}

class SessionView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            
        );
    }
}

class HeroList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heroList: props.heroList
        }
    }
    render() {
        var heroList = this.state.heroList
        return (
            <Layout>
                <p>please select one hero:</p>
                <select className="rpgui-list-imp" id="hero-select" size="20" style={{
                    width: "300px"
                }} onChange={this.props.selectHero}>
                    {heroList.map(hero => {
                        return (
                            <option key={hero.name} value={hero.name}>{hero.name}</option>
                        );
                    })}
                </select>
            </Layout>
        );
    }
}

class PassCode extends React.Component {
    constructor(props) {
        super(props);
        this.openLoginURL = this.openLoginURL.bind(this);
    }

    openLoginURL() {
        window.open('https://authz.eastus.cloudapp.azure.com:5555/login');
    }

    render() {
        return (
          <Layout>
            <a onClick={this.openLoginURL}>
              getPassCode
            </a>
            <p>enter your passcode:</p>
            <hr />
            <input type="text" name="id" placeholder="passcode" onChange={this.props.handlePassCode}/>
            <br/><br/>
            <button className="rpgui-button" type="button" onClick={this.props.handleSubmit} style={{width:"100%"}}><p>submit</p></button>
          </Layout>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heroList: [],
            passcode: "",
            idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM0MDdiM2JmZDYwM2MyYjcyMjhmNTZmM2YyM2M1NGM3NjgyNmIyZDEifQ.eyJpc3MiOiJodHRwczovL2RleC5lYXN0dXMuY2xvdWRhcHAuYXp1cmUuY29tOjU1NTYvZGV4Iiwic3ViIjoiQ2lRd09HRTROamcwWWkxa1lqZzRMVFJpTnpNdE9UQmhPUzB6WTJReE5qWXhaalUwTmpZU0JXeHZZMkZzIiwiYXVkIjoiZXhhbXBsZS1hcHAiLCJleHAiOjE2MTcwMDkyMTMsImlhdCI6MTYxNjkyMjgxMywiYXRfaGFzaCI6IlF4c1U0aHdrcm8xVnNXbm9qX05qaHciLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJhZG1pbiJ9.mvyOop50loZcb5sAn9wThDS4haIpg43YkLBOyaOXGXedDcPO5QHKQ0PAh0R3pR5DsD9U0t8E2CBGpBjlonntSRLJl3iy1kYWeXHaMxQHE1BNFkH-rbg6FFhDOzwdyhyupORp394LqR2k-boJABNgKP1AeF5KjLooESPtNF3hKhr0EwLsZN1IslTznpm5A8ER7pUKy97346TqPIfL5VY0rLWHcxyYp3-45mSQ6DiJBaN-XP1gouij1ru8nbRRz_LcJzlKRNbEYII9JL_h6OzwIxSwQ16pbsV-DAXn4q5eoA_oneWzwAt4UCQLF6ltvZAqmyyXTgQTPVrNBbUnfY5Xww",
            sessionView: null
        };
        this.handlePassCode = this.handlePassCode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadSession = this.loadSession.bind(this);
        this.listHeros = this.listHeros.bind(this);
        this.selectHero = this.selectHero.bind(this);
    }

    selectHero(event) {
        var idToken = this.state.idToken;
        var heroName = event.target.value.toString();
        fetch(appURL + '/session?hero=' + heroName, {
            headers: {"Authorization": "bearer "+idToken.toString()},
            method: 'PUT',
            agent: httpsAgent
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(json => this.setState({
                    sessionView: json
                }))
            }else if (res.status === 401){
                throw "token is expired"
            }
            // res.json()
        }).catch(_ => {
            this.setState({
                idToken: ""
            })
        })
    }

    listHeros() {
        var idToken = this.state.idToken;
        fetch(appURL + '/heros', {
            headers: {"Authorization": "bearer "+idToken.toString()},
            method: 'GET',
            agent: httpsAgent
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(json => this.setState({
                    heroList: json
                }))
            }else if (res.status === 401){
                throw "token is expired"
            }
            // res.json()
        }).catch(_ => {
            this.setState({
                idToken: ""
            })
        })
    }

    loadSession() {
        var idToken = this.state.idToken;
        fetch(appURL + '/session', {
            method: 'GET',
            headers: {"Authorization": "bearer "+idToken.toString()},
            agent: httpsAgent
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(json => this.setState({
                    sessionView: json
                }))
            }else if (res.status === 401){
                throw "token is expired"
            }
            // res.json()
        }).catch(_ => {
            this.setState({
                idToken: ""
            })
        })
    }

    handlePassCode(event) {
        this.setState({passcode: event.target.value});
    }

    handleSubmit(event) {
        var passcode = this.state.passcode;
        var url = 'https://authz.eastus.cloudapp.azure.com:5555/passcode?passcode=' + passcode.toString();
        fetch(url)
            .then(res => res.json())
            .then(json => 
                this.setState({idToken: json.id_token})
            )
    }
    // 
    render() {
        var idToken = this.state.idToken;
        if (idToken === null || idToken === undefined || idToken === "") {
            return (
                <PassCode handlePassCode={this.handlePassCode} handleSubmit={this.handleSubmit} />
            );
        }

        var sessionView = this.state.sessionView;
        if (sessionView === null) {
            this.loadSession();
            return (
                <Layout>
                    <p>loading...</p>
                </Layout>
            );
        }

        if (sessionView != null) {
            var heroList = this.state.heroList;
            if ((sessionView.hero.name === '' || sessionView.hero.name === null || sessionView.hero.name === undefined) && heroList.length === 0) {
                this.listHeros();
                return (
                    <Layout><p>fetching hero list...</p></Layout>
                );
            }else if ((sessionView.hero.name === '' || sessionView.hero.name === null || sessionView.hero.name === undefined) && heroList.length !== 0) {
                return (
                    <HeroList heroList={heroList} selectHero={this.selectHero} />
                );
            }

            return (
                <Layout>
                    <p>session loaded</p>
                </Layout>
              );
        }
    } // render
}
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

