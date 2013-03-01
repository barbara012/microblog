var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new Db(settings.db, new Server(setting.host, Connection.DEFAULT_PORT, {}));
