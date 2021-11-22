const axios = require('axios').default;
const uuid = require('uuid');
const crypto = require("crypto")

function buildHttpClient() {
  const client = axios.create({
    baseURL: this.baseURL,
  });

  client.interceptors.request.use((config) => {
    const authTimestamp = Math.floor(Date.now() / 1000);
    const nonce = uuid.v4().substring(0, 32);
    const authString = [this.token, authTimestamp, nonce, config.method.toUpperCase(), config.url].join('&');
    const hash = crypto.createHmac("sha256", this.secret).update(authString).digest("base64");

    config.headers = {
      "Auth-Token": this.token,
      "Auth-Timestamp": authTimestamp,
      "Auth-Nonce": nonce,
      "Auth-Signature": hash
    };

    return config;
  });

  return client;
}

module.exports = class Pritunl {
  constructor({ baseURL, token, secret, organizationId }) {
    this.baseURL = baseURL;
    this.token = token;
    this.secret = secret;
    this.organizationId = organizationId;
    this.httpClient = buildHttpClient.bind(this)();
  }

  async getDeviceList(organizationId) {
    // const response = await this.httpClient.get(`/user/${this.organizationId}`);
    const response = await this.httpClient.get(`/user/${organizationId}`);
    const devices = response.data
      .filter(d => d.type === 'client')
      .map((device) => ({
        name: device.name.substring(17) || '-',
        ip_address: device.servers[0].virt_address,
        real_address: device.servers[0].real_address,
        status: device.servers[0].status,
        connected_since: device.servers[0].connected_since,
      }));

    return devices;
  }

  async getOrganizationList() {
    const response = await this.httpClient.get(`/organization`);
    const organizations = response.data.map(org => ({
      id: org.id,
      name: org.name,
      count: org.user_count,
      is_default: org.id === this.organizationId,
    }));

    return organizations;
  }
}
