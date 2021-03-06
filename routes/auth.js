var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");



////////////////////////////////Register/////////////////////////////////////////
router.get("/register",function(req,res){
    res.render("signup");
});
router.post("/register",function(req,res){
    var newuser=new User({username:req.body.username});
    User.register(newuser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req,res,function(){

        });
    });
});

/////////////////////////////////////////Login///////////////////////////////////////////////////////////

router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect:"/home",
    failureRedirect:"/register"
}),function(req,res){

});

///////////////////////////////////////////////////LOGOUT///////////////////////////////////////////////////////////////

router.get("/logout",function(req,res){
    
    req.logout();
    res.redirect("/home");
  
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
    
}

module.exports=router;
