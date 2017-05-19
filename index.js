var http = require( "http" );
var fs = require( "fs" );

var server = http.createServer( atenderServidor );
console.log("el servidor esta creado");

//server.listen(8080);
server.listen(process.env.PORT || 5000);

var usuarios = [];

var s = fs.readFile("usuariosReg.json",cargarUsuario);

function atenderServidor(request,response) {
	console.log("esta buscando la pagina: " + request.url);
	if (request.url == "/registro"){
         guardaRegistro(request,response);
	}else if (request.url == "/ingresar") {
		logear(request,response);
	}else if (request.url == "/usuarios") {
         cargarJson(request,response);
	}else if(request.url == "/cookies"){
		cookies(request,response);
	}else if(request.url == "/"){
		fs.readFile(__dirname + "/subastas.html",  function (err, data) {
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
	else{
	    cargarPaginas(request,response);
    }
}
function cookies(request,response){
	request.on( "data", recibir );

	function recibir(data) {
		var usr = JSON.parse( data.toString() );
	var resp = {};
	resp.estado = 'ok';
	resp.url = '/especificacion.html';
	resp.id = usr.id;
	resp.nombre = usr.nombre;
	resp.precio = usr.precio;
	resp.img = usr.img;
	resp.oferta = usr.oferta;
	resp.fecha = usr.fecha;
	resp.proveedor = usr.proveedor;
	// Enviar la Cookie al navegador
	response.writeHead(200, {
	'Set-Cookie': 'id=' + usr.id + 'nombre=' + usr.nombre + 'precio=' + usr.precio
+ 'img=' + usr.img + 'oferta=' + usr.oferta + 'fecha=' + usr.fecha
+ 'proveedor=' + usr.proveedor});
	response.end( JSON.stringify(resp) ); 
	return;
	}
				
}
function cargarPaginas(request,response) {
	fs.readFile(__dirname+request.url,cargarDatos);

	function cargarDatos(error,data) {
		if (error == null) {
			response.write(data);
			response.end();
		}else{
			console.log(error);
			response.end(error.toString());
		}
	}
}

function cargarJson(request,response) {
	fs.readFile('usuariosReg.json',cargarDatos);

	function cargarDatos(error,data) {
		if (error == null) {
			response.write(data);
			response.end();
		}else{
			console.log(error);
			response.end(error.toString());
		}
	}
}

function cargarUsuario(error,data) {
	if (error == null) {
		usuarios = JSON.parse(data);
		console.log("Los usuarios registrados son: ");
		console.log(usuarios);
	}else{
		console.log(error);
		response.end(error.toString());
	}
}

function logear(request,response) {
	request.on( "data", recibir );
	console.log(usuarios);
	// Callback que recibe el cuerpo del POST
	function recibir( data ){
		console.log( "la informacion es: "+data.toString() );
		var usr = JSON.parse( data.toString() );
		// Controlar el Login
		for( var i=usuarios.length-1; i >= 0 ; i-- ){
			console.log("el email es: "+usuarios[i].nombre);
			console.log("la clave es: "+usuarios[i].contraseña);
			if( usuarios[i].nombre == usr.nombre && usuarios[i].contraseña == usr.contraseña ){
				// El usuario y la clave son correctos
				// retornamos la respuesta
				console.log("paso correctamente");
				
				var resp = {};
				resp.estado = 'ok';
				resp.url = '/perfil.html';
				// Enviar la Cookie al navegador

				response.writeHead(200, {
				'Set-Cookie': 'nombre=' + usr.nombre });
				
				// Serializar el objeto y enviar de vuelta al navegador
				response.end( JSON.stringify(resp) ); 
				
				return;
			}
		}
		
		// Si llega aqui, es porque no coincide con ninguno
		// retornar un error
		var resp = {};
		resp.estado = 'Login Incorrecto';
		// Serializar el objeto y enviar de vuelta al navegador
		response.end( JSON.stringify(resp) ); 
	}	
}

function guardaRegistro(request,response) {
	request.on("data",recibir);

	function recibir(data) {
		console.log(data.toString());
		var user = JSON.parse(data);
		usuarios.push(user);
		fs.writeFile("usuariosReg.json",JSON.stringify(usuarios), null);
		response.end("ya recibimos el usuario");
	}
}
