import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './dist/rpgui.css';
const fetch = require('node-fetch');
const https = require('https');

const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
});

var appURL = 'app.eastus.cloudapp.azure.com';

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
          <div className="rpgui-container framed rpgui-draggable" style={{
            height: "350px",
            width: "290px",
            top: "50px",
            left: "350px"
          }}>
            <a onClick={this.openLoginURL}>
              getPassCode
            </a>
            <p>enter your passcode:</p>
            <hr />
            <input type="text" name="id" placeholder="passcode" onChange={this.props.handlePassCode}/>
            <br/><br/>
            <button className="rpgui-button" type="button" onClick={this.props.handleSubmit} style={{width:"100%"}}><p>submit</p></button>
          </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passcode: "",
            idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ5ZTAwYTVlZjgzMGUwMWJjM2YzZGZlOTYxMzMzYWNmNDYyYTU3NjQifQ.eyJpc3MiOiJodHRwczovL2RleC5lYXN0dXMuY2xvdWRhcHAuYXp1cmUuY29tOjU1NTYvZGV4Iiwic3ViIjoiQ2lRd09HRTROamcwWWkxa1lqZzRMVFJpTnpNdE9UQmhPUzB6WTJReE5qWXhaalUwTmpZU0JXeHZZMkZzIiwiYXVkIjoiZXhhbXBsZS1hcHAiLCJleHAiOjE2MTY5NDYzNjEsImlhdCI6MTYxNjg1OTk2MSwiYXRfaGFzaCI6ImNRZmZCNDk4UExEd21GUHdid0tZZWciLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJhZG1pbiJ9.Fv-2O2wfL_pKi4i-I2Q1l9-BBCFgib4fK0l24bbS0SPLvXNdm6r5j0CImc1Hve6u_HEK8kCI8eMYymWO8-x3Rrpv7F4V-oeRJ3zby6dH8xde-Est1yAoBEF5JxMvh-wkoMASU-N7-fBVJWPCmsImfW7mROugY-xP4niC56yGIMUAr3RW4nPRwWxAgyYHBYbGj7LMDXp0vfqD6HPAV9yYMjaYWDqVSZl8iz7tSUCHO_lA75-KDJ846OcgwdO_m9TywmF7j02lsUrZc1h-_TQtmJjZsqgDstLbpGPyMOEwUnz2_vG-5bcSryEgP_U4r2AGROht5HtyeWt5er9Ar9y9Lw",
            sessionView: null
        };
        this.handlePassCode = this.handlePassCode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadSession = this.loadSession.bind(this);
    }

    loadSession() {
        // process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        const idToken = this.state.idToken;
        // const request = https.request({
        //     host: appURL,
        //     port: 8000,
        //     path: '/session',
        //     method: 'GET',
        //     rejectUnauthorized: false,
        //     requestCert: false
        // }, function(res){
        //     request.on('data', (data) => {
        //         const json = JSON.parse(data);
        //         this.setState({
        //             sessionView: json
        //         })
        //     });
        // });
        // request.end();
        // TODO: fix net::ERR_CERT_AUTHORITY_INVALID

        fetch(appURL + '/session', {
            Headers: {"Authorization": "bearer "+idToken.toString()},
            method: 'GET',
            agent: httpsAgent,
        })
        .then(res => res.json())
        .then(json => this.setState({sessionView: json}))
    }

    handlePassCode(event) {
        this.setState({passcode: event.target.value});
    }

    handleSubmit(event) {
        const passcode = this.state.passcode;
        var url = 'https://authz.eastus.cloudapp.azure.com:5555/passcode?passcode=' + passcode.toString();
        fetch(url)
            .then(res => res.json())
            .then(json => 
                this.setState({idToken: json.id_token})
            )
    }
    // 
    render() {
        const idToken = this.state.idToken;
        if (idToken === null || idToken === undefined || idToken === "") {
            return (
                <div className="rpgui-content">
                    <PassCode handlePassCode={this.handlePassCode} handleSubmit={this.handleSubmit} />
                </div>
            );
        }

        const sessionView = this.state.sessionView;
        if (sessionView === null) {
            this.loadSession();
        }

        return (
          <div className="rpgui-content">
            <p>{sessionView}</p>
          </div>
        );
    } // render
}
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

