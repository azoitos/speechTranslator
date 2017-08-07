const express = require('express');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const path = require('path');
var socketio = require('socket.io');

const app = express();

app.use(volleyball);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

const server = app.listen(3000, () => {
	console.log('here on port ' + server.address().port);
});

app.use('/', require('./route'))


var io = socketio(server);

io.on('connection', function (socket) {
	console.log('A new socket has connected', socket.id);

	socket.on('onEnglish', function (data) {
		socket.broadcast.emit('onEnglish', data)
	})

	socket.on('onJapanese', function (data, speechData) {
		socket.broadcast.emit('onJapanese', data, speechData)
	})

	// socket.on('onSpeak', function (data) {
	// 	socket.broadcast.emit('onSpeak', data)
	// })

	socket.on('disconnect', function () {
		console.log('The user ', socket.id, ' has left the session');
	});
})


app.use('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

