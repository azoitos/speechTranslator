const express = require('express');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const path = require('path');
var socketio = require('socket.io');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(volleyball);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

const server = app.listen(PORT, () => {
	console.log('here on port ' + server.address().port);
});

app.use('/', require('./route'))

var io = socketio(server);

const rooms = {};

io.on('connection', function (socket) {
	console.log('A new socket has connected', socket.id);

	const roomName = getRoomName(socket);

	socket.join(roomName);

	rooms[roomName] = rooms[roomName] || [];

	socket.on('onEnglish', function (...data) {
		const roomName = getRoomName(socket);
		rooms[roomName].push(data)
		socket.to(roomName).emit('onEnglish', data)
	})

	socket.on('onJapanese', function (...data) {
		const roomName = getRoomName(socket);
		rooms[roomName].push(data)
		socket.to(roomName).emit('onJapanese', data)
	})

	socket.on('disconnect', function () {
		console.log('The user ', socket.id, ' has left the session');
	});
})

function getRoomName(socket){
	const urlArr = socket.request.headers.referer.split('/');
	const roomName = urlArr[urlArr.length - 1];
	return roomName
}

app.use('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

