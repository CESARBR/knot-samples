import React, { Component } from 'react';
import './App.css';
import _ from 'lodash'
import { Icon } from 'semantic-ui-react'
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3002');

class App extends Component {
  constructor() {
    super();
    this.state = {
      result: []
    };
    this.getDevices = this.getDevices.bind(this);
    this.showDevice = this.showDevice.bind(this);
    this.createDeviceList = this.createDeviceList.bind(this);
    this.switchStatus = this.switchStatus.bind(this);
    this.updateDevice = this.updateDevice.bind(this);
  }

  updateDevice(device) {
    const request = {
      meshblu_auth_uuid: this.state.uuid,
      meshblu_auth_token: this.state.token,
      meshblu_host: this.state.host || 'knot-test.cesar.org.br',
      meshblu_port: this.state.port || '3000',
    };

    request['deviceid'] = device.id;
    socket.on(device.id, function(response) {
      let tmp = this.state.devices;
      let i = tmp.findIndex((element, index, array) => {
        return element.id === response.source
      });

      tmp[i].value = response.data.value;

      this.setState({
        devices: tmp
      })
    }.bind(this)
  );
    socket.emit('subscribe', request);
  }

  switchStatus(deviceid, sensorid, value) {
    let myHeaders = new Headers({
      "meshblu_auth_uuid": this.state.uuid,
      "meshblu_auth_token": this.state.token,
      "meshblu_host": this.state.host || 'knot-test.cesar.org.br',
      "meshblu_port": this.state.port || '3000',
      "deviceid": deviceid,
      "sensorid": sensorid,
    });
    myHeaders.append('value', value ? 'false' : 'true');

    var myInit = { method: 'GET',
               headers: myHeaders};
    fetch('setdata', myInit)
  }

  showDevice(device) {
    return(
      <div className='online-device' id={device.id} key={device.id}>
        <div className='device-info'>
          <div className='device-name'>
            {device.name}
          </div>
          <div className='device-id'>
            {device.id}
          </div>
        </div>
        <div className='device-value'>
          {device.value ? <Icon name='lightbulb outline' color='yellow' size='massive' /> : <Icon name='lightbulb' color='black' size='massive' />}
        </div>
        <button className='switch' onClick={()=>this.switchStatus(device.id, device.sensorid, device.value)}>
          CHANGE VALUE
        </button>
      </div>
    );
  }

  createDeviceList() {
    console.log(this.state.devices);
    return (
      <div id='online-devices'>
        <h1 className='online-devices-header'>
          ONLINE DEVICES
        </h1>
        {_.map(this.state.devices, this.showDevice)}
      </div>
    );
  };

  getDevices() {
    if(!this.state.uuid){
      window.alert('UUID is mandatory');
      return;
    }
    if (!this.state.token) {
      window.alert('TOKEN is mandatory')
      return;
    }

    let myHeaders = new Headers({
      "meshblu_auth_uuid": this.state.uuid,
      "meshblu_auth_token": this.state.token,
      "meshblu_host": this.state.host || 'knot-test.cesar.org.br',
      "meshblu_port": this.state.port || '3000'
    });

    var myInit = { method: 'GET',
               headers: myHeaders};

    this.setState({
    headers: myHeaders
    });

    fetch('getdevices', myInit)
    .then(response => response.json())
    .then(json => {
      this.setState({
        devices: json
      })
      _.map(json,this.updateDevice)
    });
  }

  render() {
    const devices = this.state.devices;
    return (
      <div className="App">
        <div className='header-wrapper'>
          <header className="App-header">
            <h1 className="App-title">Welcome to KNoT</h1>
          </header>
        </div>
        <div className="knot-info-wrapper">
          <div className="knot-info">
            <label htmlFor='host'> MESHBLU HOST </label>
            <input type='text' id='host' className='knot-info-text' placeholder='knot-test.cesar.org.br'  onChange={(e)=> this.setState({host:e.target.value})}/>
          </div>
          <div className="knot-info">
            <label htmlFor='port'> MESHBLU PORT </label>
            <input type='text' id='port' className='knot-info-text' placeholder='3000' onChange={(e)=> this.setState({port:e.target.value})}/>
          </div>
          <div className="knot-info">
            <label htmlFor='uuid'> UUID </label>
            <input type='text' id='uuid'className='knot-info-text' onChange={(e)=> this.setState({uuid:e.target.value})}/>
          </div>
          <div className="knot-info">
            <label htmlFor='token'> TOKEN </label>
            <input type='text' id='token' className='knot-info-text' onChange={(e)=> this.setState({token:e.target.value})}/>
          </div>
          <button className='btn' onClick={this.getDevices}>
          GET DEVICES
          </button>
          </div>
        <div className='list-devices-wrapper'>
          {_.isEmpty(devices) ? <div/> : <this.createDeviceList className='list-devices' />}
        </div>
      </div>
    );
  }
}

export default App;