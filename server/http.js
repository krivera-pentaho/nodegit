/*
 * Simple web server to interact with git
 */

var http = require('http');
var git = require("../");
var fs = require("fs");

var server = require("node-router").getServer();

function readHttpFile(path, callback) {
	fs.readFile("http/" + path, 'utf8', callback);
}

// Root
server.get("/", function (request, response) {
	response.writeHead(200, {"Content-Type": "text/html"});

	// Load index.html
	readHttpFile("index.html", function (err, data) {		
		response.end(data);
	});
});

// Git commands root
server.get("/git", function (request, response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.end("GIT");
});

// JS loader
server.get(new RegExp("^/js(/(\\S+/)*\\S+\\.js)$"), function (request, response, match) {	

	readHttpFile(match, function(err, data) {
		response.writeHead(200, {"Content-Type": "text/javascript"});
		response.end(data);
	});	
});


// Listen on port 8080
server.listen(8080);

console.log("Server running on localhost:8080");