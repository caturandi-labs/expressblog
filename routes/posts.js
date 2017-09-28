var express = require('express');
var router = express.Router();

//setting multer untuk proses upload gambar
const multer = require('multer');
const upload = multer({dest: './public/images'});

//setting koneksi database
const mongo = require('mongodb');
const db = require('monk')('mongodb://localhost/nodeblog');


//route endpoint data post tunggal
router.get('/show/:id',(req, res, next)=> {
    //dapatkan semua posts
    const posts = db.get('posts');
    
    //cari post berdasarkan IDS
    posts.findOne({_id: req.params.id },(err,post)=>{
        console.log(post);
        //render view dengan passing variabel post
        res.render('show',{
            post: post
        });
    });
});

/* add post endpoint */
router.get('/add', function(req, res, next) {
    const categories = db.get('categories');

    categories.find({},(err,categories)=>{
        res.render('addpost',{
            title: 'Add Post',
            categories: categories
        });
    });
});

router.post('/add',upload.single('mainimage'), function(req, res, next) {

    //get form val
    const title = req.body.title;
    const category = req.body.category;
    const body = req.body.body;
    const author = req.body.author;
    const date = new Date();
    let mainimage;

    if(req.file){
        mainimage = req.file;
    }else{
        mainimage = 'noimage.png';
    }

    //Form Validation
    req.checkBody('title', 'Judul Tidak Boleh Kosong').notEmpty();
    req.checkBody('body','Isi Tidak Boleh Kosong').notEmpty();

    var errors = req.validationErrors();
    
    if(errors){
        res.render('addpost', {
            errors: errors
        });
    }else{
        const posts = db.get('posts');
        posts.insert({
            title: title,
            body: body,
            category: category,
            date: date,
            author: author,
            mainimage: mainimage
        },(err,post)=>{
            if(err){
                res.send(err);
            }else{
                req.flash('success', 'Post Berhasil Ditambahkan');
                res.location('/');
                res.redirect('/');
            }
        });
    }

});

router.post('/addcomment',(req,res,next)=>{
    //ambil nilai dari form komen
    const postid = req.body.postid;
    const name = req.body.name;
    const email = req.body.email;
    const body = req.body.body;
    const commentdate = new Date();

    req.checkBody('name', 'Nama Harus Diisi').notEmpty();
    req.checkBody('email','Alamat E-Mail harus Disertakan').notEmpty();
    req.checkBody('body', 'Isi Komentar Tidak Boleh Kosong').notEmpty();

    const errors = req.validationErrors();

    if(errors){
        const posts = db.get('posts');
        posts.findOne({_id: req.params.id}, (err, post)=>{
            res.render('show', {
                errors: errors,
                post: post
            });
        });
    }else{
        const comment = {
            name: name,
            email: email,
            body: body,
            commentdate: commentdate
        };

        var posts = db.get('posts');

        posts.update({
            _id: postid
        },{
            $push:{
                comments: comment
            }
        },(err,doc)=>{
            if(err){
                throw err;
            }else{
                req.flash('success', 'Komentar Berhasil Ditambahkan');
                res.location('/posts/show/' + postid);
                res.redirect('/posts/show/' + postid);
            }
        });
    }
});

module.exports = router;
