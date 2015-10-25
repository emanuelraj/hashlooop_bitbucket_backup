var CronJob = require('cron').CronJob;
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
var job = new CronJob({
  cronTime: '0 */2 * * * *',
  onTick: function() {
    /*
     * Runs every weekday (Monday through Friday)
     * at 11:30:00 AM. It does not run on Saturday
     * or Sunday.
     */
	 var check_user_count = connection.query('select count(*) from users');
	users = []; // this array will contain the result of our db query

	check_user_count
	.on('error', function(err) {
		console.log(err);
	})
	.on('result', function(user) {
		users.push(user);
	})
	.on('end', function() {
		//console.log(users);
		console.log("Cron Job");
	});
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();