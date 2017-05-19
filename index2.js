var http = require("http");
var fs = require("fs");

// Crear una instancia del servidor HTTP
var server = http.createServer(atenderServidor);

// Iniciar la escucha del servidor en el puerto 8088
server.listen(process.env.PORT || 5000);

// 
function atenderServidor(request, response) {
	console.log("servidor creado");
	//console.log("url" + request.url);
	/*if (request.url === "/hora") {
		var time = new Date();
		response.end(time.toString());
	}*/

	if (request.url === "/") {
		console.log("Peticion recibida: " + request.url);
		//response.sendFile( __dirname + '/files/subastas.html');
		fs.readFile(__dirname + "/files/subastas.html",  function (err, data) {
		if (err == null){
			response.write(data);
			console.log("error en url");
			response.end();
		}
		else{
			console.log("error found: " + err);
			response.end(err.toString());
		} 
		});
		//response.end("Hola Mundo Node.js");	

	}
	else{
		fs.readFile(__dirname + "/files" +  request.url.toString(),  function (err, data) {
		if (err == null){
			response.write(data);
			console.log("error en url");
			response.end();
		}
		else{
			console.log("error found: " + err);
			response.end(err.toString());
		} 
		});
	
	}
}
