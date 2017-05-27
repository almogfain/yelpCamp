var Camps = require("../moduls/camp");
var Comments = require("../moduls/comment");

var middleObj = {};

middleObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated())
    {
        return next();
    }
    
    req.flash("error", "Please login first...");
    res.redirect("/login");
}

middleObj.isOwnsCamp = function(req, res, next){
    if(req.isAuthenticated())
    {
        Camps.findById(req.params.id, function(err, foundCamp){
        
            if(err)
            {
                req.flash("error", "Something went wrong...");
                console.log(err);
                res.redirect("back");
            }
            else
            {
                if(foundCamp.createdBy.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error", "You don't have permission to do this action");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error", "Please login first...");
        res.redirect("back");
    }
}


middleObj.isOwnsComment = function(req, res, next){
    if(req.isAuthenticated())
    {
        Comments.findById(req.params.comId, function(err, foundComm){
            if(err)
            {
                req.flash("error", "Something went wrong...");
                console.log(err);
                res.redirect("back");
            }
            else
            {
                if(foundComm.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error", "You don't have permission to do this action");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error", "Please login first...");
        res.redirect("back");
    }
}

module.exports = middleObj;