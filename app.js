const express=require('express');
const bodyParser=require('body-parser');
const _=require('lodash');
const MongoClient=require('mongodb');
const session=require('express-session');
//const mongoose=require('mongoose');
var app=express();
 app.use(bodyParser.json());
  app.use(express.json());
// app.use(express.bodyParser());
app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "Shh, its a secret",
				 resave:true,
				 saveUninitialized:true}));
app.set('view engine','ejs');
//const mongoose=require('mongoose');

const mongoose = require('mongoose');

    mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true,useUnifiedTopology: true});
  // mongoose.connect('mongodb+srv://Meghana:4sfEPMeUB0CWuBIY@cluster0.53z2g.mongodb.net/blogintern?retryWrites=true&w=majority', {useNewUrlParser: true,useUnifiedTopology: true});

// const blogSchema=new mongoose.Schema({
// 	title: String,
// 	content: String
// });
// //password:4sfEPMeUB0CWuBIY;
// //userid:Meghana;
// const Blog=mongoose.model('Blog',blogSchema);
var blogs=[
{
	title: 'Blog1',
	content: "lorem kmjshgfdsxcvbnmpoiuytrcvbn.;otrewasbnm xfghjpoiuytrewdfghjmnbvcxeuim jhgfdsxcvb	fghjk,mnbvcdftyuimnvfyuikmncxsertyuio",
},
{
	title: 'Blog2',
	content: "lorem kmjhgfdsxcvbnmpoiuytrcvbn.;otrewasbnm xfghjpoiuytrewdfghjmnbvcxeuim jhgfdsxcvb	fghjk,mnbvcdftyuimnvfyuikmncxsertyuio",
},
]
// const Blog=mongoose.model('Blog',blogSchema);
const blogSchema=new mongoose.Schema({
	title: String,
	name: String,
	content: String
}
,{
	timestamps:{
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});
//password:4sfEPMeUB0CWuBIY;
//userid:Meghana;
 const Blog=mongoose.model('Blog',blogSchema);

const userSchema=new mongoose.Schema({
	username: String,
	 name: String,
	password: String
}
,{
	timestamps:{
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

const User=mongoose.model('User',userSchema);
app.get('/',function(req,res){
	Blog.find({},function(err,blogs){
		res.render('index',{blogs: blogs});
	
}).sort({created_at: -1});
});
app.get('/blog/:name',function(req,res){
	Blog.find({},function(err , blogs){
		if(err) res.sendStatus(500);
	else{
	var matched=false;
	blogs.forEach((blog, i)=>{
		if(blog.title==req.params.name){
			matched=true;
			res.render('blog',{blog: blog});
		}
    });
    if(matched==false){
    	res.sendStatus(404);
    }
}
});
	
});
// app.get('/add',function(req,res){
// 	res.render('login');
// })
app.get('/add',function(req,res){
	if(req.session.username)
		res.render('add-blog');
	else
		res.redirect('/login');
});

 app.get('/login',function(req,res){
	
		 // if(req.session.username)
 		//  res.render('add-blog');	else
 		// res.redirect('/login')
 		 res.render('login')
	
});
  //app.post('/login',function(req,res){
	
	// 	  // if(req.session.username)
 // 		 res.render('add-blog');	
 // 		// else
 // 		// res.redirect('/login')
	// });
 app.post('/login',function(req,res){
 		User.findOne({username: req.body.username},function(err, user){
 			if(err)
 				res.sendStatus(500);
 			else{
 				if(user){
 					req.session.username=user.username;
 					res.redirect('/add');
 				}
 				else 
 					res.sendStatus(401);
 			}
 			// res.render('add-blog');
 		});
 		//res.render('add-blog')
 });
 
app.get('/logout',function(req,res){
	req.session.destroy();
	res.redirect('/');
});
app.post('/add',function(req,res){
	var newBlog={ 
	 	title: req.body.title,
	 	content: req.body.content,
	};
	 //blogs.push(newBlog);
	new Blog(newBlog).save();
	res.redirect('/');
});
// app.get('/index',function(req,res){
// 	res.render('index');
// })
app.listen(3002,function(){
	console.log("server running in port 3002");
 }); 
