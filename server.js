const app = require('./app');
const argv = require('minimist')(process.argv.slice(2));

const http = require('http');
const https = require('https');
const fs = require('fs');

const HTTP_PORT = 3030;
const HTTPS_PORT = 3031;

const startServer = (httpPort, httpsPort, sslOptions) => {
  const httpServer = http.createServer(app);
  httpServer.keepAliveTimeout = 60000 * 2;
  httpServer.listen(httpPort, () => {
    console.log('Express server now listening to http on port ' + httpPort)
  });

  const httpsServer = https.createServer(sslOptions, app);
  httpsServer.keepAliveTimeout = 60000 * 2;
  httpsServer.listen(httpsPort, () => {
    console.log('Express server now listening to https on port ' + httpsPort)
  });
};

var sslOptions;

if (argv['env'] === 'prod') {
  sslOptions = {
    key: fs.readFileSync(__dirname + '/credentials/prod.key'),
    cert: fs.readFileSync(__dirname + '/credentials/prod.crt')
  };

  startServer(HTTP_PORT, HTTPS_PORT, sslOptions);
} else {
  sslOptions = {
    key: fs.readFileSync(__dirname + '/credentials/dev.key'),
    cert: fs.readFileSync(__dirname + '/credentials/dev.crt'),
    passphrase: 'shareably',
  };

  startServer(HTTP_PORT, HTTPS_PORT, sslOptions);
}
