'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var request = require("request");
var app = express();
var FCM = require('fcm-node');
var emoji = require('emojione/lib/js/emojione.js');

var serverkey = 'AAAAoIz7NIY:APA91bFL9Kv-cpzcA10pz-FMuflhos3BUZRqJ2Dmk9TIMbqCFy5Ml0Ah10P3EPOzuNU6SC1Q-cBxqnxcwqrB4KIbP4XCPNRidB93p8n1OhVzeaegBv8LY-GQr_9Te72DGiiVohsD1O06';  
var fcm = new FCM(serverkey);
const PORT = process.env.PORT || 5000;
var base_url = "http://www.escuelasmexico.com/rex/grupo_alabanza/php/"
//var base_url = "http://192.168.0.95/grupo_alabanza/php/";




app.use(bodyParser.json());

app.set('port', PORT);

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});
app.use(function(req, res, next){
	    res.header("Access-Control-Allow-Origin", "http://www.escuelasmexico.com");
  		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    	res.header('Access-Control-Allow-Credentials', true);
		next();
});
    //var mensaje = req.body.message;


/*app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});*/

const socketIO = require('socket.io');
const server = express()
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(server);

io.on('connection', function(socket) {  
  console.log('Alguien se ha conectado con Sockets');
  socket.on('join', function (data) {
    socket.join(data.email); // We are using room of socket io
    console.log("Added " + data.email);
  });
  socket.on('create_group', function (data) {
    socket.join(data.email+"_grupo"); // We are using room of socket io
    console.log("Added " + data.email+"_grupo");
  });

  socket.on('join_group', function (data) {
    socket.join(data.email+"_grupo"); // We are using room of socket io
    console.log("Join to " + data.email+"_grupo");
  });
  socket.on('leave', function (data) {
    socket.leave(data.email); // We are using room of socket io
    console.log("Left " + data.email);
  });
  socket.on('new-message', function(data) {
    console.log("Sending to " + data.email);
    io.sockets.in(data.email).emit('messages', data);//send message to data.email
    var tokens = [];
    var mensaje = data.body;
    var image = data.picture
	//request to database
    request({
      uri: base_url + "get_device_token.php",
      method: "POST",
      form: {
        id_usuario: data.id_usuario,
        body : mensaje,
        isAdmin: data.isAdmin
      }
    }, function(error, response, body) {
      if(error){
        return console.log('Error:', error);
        }

        //Check for right status code
        if(response.statusCode !== 200){
            return console.log('Invalid Status Code Returned:', response.statusCode);
        }

        console.log("Device_Token : " + body);
        if(body !== 'vacio'){
          tokens.push(body);
	        var payloadMulticast = {
				registration_ids:tokens,
				data : {
			        'type' : 'mensaje',
			         title: 'ROL - Mensaje', 
			         body: emoji.shortnameToUnicode(mensaje), sound : "default", 
			         badge: "1", content_available: '1',
			         style: "inbox",
		             image: image,
		             'image-type': 'circular',
		             icon: "notif",
		             summaryText : 'Tienes %n% mensajes'
				},
				priority: 'high',
				content_available:true,
				"force-start":1
			};
			var callbackLog = function (sender, err, res) {
			    console.log("\n__________________________________")
			    console.log("\t"+sender);
			    console.log("----------------------------------")
			    console.log("err="+err);
			    console.log("res="+res);
			    console.log("----------------------------------\n>>>");
			};
			fcm.send(payloadMulticast,function(err,res){
		        callbackLog('sendMulticast',err,res);
		    });

			//end send
        }//end if body vacio

    });
    //end request
  });
  socket.on('new-message-group', function(data) {
    console.log("Sending to " + data.email+"_grupo");
    io.sockets.in(data.email+"_grupo").emit('group-messages', data);//send message to data.email
     var tokens = [];
     var mensaje = data.body;
     var id_remitente = data.id_remitente;
     var image = data.image;
     var grupo = data.grupo;
     var picture = data.picture;
     var name = data.name;
	//request to database
    request({
      uri: base_url + "get_all_device_tokens.php",
      method: "POST",
      form: {
        group_id: data.group_id,
        id_remitente: id_remitente,
        body:mensaje,
        name: name,
        picture:picture
      }
    }, function(error, response, body) {
      if(error){
        return console.log('Error:', error);
        }

        //Check for right status code
        if(response.statusCode !== 200){
            return console.log('Invalid Status Code Returned:', response.statusCode);
        }

        console.log("Device_Token : " + body);
        if(body !== 'vacio'){
        	 data = JSON.parse(body);
	          //All is good. Print the body
	          for(var i = 0; i < data.length; i++) {
	           console.log("device token:"+data[i].device_token);
	           tokens.push(data[i].device_token);           
	          }//end for
	        var payloadMulticast = {
				registration_ids:tokens,
				data : {
			        'type' : 'grupo',
			         title: 'ROL - '+grupo, 
			         body: "<b>"+name+"</b> "+emoji.shortnameToUnicode(mensaje), sound : "default", 
			         badge: "1", content_available: '1',
			         style: "inbox",
		             image: image,
		             'image-type': 'circular',
		             icon: "notif",
		             summaryText : 'Tienes %n% notificaciones'
				},
				priority: 'high',
				content_available:true,
				"force-start":1
			};
			var callbackLog = function (sender, err, res) {
			    console.log("\n__________________________________")
			    console.log("\t"+sender);
			    console.log("----------------------------------")
			    console.log("err="+err);
			    console.log("res="+res);
			    console.log("----------------------------------\n>>>");
			};
			fcm.send(payloadMulticast,function(err,res){
		        callbackLog('sendMulticast',err,res);
		    });

			//end send
        }//end if body vacio

    });
    //end request
  });
  //end new-message
  socket.on('push-notification', function(data) {
  	var creador = data.creador;
  	var mensaje = data.message;
  	var id_lista = data.id_lista;
  	var type = data.type;
  	var image = data.picture;

    console.log("List by " + creador);
    console.log("Mensaje "+ mensaje);
    console.log("Tipo "+ type);
    console.log("Id lista " + id_lista);

     var tokens = [];
	//request to database
    request({
      uri: base_url + "get_all_device_tokens_except_creador.php",
      method: "POST",
      form: {
        group_id: data.group_id,
        creador:data.creador
      }
    }, function(error, response, body) {
      if(error){
        return console.log('Error:', error);
        }

        //Check for right status code
        if(response.statusCode !== 200){
            return console.log('Invalid Status Code Returned:', response.statusCode);
        }

        console.log("Device_Token : " + body);
        if(body !== 'vacio'){
        	 data = JSON.parse(body);
	          //All is good. Print the body
	          for(var i = 0; i < data.length; i++) {
	           console.log("device token:"+data[i].device_token);
	           tokens.push(data[i].device_token);           
	          }//end for
	        var payloadMulticast = {
				registration_ids:tokens,
				data : {
			         title: 'ROL', 
			         body: mensaje, sound : "default", 
			         badge: "1", content_available: '1',
			         style: "inbox",
		             image: image,
		             'image-type': 'circular',
		             icon: "notif",
		             summaryText : 'Tienes %n% notificaciones',	         
			         type : type,
			         id_lista: id_lista
				},
				priority: 'high',
				content_available:true,
				"force-start":1
			};
			var callbackLog = function (sender, err, res) {
			    console.log("\n__________________________________")
			    console.log("\t"+sender);
			    console.log("----------------------------------")
			    console.log("err="+err);
			    console.log("res="+res);
			    console.log("----------------------------------\n>>>");
			};
			fcm.send(payloadMulticast,function(err,res){
		        callbackLog('sendMulticast',err,res);
		    });

			//end send
        }//end if body vacio

    });
    //end request
  });
  //end new-list
  //respuesta solicitud
  socket.on('respuesta', function(data){
  	var tokens = [];
	var mensaje = data.message;
	var image = data.picture;
	//request to database
    request({
      uri: base_url + "get_device_token.php",
      method: "POST",
      form: {
        id_usuario: data.id_usuario,
      }
    }, function(error, response, body) {
      if(error){
        return console.log('Error:', error);
        }

        //Check for right status code
        if(response.statusCode !== 200){
            return console.log('Invalid Status Code Returned:', response.statusCode);
        }

        console.log("Device_Token : " + body);
        if(body !== 'vacio'){
          tokens.push(body);
	        var payloadMulticast = {
				registration_ids:tokens,
				data : {
			        'type' : 'respuesta',
			         title: 'ROL', 
			         body: mensaje, sound : "default", 
			         badge: "1", content_available: '1',
			         style: "inbox",
		             image: image,
		             'image-type': 'circular',
		             icon: "notif",
		             summaryText : 'Tienes %n% notificaciones'
				},
				priority: 'high',
				content_available:true,
				"force-start":1
			};
			var callbackLog = function (sender, err, res) {
			    console.log("\n__________________________________")
			    console.log("\t"+sender);
			    console.log("----------------------------------")
			    console.log("err="+err);
			    console.log("res="+res);
			    console.log("----------------------------------\n>>>");
			};
			fcm.send(payloadMulticast,function(err,res){
		        callbackLog('sendMulticast',err,res);
		    });

			//end send
        }//end if body vacio



    });
  });
  //end respuesta
  socket.on('check_connection_status', function(data) {
  	var client = io.sockets.adapter.rooms[data.email];

    io.sockets.in(data.my_email).emit('connection_status', client);//send message to data.email
  	//console.log(client);
  });
});