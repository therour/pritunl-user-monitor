require('dotenv').config();

const requiredEnvs = ['PRITUNL_BASE_URL', 'PRITUNL_TOKEN', 'PRITUNL_SECRET', 'PRITUNL_ORG_ID'];
const undefinedEnvs = [];
for (const key of requiredEnvs) {
  if (! process.env[key]) {
    undefinedEnvs.push(key);
  }
}

if (undefinedEnvs.length > 0) {
  console.error('ERROR: Some environment variables is not set');
  console.log(`Please specify environment variables of ${undefinedEnvs.join(', ')}`);
  process.exit(2);
}

module.exports = {
  port: process.env.PORT || 5000,
  pritunlConf: {
    baseURL: process.env.PRITUNL_BASE_URL,
    token: process.env.PRITUNL_TOKEN,
    secret: process.env.PRITUNL_SECRET,
    organizationId: process.env.PRITUNL_ORG_ID,
  },
}
