import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import './dist/rpgui.css';
import './dist/rpgui.js';
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
            width: "900px",
            top: "100px",
            left: "200px"
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
        var sessionView = this.props.sessionView;
        var level = sessionView.session.current_level;
        var heroHP = sessionView.session.live_hero_blood / sessionView.hero.blood;
        var bossHP = sessionView.session.live_boss_blood / sessionView.boss.blood;
        return (
            <Layout>
                <div>
                    <p>level: {level}</p>
                </div>
                <label>{sessionView.hero.name}</label>
                <div className="rpgui-progress-left-edge"></div>
                <div id="hero-hp-bar" className="rpgui-progress-track" style={{
                    width: "200px"
                }}>
                    <div id="hero-hp-bar-fill" className="rpgui-progress-fill green" value={heroHP} style={{
                        left: "0px",
                        width: heroHP * 100 + "%"
                    }}></div>
                </div>
                <div className="rpgui-progress-right-edge" style={{
                    left: "240px"
                }}></div>

                <label style={{
                    position: "absolute",
                    left: "530px"
                }}>{sessionView.boss.name}</label>
                <div className="rpgui-progress-left-edge" style={{
                    left: "520px"
                }}></div>
                <div id="boss-hp-bar" className="rpgui-progress-track" style={{
                    left: "560px",
                    width: "200px"
                }}>
                    <div id="boss-hp-bar-fill" className="rpgui-progress-fill red" value={bossHP} style={{
                        left: "0px",
                        width: bossHP * 100 + "%"
                    }}></div>
                </div>
                <div className="rpgui-progress-right-edge" style={{
                    left: "760px"
                }}></div>

                <br/><br/><br/><br/><br/>
                <div className="rpgui-icon sword" style={{
                    left: "20px",
                    width: "32px",
                    height: "32px"
                }}>{sessionView.hero.attack_power}</div>
                <div className="rpgui-icon shield" style={{
                    left: "80px",
                    width: "32px",
                    height: "32px"
                }}>{sessionView.hero.defense_power}</div>

                <div className="rpgui-icon sword" style={{
                    left: '540px',
                    width: "32px",
                    height: "32px"
                }}>{sessionView.boss.attack_power}</div>
                <div className="rpgui-icon shield" style={{
                    left: "600px",
                    width: "32px",
                    height: "32px"
                }}>{sessionView.boss.defense_power}</div>

                <br/><br/><br/><br/><br/><br/>
                <button className="rpgui-button" type="button" onClick={this.props.fight}><p>Fight</p></button>
				<button className="rpgui-button" type="button" onClick={this.props.newGame}><p>New Game</p></button>
                <button className="rpgui-button" type="button" onClick={this.props.save}><p>Save</p></button>
                <button className="rpgui-button" type="button" onClick={this.props.quit}><p>Quit</p></button>
            </Layout>
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
            // TODO remove this when code done
            idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImIxNTg0MjQ4YzE4MDdhNjI5ZmVjNTFjYzZjOTc4N2Q4OTI4ZjhjNGEifQ.eyJpc3MiOiJodHRwczovL2RleC5lYXN0dXMuY2xvdWRhcHAuYXp1cmUuY29tOjU1NTYvZGV4Iiwic3ViIjoiQ2dnME5EQXhNamN6TkJJR1oybDBhSFZpIiwiYXVkIjoiZXhhbXBsZS1hcHAiLCJleHAiOjE2MTcwNzU2NDEsImlhdCI6MTYxNjk4OTI0MSwiYXRfaGFzaCI6ImN1MFZNOElIM0dCYlRTbk9KZlB2R2ciLCJlbWFpbCI6InRpYW5xaXVodWFuZ0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZ3JvdXBzIjpbIm5ldy1hZHZlbnR1cmUtYWVyb2xpdGU6YWRtaW4iLCJuZXctYWR2ZW50dXJlLWFlcm9saXRlOmRldmVsb3BlciJdLCJuYW1lIjoiQW5odWktdHFodWFuZyIsInByZWZlcnJlZF91c2VybmFtZSI6IkFuaHVpLXRxaHVhbmcifQ.y00dCt4PBqwc_iUg3KEn-OidxnKLyqdAsVaeRxntunnsoVbGElMt0Q7mLFFviOW1mwkt_3OP5X8Kj9asepUyBZPFx0iH1ByzSuy5ssxv5ukIA2Mt_-06QYYv2tAEbskXbxdpTMWJWQUytv8_1duBlEb0BCUB3GNTiOMCzWD1tfyBgM3SziWcO5x5w_hAULVB6oVOhNk2fjj9q875HLrxVuIg7yFj5rjByTjD-xDlG6Obb9ny_irGWp3DtIfkCUzuHJaPYfe_h5Oswo_O0HM4hlVRi0_3CKGeYuZywEID-Fp6Sf29EVINsUBTOhbPskrDQ_hn5I3pQYczKmvtodXtKg",
            sessionView: null
        };
        this.handlePassCode = this.handlePassCode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadSession = this.loadSession.bind(this);
        this.listHeros = this.listHeros.bind(this);
        this.selectHero = this.selectHero.bind(this);
        this.newGame = this.newGame.bind(this);
        this.quit = this.quit.bind(this);
        this.save = this.save.bind(this);
        this.fight = this.fight.bind(this);
        this.nextLevel = this.nextLevel.bind(this);
    }

    nextLevel() {
        var sessionView = this.state.sessionView;
        var level = sessionView.session.current_level;
        if (level === 2) {
            alert("you passed the game");
            this.newGame();
            return
        }
        var idToken = this.state.idToken;
        fetch(appURL + '/session/level', {
            headers: {"Authorization": "bearer "+idToken.toString()},
            method: 'POST',
            agent: httpsAgent
        })
        .then(res => {
            if (res.status === 200) {
                this.loadSession();
            }else if (res.status === 401){
                throw "token is expired"
            }else if (res.status >= 500){
                res.json().then(json => {
                    if (json.error.toString().includes("404")) {
                        alert("you passed the game");
                        this.setState({
                            heroList: [],
                            passcode: "",
                            idToken: "",
                            sessionView: null
                        })
                    }
                })
            }
        }).catch(_ => {
            this.setState({
                idToken: ""
            })
        })
    }

    fight() {
        var idToken = this.state.idToken;
        fetch(appURL + '/session/fight', {
            headers: {"Authorization": "bearer "+idToken.toString()},
            method: 'PUT',
            agent: httpsAgent
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(json => {
                    if (json.game_over) {
                        alert("game over");
                        this.newGame();
                    }else if (json.next_level) {
                        this.nextLevel();
                    }else{
                        var sessionView = this.state.sessionView;
                        var session = sessionView.session;
                        session.live_hero_blood = json.hero_blood;
                        session.live_boss_blood = json.boss_blood;
                        sessionView.session = session;
                        this.setState({
                            sessionView: sessionView
                        })
                    }
                })
            }else if (res.status === 401){
                throw "token is expired"
            }
            // }else if (res.status === 500){
            //     alert("you passed, goodbye")
            //     this.setState({
            //         heroList: [],
            //         passcode: "",
            //         idToken: "",
            //         sessionView: null
            //     })
            // }
        }).catch(_ => {
            this.setState({
                idToken: ""
            })
        })
    }

    save() {
        var idToken = this.state.idToken;
        fetch(appURL + "/session/archive", {
            headers: {"Authorization": "bearer "+idToken.toString()},
            method: 'POST',
            agent: httpsAgent
        })
        .then(res => {
            if (res.status === 200) {
                alert("game saved")
            }else if (res.status === 401){
                throw "token is expired"
            }
        }).catch(_ => {
            this.setState({
                idToken: ""
            })
        })
    }

    quit() {
        var idToken = this.state.idToken;
        fetch(appURL + '/session/quit', {
            headers: {"Authorization": "bearer "+idToken.toString()},
            method: 'POST',
            agent: httpsAgent
        })
        .then(res => {
            if (res.status === 200) {
                this.setState({
                    heroList: [],
                    passcode: "",
                    idToken: "",
                    sessionView: null
                })
            }else if (res.status === 401){
                throw "token is expired"
            }
        }).catch(_ => {
            this.setState({
                idToken: ""
            })
        })
    }

    newGame() {
        var idToken = this.state.idToken;
        fetch(appURL + "/session/clear", {
            headers: {"Authorization": "bearer "+idToken.toString()},
            method: 'POST',
            agent: httpsAgent
        })
        .then(res => {
            if (res.status === 200) {
                this.setState({
                    heroList: [],
                    passcode: "",
                    idToken: "",
                    sessionView: null
                })
            }else if (res.status === 401){
                throw "token is expired"
            }
        }).catch(_ => {
            this.setState({
                idToken: ""
            })
        })
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
                <SessionView 
                    sessionView={sessionView} 
                    newGame={this.newGame} 
                    quit={this.quit} 
                    save={this.save}
                    fight={this.fight}
                />
            );
        }
    } // render
}
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

