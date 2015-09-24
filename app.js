var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crypto = require('crypto');
var mysql = require('mysql'),
  connectionsArray = [],
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
	password: '',
 //   password: 'root',
    database: 'hashlooop',
    port: 3306
  });
  
app.get('/', function(req, res){
  res.sendfile('index.html');
});


io.on('connection', function(socket){
/* 	  socket.emit('news', { hello: 'world' });
	  socket.on('my other event', function (data) {
		console.log(data);
	  });
 */  
	socket.on('new_registration', function (data) {
		//console.log("Testing");
		//console.log(socket.id);
		//console.log("New registration",data);
		console.log("Id",socket.id);
		//data.socket_session_id = socket.id;
		userRegistration(JSON.parse(data), socket.id);
	});
	socket.on('response', function (data) {
		//console.log("Testing");
		//console.log(socket.id);
		console.log("Response",data);
		//console.log("Id",JSON.parse(data));
		//data.socket_session_id = socket.id;
	});
	
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


userRegistration = function(data, socket_session_id){
	console.log("Datas");
	console.log(data.email);
	console.log(data.name);
	console.log(data.password);
	var check_user = connection.query('select * from users where email = "'+data.email+'"');
	users = []; // this array will contain the result of our db query

	check_user
	.on('error', function(err) {
		console.log(err);
	})
	.on('result', function(user) {
		users.push(user);
	})
	.on('end', function() {
		console.log(users.length);
		console.log(socket_session_id);
		if(users.length > 0){		
			io.to(socket_session_id).emit('registration_response', {status : 0, message: "Email Already Exist!!"});
		}else{
			var md5sum = crypto.createHash('md5');
			var hashed_password = data.password;
			hashed_password = md5sum.update(hashed_password);
			hashed_password = md5sum.digest('hex');
			var insert_new_user = connection.query('insert into users (`name`, `email`, `password`, `mobile_number`, `socket_session_id`) values ("'+data.name+'", "'+data.email+'", "'+hashed_password+'", "'+data.mobile+'", "'+socket_session_id+'")');
			user_id = [];
			insert_new_user
			.on('error', function(err) {
				console.log(err);
			})
			.on('result', function(user) {
				//console.log(user);
				user_id.push(user.insertId);
			})
			.on('end', function() {
				//getListOfUsers(data, socket_session_id, user_id[0]);
				console.log(socket_session_id);
				//io.emit('news', { hello: 'world' });
				io.to(socket_session_id).emit('registration_response', {status : 1, message: "Registered Successfully", user_id: user_id});
				//io.to(socket_session_id).emit('registration_response', { message:"Registered Successfully"});
				//io.sockets.socket(socket_session_id).emit('registration_response', { message:"Registered Successfully"});
			});
		}	
	});
}
