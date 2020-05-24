var mongoose               =require("mongoose")
passportLocalMongoose      =require("passport-local-mongoose");


var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    
    created:{
        type:Date,
        default:Date.now
    }


});
blogSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("Blog",blogSchema);