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


var blogRoutes=require("./routes/blogrout"),
authRoutes=require("./routes/auth");

/////////////PASSPORT CONFIGURATION///////////////////////
app.use(require("express-session")({
    secret:"COOOOOL COOOOL COOOL",
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

mongoose.Promise=global.Promise;



app.use(function(req,res,next){
    res.locals.currentuser=req.user;///////////////////////////to all the templates below it gets added//////////////////////////////////
    next();
});
app.get("/home",function(req,res){
    
    res.render("home",{currentuser:req.user});
    
});


app.use(blogRoutes);
app.use(authRoutes);


app.listen(process.env.PORT||"2000",function(){
    console.log("running")
});
