var express             =require("express"),
 mongoose               =require("mongoose"),
 methodOverride         =require("method-override"),
 bodyParser             =require("body-parser"),
 passport               =require("passport"),
 LocalStrategy          =require("passport-local"),
 passportLocalMongoose  =require("passport-local-mongoose")
 app                    =express()
 User                   =require("./models/user");

mongoose.connect("mongodb://localhost/blogsite");


app.set("view engine","ejs");
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(require("express-session")({
    secret:"COOOOOL COOOOL COOOL",
    resave:false,
    saveUninitialized: false
}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

mongoose.Promise=global.Promise;
/////////////////////////////////////////////////////////SCHEMA/////////////////////////////////////////////////////////////////
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    
    created:{
        type:Date,
        default:Date.now
    }


});







app.get("/blogs/home",isLoggedIn,function(req,res){
    res.render("home");
});
////////////////////////////////////////////////CREATING DATABASE///////////////////////////////////////////////////////
var Blog=mongoose.model("Blogs",blogSchema);
/////////////////////////////////////////////////ROUTING///////////////////////////////////////////////////////////////////////
app.get("/blogs",isLoggedIn,function(req,res){

    Blog.find({},function(err,data){
        if(err)
        {
            console.log("error");
        }
        else{
            res.render("index",{data:data});
            
        }
    });
});


//////////////////////////////////////////CREATE POST////////////////////////////////////////////////////////////////////////
app.get("/blogs/new",isLoggedIn,function(req,res){
    res.render("new");

});
app.post("/blogs",isLoggedIn,function(req,res){
    Blog.create(req.body.Blog,function(err,newBlog){

    
    if(err){
        console.log("error")
    }
    else{
        res.redirect("/blogs")
        
    }
});
});
/////////////////////////////////////////READ MORE/////////////////////////////////////////////////////////////////////
app.get("/blogs/:id",isLoggedIn,function(req,res){
    Blog.findById({_id:req.params.id},function(err,found){
        if(err){
            res.redirect("/blogs");
            console.log(err);

        }
        else{
            res.render("show",{b:found});

        
        }

    });
});
///////////////////////////////////////EDIT BLOG//////////////////////////////////////////////////////////////////////////////////////
app.get("/blogs/:id/edit",isLoggedIn,function(req,res){
    Blog.findById({_id:req.params.id},function(err,found){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{b:found});
        }
        

    });
});
//////////////////////////////////////UPDATE BLOG/////////////////////////////////////////////////////////////////////////////////////

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate({_id:req.params.id},req.body.Blog,function(err,updatedblog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
////////////////////////////////////////////delete blog//////////////////////////////////////////////////////////
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove({_id:req.params.id},function(err){
        if(err){
            res.redirect("/blogs");

        }
        else{
            res.redirect("/blogs")
        }
    })
})






///////////////////////////////////////////////SIGN UP/////////////////////////////////////////////////////////////////////
app.get("/register",function(req,res){
    res.render("signup");
});

app.post("/register",function(req,res){
    req.body.username
    req.body.password
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
           return  res.redirect("signup");
        }
            passport.authenticate("local")(req,res,function(){
                res.redirect("/login");
            });
        
    });
});

/////////////////////////////////////////Login///////////////////////////////////////////////////////////

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/blogs/home",
    failureRedirect:"/signup"
}),function(req,res){

});

///////////////////////////////////////////////////LOGOUT///////////////////////////////////////////////////////////////

app.get("/logout",function(req,res){
    var name = req.user.username;
    req.logout();
    res.redirect("/login");
  
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
    
}











app.listen(2000,function(){
    console.log("running")
});