/*
 * Simple web server to interact with git
 */

var fs = require("fs");
var git = require("../");
var gitUtil = require("gitUtil");
var cfgUtil = require("cfgUtil");

var nodeRouter = require("node-router");
var server = nodeRouter.getServer();
var url = require("url");

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

// Get config properties
server.get("/cfg/all", function(request, response) {
	response.writeHead(200, {"Content-Type": nodeRouter.mime.getMime(".json")});
	response.end(JSON.stringify(cfgUtil.read.properties()));
});

// Get Single cfg property
server.get("/cfg/single", function(request, response) {
	var queryData = url.parse(request.url, true).query;
	var property = queryData.property;

	response.writeHead(200, {"Content-Type": nodeRouter.mime.getMime(".txt")});
	response.end(cfgUtil.read.property(property));
});

// Put a single property 
server.post("/cfg/single", function(request, response) {
	var queryData = url.parse(request.url, true).query;
	var key = queryData.key;	
	var value = queryData.value;

	var statusCode = 200;
	try {
		cfgUtil.write.property(key, value);	
	} catch(e) {
		statusCode = 500;
	}

	response.writeHead(statusCode);
	response.end();
});

// Put many properties in the cfg
server.post("/cfg/many", function(request, response) {
	var queryData = url.parse(request.url, true).query;
	var propertiesJson = eval("(" + queryData.properties + ")");
	
	var statusCode = 200;
	try {
		cfgUtil.write.properties(propertiesJson);	
	} catch(e) {
		statusCode = 500;
	}

	response.writeHead(statusCode);
	response.end();
});

// Get current branch of repository
server.get("/git/branch/current", function(request, response) {
	var queryData = url.parse(request.url, true).query;
	var path = queryData.path;

	gitUtil.getCurrentBranch(path, function(branchName) {
		console.log(branchName);
		response.writeHead(200);
		response.end();
	});
});

// Get the list of references in a repository
server.get("/git/refs", function(request, response){
	var queryData = url.parse(request.url, true).query;
	var path = queryData.path;

	// Get the references from a git repository
	gitUtil.getReferences(path, function(references){
		response.writeHead(200);
		response.end(references);
	});
});

// Get a list of commits from a given branch
server.get("/git/commits", function(request, response){
	var queryData = url.parse(request.url, true).query;
	var path = queryData.path;
	var branch = queryData.branch;
	var results = queryData.results;

	// Get the references from a git repository
	gitUtil.getCommits(path, branch, results, function(commits){
		response.writeHead(200);
		response.end(commits);
	});
});

// Get diffs of a branch from its oid
server.get("/git/diffs", function(request, response){
	var queryData = url.parse(request.url, true).query;
	var path = queryData.path;
	var branch = queryData.branch;
	var sha = queryData.sha;

	// Get the references from a git repository
	gitUtil.getDiffs(path, branch, sha, function(diffs){
		response.writeHead(200);
		response.end(diffs);
	});
});

function readHttpFile(path, encoding, callback) {
	var url = "http/" + path;
	fs.readFile(url, encoding, callback);
}

// Listen on port 8080
server.listen(8080);

console.log("Server running on localhost:8080");