const cors = require('cors');

var allowlist = ['*', 'http://localhost:3000', 'https://vercel.app', 'https://test-app-nu-one.vercel.app']
var corsOptions = {
    credentials: true,
    origin: allowlist,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

module.exports = cors(corsOptions);
