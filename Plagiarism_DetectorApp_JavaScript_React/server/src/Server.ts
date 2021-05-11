import * as express from 'express';
import * as fileUpload from 'express-fileupload';

import Console from './Console';

const cons: Console = Console.getInstance();
const app: express.Application = express();

/**
 * Set express to handle received and sent values as json objects.
 */
app.use(express.json({type: 'json'}));

/**
 * Set response headers for sending information from server.
 */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

/**
 * Set app to use express-fileupload to handle file objects sent from server.
 */
app.use(fileUpload());

/**
 * Uploads files for project 1 to server.
 */
app.put('/file/project1', (req, res) => {
    try {
		// add files via console
		cons.addFiles(req, true);
		// respond with 200 OK status and success message
		res.status(200).send("Files uploaded successfully");
	} 
	// if error, send bad request response, send error for
	// evaluation at client
	catch (error) {
		res.status(400).send(error.toString());
	}
})

/**
 * Uploads files for project 2 to server.
 */
app.put('/file/project2', (req, res) => {
    try {
		// add files via console
		cons.addFiles(req, false);
		// if success, return success message
		res.status(200).send("Files uploaded successfully");
	} 
	// otherwise, catch error, send back 400 response, 
	// send error as string for evaluation at client
	catch (error) {
		res.status(400).send(error.toString());
	}
})

/**
 * Gets files for project 1 from the server.
 */
app.get('/file/project1', (req, res) => {
	try {
		// get files for project 1 from console
		let files = cons.getFiles(true)
		// respond with 200 OK status, send files as json object
		res.status(200).send(JSON.stringify(files));
	} 
	// if error, send bad request status, send error as string for
	// evaluation at client
	catch (error) {
		res.status(400).send(error.toString())
	}
})

/**
 * Gets files for project 2 from the server.
 */
app.get('/file/project2', (req, res) => {
	try {
		// get files for project 2 from console
		let files = cons.getFiles(false)
		// respond with 200 ok status, send files as json object
		res.status(200).send(JSON.stringify(files));
	} 
	// if error, send bad request status, send error as string for evaluation 
	// at client
	catch (error) {
		res.status(400).send(error.toString())
	}
})

/**
 * Clears all files for both projects on the server.
 */
app.delete('/file/all', (req, res) => {
    try {
		// clear all files from project uploader in console
		cons.clearFiles();
		// send 200 OK status and message confirming deletion
		res.status(200).send("File deleted successfully");
	} 
	// if error, send bad request, return error as string for
	// evaluation at client
	catch (error) {
		res.status(400).send(error.toString());
	}
})

/**
 * Gets instances of plagiarism for results of comparison from server.
 */
app.get('/comparison', (req, res) => {
	try {
		// compare two project files for plagiarism
		let comparison = cons.compareProjects();
		// send 200 OK status and results of comparison as
		// json object
		res.status(200).send(JSON.stringify(comparison));
	} 
	// if error, send bad request status, return error as string
	// for evaluation at client
	catch (error) {
		res.status(400).send(error.toString());
	}
})

/**
 * Sets the server to listen on port 3001 on local machine.
 */
app.listen('3001', () => {
    console.log('server running on localhost:3001');
})