var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const passport = require('passport');

const expressValidator = require('express-validator');
const flash = require('connect-flash');

//koneksi database mongodb
const mongo = require('mongodb');
const db = require('monk')('mongodb://localhost/nodeblog');


const index = require('./routes/index');
const posts = require('./routes/posts');
const categories = require('./routes/categories');
const pages = require('./routes/pages');
const users = require('./routes/users');


const app = express();

//buat variabel dan method moment untuk global
app.locals.moment = require('moment');
app.locals.truncateText = (text,length) => {
  let truncatedText = text.substring(0,length);
  return truncatedText + " ...";
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// menggunakan session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//gunakan password
app.use(passport.initialize());
app.use(passport.session());

//setting flash messages
app.use(require('connect-flash')());
app.use(flash());
app.use((req,res,next)=>{
  res.locals.messages = require('express-messages')(req,res);
  next();
});

//setting express validator
app.use(expressValidator({
  errorFormatter: (param,msg,value) =>{
    var namespace= param.split('.'),
    root = namespace.shift(),
    formParam = root;
    
    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//set globals variabel untuk mengecek apakah sudah ada user yang login
//route ke semua endpoint
app.get('*',(req,res,next)=>{
  //buat variabel users apabila ada req. user yang sebelumnya login atau NULL jika belum login
  res.locals.user = req.user || null;
  //lanjutkan request
  next();
});


//buat variabel db dapat diakses oleh router dengan `app.use()`
app.use((req,res,next) => {
  req.db = db;
  next(); 
});

//use middleware
app.use('/', index);
app.use('/posts', posts);
app.use('/categories', categories);
app.use('/pages',pages);
app.use('/users',users);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen('8081', ()=>{
  console.log('Server Sudah jalan di port 8081....');
});

module.exports = app;
