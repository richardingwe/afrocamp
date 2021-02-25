const   campground    = require("../models/campground"),
        comment       = require("../models/comment"),
        middlewareObj = {}

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	if(req.isAuthenticated()){
		campground.findById(req.params.id, (err, foundCampground) => {
			if(err) {
				res.redirect("back");
			} else{
				//does user own the campground??
				if(foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You do not have permission to do that");
					res.redirect("back");
				}	
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that")
		res.redirect("back");
	}
}


middlewareObj.checkCommentOwnership = (req, res, next) => {
	if(req.isAuthenticated()){
		comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err) {
				res.redirect("back");
			} else{
				//does user own the comment??
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "something went wrong");
					res.redirect("back");
				}	
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}




middlewareObj.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}



module.exports = middlewareObj;