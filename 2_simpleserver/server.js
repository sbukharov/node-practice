/** Server file that handles request routing and responses.*/

/** Import dependencies*/
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

/** Define mimeTypes of content the site will serve.*/
const mimeTypes = {
		"html":"text/html",
		"jpeg":"image/jpeg",
		"jpg":"image/jpg",
		"png":"image/png",
		"js":"text/javascript",
		"css":"text/css"
};

/** Creates the server, runs it on the 1337 port.*/
http.createServer(function(req,res) {
	/** Parses path and filename from request URL */
	var uri = url.parse(req.url).pathname;
	var fileName = path.join(process.cwd(), unescape(uri));
	/** Track which pages are requested */
	console.log('Loading '+uri);
	var stats;
	
	/** Handle nonexistant file requests with 404 */
	try {
		stats = fs.lstatSync(fileName);
	} catch(e) {
		res.writeHead(404, {'Content-type' : 'text/plain'});
		res.write('404 Not Found\n');
		res.end();
		return;
	}
	
	/** If file exists. */
	if (stats.isFile()) {
		/** Gets the extension of the request, splitting by . and reversing guarantees the last section after . */
		var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
		res.writeHead(200, {'Content-type': mimeType});
		//serve file
		var fileStream = fs.createReadStream(fileName);
		fileStream.pipe(res);
	} else if (stats.isDirectory()) {
		//redirect to homepage
		res.writeHead(302, {'Location':'index.html'});
		res.end();
	} else {
		//return error - something else went wrong
		res.writeHead(500, {'Content-type':'text/plain'});
		res.write('500 Internal Error\n');
		res.end();
	}
	
}).listen(1337);