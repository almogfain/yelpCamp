var express = require("express");
var router = express.Router({mergeParams: true});
var Camps = require("../moduls/camp");
var Comments = require("../moduls/comment");
var middleware = require("../middleware/middleware");

// Comment routs
router.get("/new", middleware.isLoggedIn, function(req, res){
    var campId = req.params.id;
    res.render("comments/new", {campId: campId});
});
   
router.post("/", middleware.isLoggedIn, function(req, res){
    var campId = req.params.id;
    Camps.findById(req.params.id).populate("comments").exec(function(err, camp){
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else
        {
            Comments.create(req.body.comment, function(err, newComm){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log(req.user);
                    newComm.author.id = req.user._id;
                    newComm.author.name = req.user.username;
                    newComm.save();
                    camp.comments.push(newComm);
                    camp.save();
                    req.flash("success", "Comment saved");
                    res.redirect("/campgrounds/" + campId);
                }
            });
        }
    });
});

router.get("/:comId/edit", middleware.isOwnsComment, function(req, res){
    var campId = req.params.id;
    Comments.findById(req.params.comId, function(err, foundComm) {
        res.render("comments/edit", {campId: campId, comment: foundComm});
    });
});


router.put("/:comId", middleware.isOwnsComment, function(req, res){
    var comId = req.params.comId;
    Comments.findByIdAndUpdate(comId, req.body.ucomment, function(err, comm){
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);    
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);    
        }
    });
});

router.delete("/:comId", middleware.isOwnsComment, function(req, res){
    var comId = req.params.comId;
    Comments.findByIdAndRemove(comId, function(err){
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);    
        }
        else
        {
            Camps.findByIdAndUpdate(req.params.id, { $pull: {comments: comId}}, function(err){
                if(err)
                {
                    console.log(err);
                    res.redirect("/campgrounds/" + req.params.id);    
                }
                else
                {       
                    res.redirect("/campgrounds/" + req.params.id);    
                }
            });
        }
    });
});

module.exports = router;