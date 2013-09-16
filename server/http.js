/*
 * Simple web server to interact with git
 */

var git = require("../");
var fs = require("fs");
var server = require("node-router").getServer();

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

// Text File loader
server.get(new RegExp("^/((\\S+/)*\\S+\\.(\\S+))$"), function (request, response, match, a, ext) {	
	
	var contentType;

	switch (ext) {
		case "js": 		contentType = "text/javascript"; break;
		case "css": 	contentType = "text/css"; break;
		case "html": 	contentType = "text/html"; break;
		default: 		contentType = "text/plain"; break;
	}

	readHttpFile(match, function(err, data) {

		response.writeHead(data ? 200 : 404, {"Content-Type": contentType});
		response.end(data);
	});	
});

function readHttpFile(path, callback) {
	var url = "http/" + path;
	fs.readFile(url, 'utf8', callback);
	console.log("Loading " + url);
}

// Listen on port 8080
server.listen(8080);

console.log("Server running on localhost:8080");