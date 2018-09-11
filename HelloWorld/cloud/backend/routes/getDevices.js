var express = require('express');
var router = express.Router();
var _ = require('lodash');
const KNoTCloud = require('knot-cloud');

async function getOnlineDevices(cloud, devices) {

  let onlineDevices = _.map(_.filter(devices, 'online'), async function(device) {
    let data = await cloud.getData(device.id);
    device['sensorid'] = data[0].data.sensor_id;
    device['value'] = data[0].data.value;
    return device;
  })
  return(Promise.all(onlineDevices));
}

router.get('/', async function(req, res) {
  const cloud = new KNoTCloud(
    req.headers.meshblu_host,
    req.headers.meshblu_port,
    req.headers.meshblu_auth_uuid,
    req.headers.meshblu_auth_token
  );

  try {
    await cloud.connect();
    let devices = await cloud.getDevices();
    let onlineDevices = await getOnlineDevices(cloud, devices);
    await cloud.close();
    res.status(200).send(onlineDevices);
  } catch (err) {
    let result = err;
    error = true;
    console.log(result);
    res.status(400).send(result);
  }
});

module.exports = router;