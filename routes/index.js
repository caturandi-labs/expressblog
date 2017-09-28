var express = require('express');
var router = express.Router();

//koneksi database mongodb
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

/* GET home page. */
router.get('/', (req, res, next) =>{
  // const db = req.db;
  // dapatkan semua post
  const posts = db.get('posts');
  posts.find({},(err,posts)=>{
    //jika berhasil mengeksekusi query find() , tampilkan view index dengan passing objek posts
    res.render('index', { posts: posts });
  });
});

module.exports = router;
