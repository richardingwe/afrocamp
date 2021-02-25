const   express    = require("express"),
        passport   = require("passport"),
        User       = require("../models/user"),
        router     = express.Router();

router.get("/", (req, res) => {
	res.render("landing");
});

//show register form
router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err){
			req.flash("error", err.message);
			return res.render("register")
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome To AfroCamp" + " " + user.username);
			res.redirect("/campgrounds");	
		});
	});
});

//show login form
router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", passport.authenticate("local",
	 {
		 successRedirect: "/campgrounds",
		 failureRedirect: "/login"
	 }), (req, res) => {			
});

//logout 
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;