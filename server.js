let http = require('http');
let express = require('express');
let sio = require('socket.io');

let app = express();
let server = http.createServer(app);
app.get('/', (req, res) => {
	res.sendfile(__dirname + '/index,html');
});
server.listen(8080);
let io = sio.listen(server);
let names = [];
io.sockets.on('connection', socket => {
	socket.on('login', name => {
		names.forEach(n => {
			if (n == name) {
				socket.emit('duplicate');
				return;
			}
		});
		names.push(name);
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
		socket.broadcast.emit('lgout', name);
		io.sockets.emit('sendClients', names);
	})
})