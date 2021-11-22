const express = require('express');
const Pritunl = require('./pritunl');
const http = require('http');
const path = require('path');
const config = require('./config');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pritunl = new Pritunl(config.pritunlConf);

app.get('/api/devices/:organizationId', async (req, res) => {
  const organizationId = req.params.organizationId;
  const devices = await pritunl.getDeviceList(organizationId);
  res.json({ message: 'OK', data: devices });
});

app.get('/api/organizations', async (req, res) => {
  const data = await pritunl.getOrganizationList();
  res.json({ message: 'OK', data });
})

app.use(express.static(path.join(__dirname, '..', 'build')));

http.createServer(app).listen(config.port, () => {
  console.log('Server listening on port', config.port);
});
