const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const compression = require('koa-compress');
const router = require('koa-router')();
const kstatic = require('koa-static');
const convert = require('koa-convert');
const app = new Koa();
const Pug = require('koa-pug');
const send = require('koa-send');
const fs = require('fs');
var path = require('path');
global.appRoot = path.resolve(__dirname);

new Pug({
  app: app,
  viewPath: './views/'
});

router.get('/', ctx => {
  ctx.render('index');
});

function getTodos() {
  return new Promise(function(resolve, reject) {
    fs.readFile(appRoot + '/todo.json', 'utf8', function (err,data) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

router.get('/todo', async (ctx) => {
  var dataPromise = getTodos();
  await dataPromise.then(function(result) {
      var output = '<div>';
      for(var i=0; i<result.length; i++){
        output = output +  '<div>' + result[i].text + ' ' + result[i].done + '</div>';
      }
      output = output + '</div>';
      ctx.render('todo', {todos :output});
  });
});


app.use(convert(kstatic(__dirname + '/static')));
app.use(bodyParser());
app.use(compression());
app.use(router.routes())
  .use(router.allowedMethods());





app.listen(3007, function() {
  console.log('listen port 3007!')
});



