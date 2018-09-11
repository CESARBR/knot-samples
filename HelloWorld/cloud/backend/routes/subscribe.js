module.exports = function(io) {
  var express = require("express");
  var router = express.Router();
  const KNoTCloud = require('knot-cloud');



  io.on('connection', function(client) {
    client.on('subscribe', async function (req) {
    const { meshblu_host } = req;
    const { meshblu_port } = req;
    const { meshblu_auth_uuid } = req;
    const { meshblu_auth_token } = req;
    const { deviceid } = req;

    const cloud = new KNoTCloud(
      meshblu_host,
      meshblu_port,
      meshblu_auth_uuid,
      meshblu_auth_token
    );

    try {
      await cloud.connect();
      await cloud.subscribe(deviceid);

      cloud.on((data) => {
        client.emit(deviceid, data)
      });

    } catch (err) {
      let result = err;
      error = true;
      console.log(result);
    }
  });
});

  return router;
}