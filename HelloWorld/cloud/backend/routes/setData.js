var express = require('express');
var router = express.Router();
const KNoTCloud = require('knot-cloud');

router.get('/', async function(req, res) {
  let { deviceid } = req.headers;
  let { sensorid } = req.headers;
  let { value } = req.headers;

  const cloud = new KNoTCloud(
    req.headers.meshblu_host,
    req.headers.meshblu_port,
    req.headers.meshblu_auth_uuid,
    req.headers.meshblu_auth_token
  );
  try {
    await cloud.connect();
    let data = [{
      'sensorId': parseInt(sensorid),
      'value': value
    }];
    await cloud.setData(deviceid, data);
    await cloud.close;
    res.send('OK');
  } catch (err) {
    let result = err;
    error = true;
    console.log(result);
    res.status(400).send(result);
  }
});

module.exports = router;