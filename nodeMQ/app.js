
/**
 * Module dependencies.
 */

var Guid = require('guid');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mysql = require('mysql');
//var context = require('rabbit.js').createContext();

//context.on('ready', function() {
//  var pub = context.socket('PUB'), sub = context.socket('SUB');
//  sub.pipe(process.stdout);
//  sub.connect('events', function() {
//    pub.connect('events', function() {
//      pub.write(JSON.stringify({welcome: 'rabbit.js'}), 'utf8');
//    });
//  });
//});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));   
});

function Message(messageType){
    this.messageType = messageType;
    this.message = ""; //default value
    this.dateStamp = new Date();
    this.Id = Guid.create();
}

Message.prototype.fooBar = function(){
    // do something
};

var ConnectToDatabase = function(host, user, database, password){
    var connection = mysql.createConnection({
        host     : host,
        user     : user,
        database : database,
        password : password,
    });

    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);
    });
    return connection;
};


var connection = ConnectToDatabase('localhost', 'sa','shitbox','deepend123');

var object = new Message("GPS");
object.message = "this is a message";

connection.query('INSERT INTO shitbox.messages SET ?', object, function(err, result) {
    // Neat!
});

GetMessages(connection, "GPS");

function GetMessages(connection, messageType){
    var query = connection.query('SELECT * FROM shitbox.messages WHERE messageType = "'+ messageType + '"', function(err, results) {
        console.log(results);// ...
    }); 
    console.log(query.sql); 
};





