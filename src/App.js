import React, { Component } from 'react';
import SpotifyLogin from 'react-spotify-login';
import { clientId, redirectUri, scope } from './settings';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (authData && authData.expiryTime > Date.now()) {
      this.state = {
        expiryTime: authData.expiryTime,
        accessToken: authData.accessToken,
        data: null
      };
    } else {
      this.state = {
        expiryTime: null,
        accessToken: null,
        data: null
      };
      if (authData) {
        localStorage.removeItem('authData');
      }
    }
  }
  componentDidMount() {
    const { accessToken } = this.state;
    if (!accessToken) {
      return;
    }
    fetch(`https://api.spotify.com/v1/search?q=Parachutes&type=album`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  }
  onSuccess = ({ access_token, expires_in }) => {
    const expiryTime = Date.now() + 1000 * Number(expires_in);
    const data = { accessToken: access_token, expiryTime };
    console.log('success', access_token, expires_in, data);
    localStorage.setItem('authData', JSON.stringify(data));
    this.setState({ ...this.state, ...data });
  }
  onFailure = err => {
    console.error(err);
  }
  render() {
    const { accessToken, data } = this.state
    let display
    if(accessToken) {
      display = data && <p>{ JSON.stringify(data) }</p>;
    }
    return (
      <div className="App">
        {accessToken
        ? <div>
            <p>Token: {accessToken}</p>
          </div>
        : <SpotifyLogin
          clientId={clientId}
          redirectUri={redirectUri}
          scope={scope}
          onSuccess={this.onSuccess}
          onFailure={this.onFailure} />}
        {display}
      </div>
    );
  }
}

export default App;
