import React, { Component } from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { setChromeLocalStore, getChromeLocalStore } from '../../utils/settings';
export default class EyesNotify extends Component {
  constructor(props) {
    super(props);
    this.state = { timer: 30 };
    this.notiInterval = setInterval(() => {
      getChromeLocalStore(['globalClosed']).then((value) => { // somewhat inefficient
        if (value.globalClosed) {
          unmountComponentAtNode(document.getElementById('voz-eyes-notify'));
          setTimeout(() => { setChromeLocalStore({ globalClosed: false }); }, 2000);
        }
      });
      if (this.state.timer > 0) {
        this.setState({ timer: this.state.timer - 1 });
      } else {
        unmountComponentAtNode(document.getElementById('voz-eyes-notify'));
      }
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.notiInterval);
  }

  openSettings(e) {
    e.preventDefault();
    chrome.runtime.sendMessage({ service: 'open-options' });
    return false;
  }

  render() {
    return (
            <div className="voz-bao-ve-mat">
              <div
                style={{
                  position: 'fixed',
                  height: '100%',
                  width: '100%',
                  top: 0,
                  zIndex: 9999,
                  background: 'rgba(0, 0, 0, 0.8)',
                  fontSize: '15px',
                }}
              />
              <div
                style={{
                  textAlign: 'center',
                  padding: '50px',
                  backgroundColor: '#4286f4',
                  color: 'white',
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10000,
                  fontSize: '15px',
                }}
              >
                <strong> Vì một đôi mắt khoẻ mạnh, các thím hãy cùng nhau không nhìn vào máy tính trong lúc này
                nào! </strong>
                <img style={{ verticalAlign: 'middle' }} src="/images/smilies/Off/byebye.gif" />
                <img style={{ verticalAlign: 'middle' }} src="/images/smilies/Off/matrix.gif" />
                <img style={{ verticalAlign: 'middle' }} src="/images/smilies/Off/matrix.gif" />
                <br />
                <strong> Thông báo này sẽ tự tắt sau </strong>
                <strong className="dem-nguoc">{this.state.timer} giây</strong>
                <div style={{ fontSize: '9px' }}>Bạn có thể tắt thông báo tại <a href="#" onClick={this.openSettings}>menu cài đặt voz living</a></div>
                <div
                  className="eyes-close"
                  onClick={() => {
                    setChromeLocalStore({ globalClosed: true });
                    unmountComponentAtNode(document.getElementById('voz-eyes-notify'));
                  }} style={{
                    position: 'absolute',
                    width: '150px',
                    height: '50px',
                    backgroundColor: 'green',
                    right: 0,
                    bottom: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >Tắt thông báo
                </div>
              </div>
            </div>
        );
  }
}
