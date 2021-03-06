var cli = require('../bin/tower')
  , assert = require('assert')
  , spawn = require('child_process').spawn
  , fs = require('tower-fs');

describe('cli', function(){
  before(clearTmp);

  it('should alias commands', function(){
    assert('create' == cli.alias('create'));
    assert('remove' == cli.alias('remove'));
    assert('create' == cli.alias('generate'));
    assert('create' == cli.alias('g'));
    assert('console' == cli.alias('console'));
    assert('console' == cli.alias('c'));
    assert('server' == cli.alias('server'));
    assert('server' == cli.alias('s'));
    assert('init' == cli.alias('init'));
    assert('init' == cli.alias('new'));
    assert('help' == cli.alias('help'));
    assert('info' == cli.alias('info'));
  });

  describe('info', function(){
    it('should print info', function(done){
      tower('info', function(err, result){
        assert(!err);
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new app', function(done){
      tower('new', 'app1', function(err, result){
        assert(!err);

        assert(fs.existsSync('tmp/app1/app.js'));
        assert(fs.existsSync('tmp/app1/README.md'));

        done();
      })
    });
  });

  describe('create', function(){
    it('should invoke the generator', function(done){
      done();
    });
  });
});

/**
 * Execute a tower command, return output as string.
 */

function tower() {
  var args = Array.prototype.slice.call(arguments)
    , fn = args.pop();

  args.push('--output-directory', 'tmp');

  var child = spawn('./bin/tower', args)
    , result = ''
    , error = '';

  child.stdout.setEncoding('utf-8');
  child.stdout.on('data', function(data){
    result += data;
  });

  child.stderr.setEncoding('utf-8');
  child.stderr.on('data', function(data){
    error += data;
  });

  child.on('close', function(){
    fn(error ? error : null, result);
  });
}

function clearTmp() {
  if (fs.existsSync('tmp'))
    fs.removeDirectoryRecursiveSync('tmp');
  
  fs.mkdirSync('tmp');
}