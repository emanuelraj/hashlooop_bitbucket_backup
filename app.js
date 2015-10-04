var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crypto = require('crypto');
var mysql = require('mysql'),
  connectionsArray = [],
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
	password: 'h@shl000p',
//    password: '',
    database: 'hashlooop',
    port: 3306
  });
  

io.on('connection', function(socket){
	socket.on('test_connection', function (data) {
		io.to(socket.id).emit('connection_response', {message: "Connection Established Successfully!!"});
	});
	
	socket.on('new_registration', function (data) {
		userRegistration(JSON.parse(data), socket.id);
	});
	
	socket.on('update_user_location', function (data) {
		updateUserLocation(JSON.parse(data), socket.id);
	});
	
	socket.on('new_status', function (data) {
		newStatus(JSON.parse(data), socket.id);
	});
	
	connectionsArray.push(socket);
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
				io.to(socket_session_id).emit('registration_response', {status : 1, message: "Registered Successfully", user_id: user_id[0]});
				//io.to(socket_session_id).emit('registration_response', { message:"Registered Successfully"});
				//io.sockets.socket(socket_session_id).emit('registration_response', { message:"Registered Successfully"});
			});
		}	
	});
}


updateUserLocation = function(data, socket_session_id){
	var update_location = connection.query('update users set `current_location_latitude` = '+data.latitude+', `current_location_longitude` = '+data.longitude+', `socket_session_id` =  "'+socket_session_id+'" where id = "'+data.user_id+'"');
	//SELECT id, ( 3959 * acos( cos( radians(10.9954968) ) * cos( radians( status_location_latitude ) ) * cos( radians( status_location_longitude ) - radians(76.9571046) ) + sin( radians(10.9954968) ) * sin( radians( status_location_latitude ) ) ) ) AS distance FROM status HAVING distance < 9
	
	//io.to(socket_session_id).emit('location_update', {status : 1, message: "Location Updated Successfully", user_id: data.user_id});
	
	var status_in_that_location = connection.query('SELECT id, user_id, status, ( 3959 * acos( cos( radians('+data.latitude+') ) * cos( radians( status_location_latitude ) ) * cos( radians( status_location_longitude ) - radians('+data.longitude+') ) + sin( radians('+data.latitude+') ) * sin( radians( status_location_latitude ) ) ) ) AS distance FROM status HAVING distance < 20');
	all_status = []; // this array will contain the result of our db query

	status_in_that_location
	.on('error', function(err) {
		console.log(err);
	})
	.on('result', function(status) {
		all_status.push(status);
	})
	.on('end', function() {
		io.to(socket_session_id).emit('status_in_that_location', {status : 1, message: "Status Retrived Successfully", status: all_status});
	});
}

newStatus = function(data, socket_session_id){
	var insert_new_status = connection.query('insert into status (`user_id`, `status_type`, `status`, `status_location_latitude`, `status_location_longitude`) values ('+data.user_id+', "1", "'+data.status+'", "'+data.latitude+'", "'+data.longitude+'")');
	status_id = [];
	insert_new_status
	.on('error', function(err) {
		console.log(err);
	})
	.on('result', function(status) {
		//console.log(user);
		status_id.push(status.insertId);
	})
	.on('end', function() {
		console.log(socket_session_id);
		io.to(socket_session_id).emit('status_post_response', {status : 1, message: "Status Posted Successfully", user_id: data.user_id, status_id : status_id[0]});
	});
}