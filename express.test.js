var request = require('superagent');
var expect = require('expect');

// NOTE: when writing synchronous code, you can omit the callback done and 
// mocha will continue to the next test.

describe('Todo RESTAPI', function () {
  var id;
  // POST TASK.
  it('Posts a task', function (done) {
    request.post('http://localhost:3001/todolist/tasks')
      .send(({name: 'tell him to call me'}))
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).toEqual(null);
        expect(res.body.length).toEqual(1)
        expect(res.body[0]._id.length).toEqual(24);
        id = res.body[0]._id;
        console.log(id)
        done();
      });
  });

  // GET A TASK
  it('retrieves a task', function(done) {
    request.get('http://localhost:3001/todolist/tasks/')
    .end(function (err, res) {
      // console.log(res.body)
      expect(err).toEqual(null)
      expect(typeof res.body).toEqual('object');
      expect(res.body[0].completed).toEqual(false);
      expect(res.body[0]._id.length).toEqual(24);
      expect(res.body[0]._id).toEqual(id);
      done();
    });
  });

  // RETRIEVES ALL COMPLETED TASK.
  it('retrieves all completed task', function(done) {
    request.get('http://localhost:3001/todolist/tasks/completed')
    .end(function (err, res) {
      // console.log(res.body)
      expect(err).toEqual(null)
      expect(typeof res.body).toEqual('object');
      expect(res.body.map(function(item){return item.completed})).toContain(true)
      expect(res.body[0]._id.length).toEqual(24);
      done();
    });
  });

  // UPDATES ONE TASK TO COMPLETED.
  it('Updates a task to completed', function (done) {
    request.put('http://localhost:3001/todolist/tasks/'+id)
    .send({completed: true})
    .end(function (err, res) {
      expect(err).toEqual(null)
      // console.log(res.body)
      expect(res.body.msg).toEqual('success');
      done()
    })
  })

  // DELETE A TASK.
  it('Deletes a task', function (done) {
    request.del('http://localhost:3001/todolist/tasks/'+id)
    .end(function (err, res) {
      expect(err).toEqual(null)
      expect(res.body.msg).toEqual('success')
      done()
    })
  })











})