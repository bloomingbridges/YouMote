var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

var votes = [0,0,0,0,0,0,0,0,0];
var channels = [];

app.listen(80);

function handler (req, res) {
  var file = '/index.html'
  // console.log("BLARGH " + req.url);
  if (req.url == '/theatre') {
  	file = '/theatre.html';
  }
  fs.readFile(__dirname + file, function(err, data) {
		if (err) {
	    res.writeHead(500);
	    return res.end(':<');
	  }

	  res.writeHead(200);
	  res.end(data);
	});
}

io.sockets.on('connection', function (socket) {
	// send out channel information
  socket.emit('ready', { message: 'connection established!' });
  socket.on('add', function (data) {
  	channels.push(data);
  	votes[channels.length-1] = Math.round((votes[0] + votes[1] + votes[2]) / 3);
  	socket.broadcast.emit('update', JSON.stringify({ listing: channels }));
  });
  socket.on('vote', function (data) {
    votes[data.index] += 1;
    socket.broadcast.json.send({ values: countVotes() });
  });
});

function countVotes() {
	var count = 0;
	for (var i=0; i<9; i++) {
		count += votes[i];
	}
	var newValues = [];
	var tmp = 0;
	for (var j=0; j<9; j++) {
		tmp = votes[j] / count;
		if(tmp > 0){
			tmp = tmp.toFixed(2);
		}
		newValues.push(tmp);
	}
	console.log(newValues);
	// return JSON.stringify(newValues);
	return newValues;
}

