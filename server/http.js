/*
 * Simple web server to interact with git
 */

var git = require("../");
var gitUtil = require("gitUtil.js");
var fs = require("fs");
var url = require("url");

var nodeRouter = require("node-router");
var server = nodeRouter.getServer();

// Root
server.get("/", function (request, response) {
	response.writeHead(200, {"Content-Type": "text/html"});

	// Load index.html
	readHttpFile("index.html", 'utf8', function (err, data) {		
		response.end(data);
	});
});

// Git commands root
server.get("/git/isGitDir", function (request, response) {
	var queryData = url.parse(request.url, true).query;
	var path = queryData.path;	

	response.writeHead(200, {"Content-Type": "text/plain"});
	try {
		var isGitDir = gitUtil.isGitDir(path);
		response.end(isGitDir.toString());
	} catch(e) {
		console.error(e);
		response.end("false");
	}	
});

// Text File loader
server.get(new RegExp("^/((\\S+/)*\\S+(\\.\\S+))$"), function (request, response, match, match1, ext) {	
	
	var contentType = nodeRouter.mime.getMime(ext);	
	var encoding = contentType.search("text") == -1 ? null : 'utf8';

	// Read in file
	readHttpFile(match, encoding, function(err, data) {
		response.writeHead(data ? 200 : 404, {"Content-Type": contentType});		
		response.end(data);
	});	
});

function readHttpFile(path, encoding, callback) {
	var url = "http/" + path;
	fs.readFile(url, encoding, callback);
}

// Listen on port 8080
server.listen(8080);

console.log("Server running on localhost:8080");