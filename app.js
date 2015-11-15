var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crypto = require('crypto');
var fs = require('fs');
var mkdirp = require('mkdirp');
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
	
	socket.on('login', function(data){
		data.socket_session_id = socket.id;
		userLogin(JSON.parse(data), socket.id);
	});
	
	
	socket.on('fetch_feed_looops', function (data) {
	/* 	console.log(data);
		parsed_data = JSON.parse(data);
		if(parsed_data.data_fetch_status == 0){
			updateUserLocation(parsed_data, socket.id);
		}else if(parsed_data.data_fetch_status == 1){
			fetchOldDataPagination(parsed_data, socket.id);
		}else if(parsed_data.data_fetch_status == 2){
			fetchNewDataPagination(parsed_data, socket.id);
		} */
		updateUserLocation(JSON.parse(data), socket.id);
	});
	
	socket.on('fetch_old_pagination', function(data){
		//console.log(data);
		oldDataPagination(JSON.parse(data), socket.id);
	});
	
	socket.on('socket_reconnect', function (data) {
		data = JSON.parse(data);
		var update_socket = connection.query('update users set `socket_session_id` =  "'+socket.id+'" where id = "'+data.user_id+'"');
		io.to(socket.id).emit('socket_reconnect_status', {status : 1, message: "Socket Reconnected Successfully"});
	});
	
	
	socket.on('fetch_trending_looops', function (data){
		console.log(data);
		updateTrendingLooops(JSON.parse(data), socket.id);
	});
	
	socket.on('new_looop', function (data) {
		newStatus(JSON.parse(data), socket.id);
	});
	
	socket.on('new_image_looop', function (data) {
		newImageLooops(JSON.parse(data), socket.id);
	});
	
	socket.on('like_looops', function (data) {
		newLike(JSON.parse(data), socket.id);
	});
	
	socket.on('new_follow', function (data) {
		newFollow(JSON.parse(data), socket.id);
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

userLogin = function(data,socket_session_id){
	console.log(data.email);
	console.log(data.password);
	var check_login = connection.query('select name,email,password,id from users where email ="'+data.email+'"');
	users = []; // this array will contain the result of our db query

	check_login
	.on('error', function(err) {
		console.log(err);
	})
	.on('result', function(user) {
		users.push(user);
	})
	.on('end', function() {
		console.log(users.length);
		var md5sum = crypto.createHash('md5');
		var hashed_password = data.password;
		hashed_password = md5sum.update(hashed_password);
		hashed_password = md5sum.digest('hex');
		console.log(hashed_password);
		console.log(users);
		if(hashed_password == users[users.length - 1].password){
			console.log({status : 1, message: "Logged in Successfully!!",  user_id : users[users.length - 1].id});
			io.to(socket_session_id).emit('login_response',
			{status : 1, message: "Logged in Successfully!!",  user_id : users[users.length - 1].id});
		}else{
			io.to(socket_session_id).emit('login_response', {status : 0,
			message: "Username or Password Wrong!!"});
		}	
	});
}


updateUserLocation = function(data, socket_session_id){
	var update_location = connection.query('update users set `current_location_latitude` = '+data.latitude+', `current_location_longitude` = '+data.longitude+', `socket_session_id` =  "'+socket_session_id+'" where id = "'+data.user_id+'"');

	//'+data.user_id+'
	//SELECT id, user_id, status, ( 3959 * acos( cos( radians('+data.latitude+') ) * cos( radians( status_location_latitude ) ) * cos( radians( status_location_longitude ) - radians('+data.longitude+') ) + sin( radians('+data.latitude+') ) * sin( radians( status_location_latitude ) ) ) ) AS distance FROM status HAVING distance < 20
	//SELECT stat.id, stat.user_id, user.name, stat.status, if((fol.user_id = stat.user_id and fol.following_id = '+data.user_id+'), 1, 0) AS relationship, ( 3959 * acos( cos( radians('+data.latitude+') ) * cos( radians( status_location_latitude ) ) * cos( radians( status_location_longitude ) - radians('+data.longitude+') ) + sin( radians('+data.latitude+') ) * sin( radians( status_location_latitude ) ) ) ) AS distance FROM status as stat LEFT JOIN following_mapping as fol on fol.user_id = stat.user_id LEFT JOIN users as user on user.id = stat.user_id
	var radius = 5;
	var looops_result;
	looops_result = dynamically_expand_radius(data, radius, function(all_looops, radius){
		// Here you have access to your variable
		var looop_id_array = new Array();
		for(var i = 0; i < all_looops.length; i++){
			looop_id_array.push(all_looops[i].looop_id);
		}  
		io.to(socket_session_id).emit('looop_in_that_location', {status : 1, message: "Looops Retrived Successfully", looops: all_looops, min_id: Math.min.apply(null, looop_id_array), max_id:Math.max.apply(null, looop_id_array), current_radius: radius});
	})
}

dynamically_expand_radius = function(data, radius , callback){
	
	var looop_in_that_location = connection.query('SELECT stat.id as looop_id, stat.status_type, stat.image_url, DATE_FORMAT(stat.created_at, "%Y-%m-%d %H:%i:%S") as posted_time, stat.user_id, user.name, stat.status, @total_likes:=(SELECT COUNT(*) FROM likes where status_id = stat.id ) AS `total_likes`, if((lik.status_id = stat.id and lik.user_id = '+data.user_id+'), true, false) AS like_status , if((fol.user_id = stat.user_id and fol.following_id = '+data.user_id+'), true, false) AS relationship, ( 6371 * acos( cos( radians('+data.latitude+') ) * cos( radians( stat.status_location_latitude ) ) * cos( radians( stat.status_location_longitude ) - radians('+data.longitude+') ) + sin( radians('+data.latitude+') ) * sin( radians( stat.status_location_latitude ) ) ) ) AS distance FROM status as stat LEFT JOIN following_mapping as fol on fol.user_id = stat.user_id LEFT JOIN likes as lik on lik.status_id = stat.id LEFT JOIN users as user on user.id = stat.user_id where stat.id < SELECT MAX(stat.id) FROM status group by looop_id HAVING distance < '+radius+' order by article_time DESC, distance ASC');
	all_looops = []; // this array will contain the result of our db query

	looop_in_that_location
	.on('error', function(err) {
		console.log(err);
	})
	.on('result', function(loops) {
		all_looops.push(loops);
	})
	.on('end', function() {
		console.log("Return Looops lenght" + all_looops.length);
		//return callback(all_looops);
		if(all_looops.length < 10){
			radius = radius + 5;
			console.log("New Radius" + radius);
			dynamically_expand_radius(data, radius , callback);
		}else{
			return callback(all_looops , radius);
		}
		//
	});
	
}



newStatus = function(data, socket_session_id){
	
	//SELECT id, user_id, status, ( 3959 * acos( cos( radians('+data.latitude+') ) * cos( radians( status_location_latitude ) ) * cos( radians( status_location_longitude ) - radians('+data.longitude+') ) + sin( radians('+data.latitude+') ) * sin( radians( status_location_latitude ) ) ) ) AS distance FROM status HAVING distance < 20
	var check_looops_in_that_location = connection.query('SELECT id, user_id, status, ( 3959 * acos( cos( radians('+data.latitude+') ) * cos( radians( status_location_latitude ) ) * cos( radians( status_location_longitude ) - radians('+data.longitude+') ) + sin( radians('+data.latitude+') ) * sin( radians( status_location_latitude ) ) ) ) AS distance FROM status HAVING distance < 1');
	all_looops = []; // this array will contain the result of our db query

	check_looops_in_that_location
	.on('error', function(err) {
		console.log(err);
	})
	.on('result', function(loops) {
		all_looops.push(loops);
	})
	.on('end', function() {
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
			var broadcast_looop_to_all = connection.query('SELECT id, name, socket_session_id, ( 6371 * acos( cos( radians('+data.latitude+') ) * cos( radians( current_location_latitude ) ) * cos( radians( current_location_longitude ) - radians('+data.longitude+') ) + sin( radians('+data.latitude+') ) * sin( radians( current_location_latitude ) ) ) ) AS distance FROM users HAVING distance < 1');
			all_users = []; // this array will contain the result of our db query

			broadcast_looop_to_all
			.on('error', function(err) {
				console.log(err);
			})
			.on('result', function(looops) {
				all_users.push(looops);
			})
			.on('end', function() {
				//console.log(all_users.length);
				if(all_looops.length > 0){
					io.to(socket_session_id).emit('looop_success', {status : 1, message: "Looops Posted Successfully"});
				}else{
					var insert_discoverer_badge = connection.query('insert into badges_mapping (`user_id`, `badge_id`) values ('+data.user_id+', "1")');					
					io.to(socket_session_id).emit('looop_success', {status : 2, message: "Looops Posted Successfully!! You are the Discoverer of that Location"});
				}
				var get_user_name = connection.query('SELECT name from users where id = "'+data.user_id+'"');
				users = []; // this array will contain the result of our db query

				get_user_name
				.on('error', function(err) {
					console.log(err);
				})
				.on('result', function(user) {
					users.push(user);
				})
				.on('end', function() {
					for(var i = 0; i < all_users.length; i++){
						io.to(all_users[i].socket_session_id).emit('looop_post_notification', {status : 1, message: "New Looop Data", looop_user_id: data.user_id, looop_id : looops_id[0], looop: data.looop, looop_user_name: users[0].name });
					}	
				});
			});
		});
	});
}

newLike = function(data, socket_session_id){
	var check_user = connection.query('select * from likes where status_id = '+data.looop_id+' and user_id = '+data.user_id+'');
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
			io.to(socket_session_id).emit('like_response', {status : 1, message: "Successfully Liked"});
		}else{
			var insert_new_likes = connection.query('insert into likes (`status_id`, `user_id`, `like_type`) values ('+data.looop_id+', '+data.user_id+', 1)');
			like_id = [];
			insert_new_likes
			.on('error', function(err) {
				console.log(err);
			})
			.on('result', function(like) {
				like_id.push(like.insertId);
			})
			.on('end', function() {
				console.log(socket_session_id);
				io.to(socket_session_id).emit('like_response', {status : 1, message: "Successfully Liked"});
			});
		}
	});
}

function updateTrendingLooops(data, socket_session_id){
	console.log("Latitude"+data.latitude);
	console.log("Longitude"+data.longitude);
	var trending_looop_in_that_location = connection.query('SELECT stat.id as looop_id, user.name, stat.status as status, stat.status_type, stat.image_url, DATE_FORMAT(stat.created_at, "%Y-%m-%d %H:%i:%S") as posted_time, stat.user_id as user_id, @total_likes:=(SELECT COUNT(*) FROM likes where status_id = stat.id ) AS `total_likes`, if((lik.status_id = stat.id and lik.user_id = '+data.user_id+'), true, false) AS like_status , if((fol.user_id = stat.user_id and fol.following_id = '+data.user_id+'), true, false) AS relationship, ( 6371 * acos( cos( radians('+data.latitude+') ) * cos( radians( stat.status_location_latitude ) ) * cos( radians( stat.status_location_longitude ) - radians('+data.longitude+') ) + sin( radians('+data.latitude+') ) * sin( radians( stat.status_location_latitude ) ) ) ) AS distance FROM status as stat LEFT JOIN following_mapping as fol on fol.user_id = stat.user_id LEFT JOIN likes as lik on lik.status_id = stat.id LEFT JOIN users as user on user.id = stat.user_id where lik.status_id = stat.id group by status_id HAVING distance < 1000');
	all_looops = []; // this array will contain the result of our db query

	trending_looop_in_that_location
	.on('error', function(err) {
		console.log(err);
	})
	.on('result', function(loops) {
		all_looops.push(loops);
	})
	.on('end', function() {
		//console.log(all_looops);
		io.to(socket_session_id).emit('trending_looop_in_that_location', {status : 1, message: "Looops Retrived Successfully", looops: all_looops});
	});
}

function newFollow(data, socket_session_id){
	var insert_new_follow = connection.query('insert into following_mapping (`user_id`, `following_id`) values ('+data.user_id+', '+data.following_id+')');
	new_follow_id = [];
	insert_new_follow
	.on('error', function(err) {
		console.log(err);
	})
	.on('result', function(follow) {
		new_follow_id.push(follow.insertId);
	})
	.on('end', function() {
		console.log(socket_session_id);
		io.to(socket_session_id).emit('follow_response', {status : 1, message: "Followed Successfully", followed_id: data.user_id});
	});
}

function newImageLooops(data, socket_session_id){
	//console.log(data.image);
	
	var profile = 1;
	var bitmap = new Buffer(data.image);

	var timestamp = new Date().getTime().toString();
	var file_path;
	var return_path = "http://ec2-54-254-235-212.ap-southeast-1.compute.amazonaws.com/hashlooop/image_looops/";
	var image_name = "u_"+data.user_id+"_"+timestamp+".jpeg";
	mkdirp(__dirname + "/image_looops/",function(er)
	{

	  if(er) console.log(er);

	  //file_path = ;
	  //console.log(file_path);
	  fs.writeFileSync(__dirname + "/image_looops/"+image_name,bitmap);

	});
	file_path = return_path + image_name;
	console.log(file_path);
	
	//SELECT id, user_id, status, ( 3959 * acos( cos( radians('+data.latitude+') ) * cos( radians( status_location_latitude ) ) * cos( radians( status_location_longitude ) - radians('+data.longitude+') ) + sin( radians('+data.latitude+') ) * sin( radians( status_location_latitude ) ) ) ) AS distance FROM status HAVING distance < 20
	var check_looops_in_that_location = connection.query('SELECT id, user_id, status, ( 3959 * acos( cos( radians('+data.latitude+') ) * cos( radians( status_location_latitude ) ) * cos( radians( status_location_longitude ) - radians('+data.longitude+') ) + sin( radians('+data.latitude+') ) * sin( radians( status_location_latitude ) ) ) ) AS distance FROM status HAVING distance < 1');
	all_looops = []; // this array will contain the result of our db query

	check_looops_in_that_location
	.on('error', function(err) {
		console.log(err);
	})
	.on('result', function(loops) {
		all_looops.push(loops);
	})
	.on('end', function() {
		var insert_new_looops = connection.query('insert into status (`user_id`, `status_type`, `status`, `image_url` ,`status_location_latitude`, `status_location_longitude`) values ('+data.user_id+', "2", "'+data.caption+'", "'+file_path+'" ,"'+data.latitude+'", "'+data.longitude+'")');
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
			var broadcast_looop_to_all = connection.query('SELECT id, name, socket_session_id, ( 3959 * acos( cos( radians('+data.latitude+') ) * cos( radians( current_location_latitude ) ) * cos( radians( current_location_longitude ) - radians('+data.longitude+') ) + sin( radians('+data.latitude+') ) * sin( radians( current_location_latitude ) ) ) ) AS distance FROM users HAVING distance < 1');
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
				if(all_looops.length > 0){
					io.to(socket_session_id).emit('looop_success', {status : 1, message: "Looops Posted Successfully"});
				}else{
					var insert_discoverer_badge = connection.query('insert into badges_mapping (`user_id`, `badge_id`) values ('+data.user_id+', "1")');					
					io.to(socket_session_id).emit('looop_success', {status : 2, message: "Looops Posted Successfully!! You are the Discoverer of that Location"});
				}
				var get_user_name = connection.query('SELECT name from users where id = "'+data.user_id+'"');
				users = []; // this array will contain the result of our db query

				get_user_name
				.on('error', function(err) {
					console.log(err);
				})
				.on('result', function(user) {
					users.push(user);
				})
				.on('end', function() {
					for(var i = 0; i < all_users.length; i++){
						io.to(all_users[i].socket_session_id).emit('looop_post_notification', {status : 3, message: "New Image Looop Data", looop_user_id: data.user_id, looop_id : looops_id[0], looop: data.caption, image_looop_url : file_path, looop_user_name: users[0].name });
					}	
				});
			});
		});
	});
}


process.on('uncaughtException', function (err) {
 fs.appendFile("./server_err.log", ((new Date) + err.stack), function(err) {
  if(err){
   console.log(err);
  }
 });
 console.log(err.message);
});