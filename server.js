const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

const HOST = process.env.HOST || 'localhost';

app.use(express.static(__dirname + '/public'));

app.get('/*', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, HOST, () => console.log('node server is running at ' + HOST + ':' + PORT));