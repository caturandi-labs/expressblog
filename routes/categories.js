//insiasi express dan express router
var express = require('express');
var router = express.Router();

//inisiasi mongodb dan koneksi ke mongodb
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

//route endpoint untuk menampilkan halaman tambah kategori
router.get('/add',(req,res,next) => {
    //passing variabel title
    res.render('addcategory',  {
        title: 'Add Category'
    });
});

//untuk filter berdasarkan kategori
router.get('/show/:category',(req,res,next) => {
    //menerima hasil seluruh data dari collections posts pada DB
    const posts = db.get('posts');

    //dapatkan kategori
    posts.find({category: req.params.category},{}, (err,posts)=>{
        res.render('index', {
            title: req.params.category,
            posts: posts
        });
    });
});

//route endpoint untuk menyimpan kategori
router.post('/add',(req,res,next)=>{
    const name = req.body.name;

    req.checkBody('name', 'Nama Kategori Tidak Boleh Kosong').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        // jika terjadi validari error, kembali ke addcategory dan tampilkan error
        res.render('addcategory', {
            'errors': errors
        });
    }else{
        //dapatkan semua kategori
        const categories = db.get('categories');
        
        //tambah kategori
        categories.insert({
            name: name
        },(err,category)=>{
            //jika kategori berhasil ditambah, tampilkan flash message
            req.flash('success',"Kategori Berhasil Disimpan");
            //kembali ke halaman utama
            res.location('/');
            res.redirect('/');
        });
    }
});

//export module router
module.exports = router;