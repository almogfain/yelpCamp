var express = require("express");
var router = express.Router();
var Camps = require("../moduls/camp");
var Comments = require("../moduls/comment");
var middleware = require("../middleware/middleware");

// Campground routs
router.get("/", function(req, res){
    Camps.find({}, function(err, camps){
       if(err)
       {
           console.log(err);
       }
       else
       {
           res.render("campgrounds/index", {camps: camps , user:req.user});
       }});
});

router.post("/", middleware.isLoggedIn, function(req, res){
   Camps.create({name: req.body.camp, price: req.body.price, img: req.body.imgUrl, description: req.body.desc, createdBy: {id: req.user._id, name: req.user.username}}, function(err, camp){
       if(err)
       {
           console.log(err);
       }
       else
       {
            res.redirect("/campgrounds");
        }
   });
});
   
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});
   
router.get("/:id", function(req, res){
    Camps.findById(req.params.id).populate("comments").exec(function(err, camp){
      if(err)
      {
          console.log(err);
          res.redirect("/campgrounds");
      }
      else
      {
          res.render("campgrounds/show", {camp: camp});
      }
        
    });
});

router.put("/:id", middleware.isOwnsCamp, function(req, res){
    Camps.findByIdAndUpdate(req.params.id, req.body.ucamp, function(err, updatedCamp){
      if(err)
      {
          console.log(err);
          res.redirect("/campgrounds");
      }
      else
      {
          res.redirect("/campgrounds/" + updatedCamp._id);
      }
        
    });
});

router.delete("/:id", middleware.isOwnsCamp, function(req, res){
    Camps.findById(req.params.id, function(err, foundCamp){
      if(err)
      {
          console.log(err);
          res.redirect("/campgrounds");
      }
      else
      {
          Comments.remove({
                            _id: {
                                    $in: foundCamp.comments
                                 }
                         }, function(err){
                             if(err)
                             {
                                console.log(err);
                                res.redirect("/campgrounds");      
                             }
                             else
                             {
                                foundCamp.remove(function(err){
                                  if(err)
                                  {
                                    console.log(err);
                                    res.redirect("/campgrounds");        
                                  }
                                  else
                                  {
                                    res.redirect("/campgrounds");
                                  }
                                });
                             }
                        });
      }
    });
});

router.get("/:id/edit",middleware.isOwnsCamp, function(req, res){
    Camps.findById(req.params.id, function(err, camp){
      if(err)
      {
          res.redirect("/campgrounds");
      }
      else
      {
          res.render("campgrounds/edit", {camp: camp});
      }
        
    });
});

module.exports = router;