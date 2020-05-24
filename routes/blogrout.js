
var express          =require("express");
var router=express.Router();
var Blog             =require("../models/blog");






/////////////////////////////////////////////////ROUTING///////////////////////////////////////////////////////////////////////
router.get("/blogs",isLoggedIn,function(req,res){

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
router.get("/blogs/new",isLoggedIn,function(req,res){
    res.render("new");

});
router.post("/blogs",function(req,res){
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
router.get("/blogs/:id",isLoggedIn,function(req,res){
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
router.get("/blogs/:id/edit",isLoggedIn,function(req,res){
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

router.put("/blogs/:id",function(req,res){
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
router.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove({_id:req.params.id},function(err){
        if(err){
            res.redirect("/blogs");

        }
        else{
            res.redirect("/blogs")
        }
    })
})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
    
}
module.exports=router;