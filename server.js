let http = require('http');
let express = require('express');
let sio = require('socket.io');

let app = express();
let server = http.createServer(app);
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});
server.listen(8080, () => {
	console.log('server is listening on port 8080.');
});
let io = sio.listen(server);
let names = [];
io.sockets.on('connection', socket => {
	socket.on('login', name => {
		for (let i = 0; i < names.length; i ++) {
			if(names[i] == name) {
				socket.emit('duplicate');
				return;
			}
		}
		names.push(name);
		console.log(names);
		io.sockets.emit('login', name);
		io.sockets.emit('sendClients', names);
	});
	socket.on('chat', data => {
		io.sockets.emit('chat', data);
	});
	socket.on('logout', name => {
		for (let i = 0; i < names.length; i++) {
			if(names[i] == name) {
				names.splice(i, 1);
				break;
			}
		}
		console.log(names);
		socket.broadcast.emit('logout', name);
		io.sockets.emit('sendClients', names);
	})
})