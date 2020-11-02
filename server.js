const express = require('express');
const app = express();

const port = process.env.PORT || 8000;

const host = process.env.HOST || '';

app.use(express.static(__dirname + '/public'));

app.get('/*', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, host, () => console.log('************'));