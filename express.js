var express = require('express');
var mongoskin = require('mongoskin');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(logger('dev'));


var db = mongoskin.db('mongodb://@localhost:27017/todo?auto_reconnect', {safe:true});

app.use(function (req, res, next) {
  // create an object to store multiple collections
  req.db = {};
  req.db.tasks = db.collection('tasks');
  next();
});


app.get('/', function (req, res, next) {
  res.send('please select a collection, e.g.,/collections/messages\n\n');
});




// GET ALL INCOMPLETED TASKS.
app.get('/todolist/:collectionName', function (req, res, next){
  req.db.tasks.find({completed: false}, {
    limit: 10, sort: {'_id': -1}
    }).toArray(function(err, results) {
      if (err) return next(err);
      res.send(results);
    });
});

// GET ALL COMPLETED TRUE.
app.get('/todolist/:collectionName/completed', function (req, res, next){
  req.db.tasks.find({completed: true})
    .toArray(function(err, results) {
      if (err) return next(err);
      res.send(results);
    });
});

// INSERT ONE TASK
app.post('/todolist/:collectionName', function(req, res, next) {
  if (!req.body || !req.body.name) return next(new Error('No data provided!'));
  req.db.tasks.insert({name: req.body.name, completed: false}, 
    function (err, result) {
      if (err) return next(err);
      if (!result) return next(new Error('failed to save!'));
      res.send(result);
    });
});

// MARKALL COMPLETED TASK
app.put('/todolist/:collectionName', function(req, res, next) {
  if (!req.body.all_done || req.body.all_done !== 'true') return next();
  req.db.tasks.update({completed: false}, {$set: { completed: true}},
  {multi: true}, function(err, count) {
    if (err) return next (err);
    res.send('updated ' + count + ' documents');
  });
});

// MARK ONE COMPLETE TASK
app.put('/todolist/:collectionName/:task_id', function (req, res, next) {
  if (!req.body.completed) return next(new Error('Param is missing'));
  req.db.tasks.updateById(req.params.task_id, {$set: {completed: true}}, 
  {multi: false}, function (err, count) {
    if (err) return next(err);
    if (count !== 1) return next(new Error('something went wrong'));
    res.send((count === 1) ? {msg: 'success'} : {msg: 'error'}); 
  });
});

// DELETE ONE COMPLETE TASK
app.delete('/todolist/:collectionName/:task_id', function (req, res, next) {
  req.db.tasks.removeById(req.params.task_id, function (err, count) {
    if (err) return next(err);
    res.send((count === 1) ? {msg: 'success'} : {msg: 'error'}); 
  });
});

// CATCH ALL MISTYPED URLS.
app.all('*', function (req, res) {
  res.status(404).send();
});

app.listen(3001, function () {
  console.log('Express server listening on port 3001');
});

