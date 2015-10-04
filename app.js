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
	
	socket.on('new_looop', function (data) {
		newStatus(JSON.parse(data), socket.id);
	});
	
	connectionsArray.push(socket);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


userRegistration = function(data, socket_session_id){
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
				user_id.push(user.insertId);
			})
			.on('end', function() {
				console.log(socket_session_id);
				io.to(socket_session_id).emit('registration_response', {status : 1, message: "Registered Successfully", user_id: user_id[0]});
			});
		}	
	});
}


updateUserLocation = function(data, socket_session_id){
	var update_location = connection.query('update users set `current_location_latitude` = '+data.latitude+', `current_location_longitude` = '+data.longitude+', `socket_session_id` =  "'+socket_session_id+'" where id = "'+data.user_id+'"');
	
	var looop_in_that_location = connection.query('SELECT id, user_id, status, ( 3959 * acos( cos( radians('+data.latitude+') ) * cos( radians( status_location_latitude ) ) * cos( radians( status_location_longitude ) - radians('+data.longitude+') ) + sin( radians('+data.latitude+') ) * sin( radians( status_location_latitude ) ) ) ) AS distance FROM status HAVING distance < 20');
	all_looops = []; // this array will contain the result of our db query

	looop_in_that_location
	.on('error', function(err) {
		console.log(err);
	})
	.on('result', function(loops) {
		all_looops.push(loops);
	})
	.on('end', function() {
		io.to(socket_session_id).emit('looop_in_that_location', {status : 1, message: "Looops Retrived Successfully", looops: all_looops});
	});
}

newStatus = function(data, socket_session_id){
	var insert_new_looops = connection.query('insert into status (`user_id`, `status_type`, `status`, `status_location_latitude`, `status_location_longitude`) values ('+data.user_id+', "1", "'+data.looop+'", "'+data.latitude+'", "'+data.longitude+'")');
	looops_id = [];
	insert_new_looops
	.on('error', function(err) {
		console.log(err);
	})
	.on('result', function(looops) {
		//console.log(user);
		looops_id.push(looops.insertId);
	})
	.on('end', function() {
		console.log(socket_session_id);
		var broadcast_looop_to_all = connection.query('SELECT id, name, socket_session_id, ( 3959 * acos( cos( radians('+data.latitude+') ) * cos( radians( current_location_latitude ) ) * cos( radians( current_location_longitude ) - radians('+data.longitude+') ) + sin( radians('+data.latitude+') ) * sin( radians( current_location_latitude ) ) ) ) AS distance FROM users HAVING distance < 20');
		all_users = []; // this array will contain the result of our db query

		broadcast_looop_to_all
		.on('error', function(err) {
			console.log(err);
		})
		.on('result', function(looops) {
			all_users.push(looops);
		})
		.on('end', function() {
			console.log(all_users.length);
			io.to(socket_session_id).emit('looop_success', {status : 1, message: "Looops Posted Successfully"});
			for(var i = 0; i < all_users.length; i++){
				io.to(all_users[i].socket_session_id).emit('looop_post_notification', {status : 1, message: "New Looop Data", looop_user_id: data.user_id, looop_id : looops_id[0], looop: data.looop });
			}	
		});
	});
}