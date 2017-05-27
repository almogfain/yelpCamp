var express      = require("express"),
    bodyp        = require("body-parser"),
    request      = require("request"),
    mongoose     = require("mongoose"),
    app          = express(),
    seed         = require("./seed"),
    flash        = require("connect-flash"),
    LocalStrat   = require("passport-local"),
    passport     = require("passport"),
    campsRout    = require("./routs/camps"),
    commentsRout = require("./routs/comments"),
    override     = require("method-override"),
    authRout     = require("./routs/auth");
    
app.use(bodyp.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/yelp_camp");

var Camps    = require("./moduls/camp");
var Comments = require("./moduls/comment");
var User     = require("./moduls/user");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
    secret: "I just want to be part of your symphony",
    resave: false,
    saveUninitialized: false
}));
app.use(override("_method"));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrat(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//seed();

app.use("/campgrounds", campsRout);
app.use("/campgrounds/:id/comments", commentsRout);
app.use(authRout)
// Common routs

// Start up the server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server in running...");
});

