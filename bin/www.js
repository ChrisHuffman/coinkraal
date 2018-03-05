var app = require('../server/server');

var port = process.env.port || 1337

app.listen(port, function() {
 console.log('running at localhost: ' + port);
});