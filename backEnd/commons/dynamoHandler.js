let AWS, dynamodb;

AWS = require(`${process.env['IS_OFFLINE'] ? '../node_modules/aws-sdk' : 'aws-sdk' }`);

AWS.config.update({
  accessKeyId : process.env['ACCESS_KEY_ID'],
  secretAccessKey : process.env['SECRET_ACCESS_KEY'],
  region: "us-east-1"
});

dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.query = function(query, fn) {
  return dynamodb.query(query, function(err, data) {
    return fn(err, data);
  });
};

module.exports.scan = function(query, fn) {
  return dynamodb.scan(query, function(err, data) {
    return fn(err, data);
  });
};

module.exports.delete = function(query, fn) {
  return dynamodb.delete(query, function(err, data) {
    return fn(err, data);
  });
};

module.exports["get"] = function(query, fn) {
  return dynamodb.get(query, function(err, data) {
    return fn(err, data);
  });
};

module.exports.save = function(query, fn) {
  return dynamodb.put(query, function(err, data) {
    return fn(err, data);
  });
};

module.exports.update = function(query, fn) {
  return dynamodb.update(query, function(err, data) {
    return fn(err, data);
  });
};

module.exports.createSet = function(query, fn) {
  return dynamodb.createSet(query, function(err, data) {
    return fn(err, data);
  });
};