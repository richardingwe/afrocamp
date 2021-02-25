const express = require("express"),
      router = express.Router(),
      campground = require("../models/campground"),
	  comment = require("../models/comment"),
	  middleware = require("../middleware");

      
router.get("/:id/comments/new",  middleware.isLoggedIn, (req, res) => {
	//find campgrounds by id
	campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

router.post("/:id/comments",  middleware.isLoggedIn, (req, res) => {
	//look up campground using ID
	campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			comment.create(req.body.comment, (err, comment) => {
				if (err){
					req.flash("error", "Something went wrong");
					console.log(err);
				} else{
					///add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added a comment");
					res.redirect("/" + campground._id);
				}
			});
		}
	});
});
//comment edit route
router.get("/:id/comments/:comment_id/edit",  middleware.checkCommentOwnership, (req, res) => {
	comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err){
			res.redirect("back");
		} else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//comment update route
router.put("/:id/comments/:comment_id",  middleware.checkCommentOwnership, (req, res) => {
	comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment successfullly edited!");
			res.redirect("/" + req.params.id);
		}
	});
});

//comment destroy route
router.delete("/:id/comments/:comment_id",  middleware.checkCommentOwnership, (req, res) => {
	comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment successfullly deleted!");
			res.redirect("/" + req.params.id);
		}
	});
});


module.exports = router;