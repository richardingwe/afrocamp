const express = require('express'),
	campground = require('../models/campground'),
	router = express.Router(),
	middleware = require('../middleware');

router.get('/campGrounds', async (req, res) => {
	//get all campgrounds
	try {
		const allCampgrounds = await campground.find();
		res.render('campgrounds/campgrounds', { campgrounds: allCampgrounds });
	} catch (e) {
		console.log(e);
	}
});

// router.get("/campGrounds", (req, res) => {
// 	//get all campgrounds
// 	campground.find({}, (err, allCampgrounds) => {
// 		if(err){
// 			console.log(err);
// 		} else{
// 			res.render("campgrounds/campgrounds", {campgrounds:allCampgrounds});
// 		}
// 	});
// });

router.post('/campgrounds', middleware.isLoggedIn, (req, res) => {
	//get data from database and add to campgrounds
	var name = req.body.name,
		price = req.body.price,
		image = req.body.image,
		desc = req.body.description,
		author = {
			id       : req.user._id,
			username : req.user.username
		},
		newCampground = { name, price, image, description: desc, author };
	//create new campground and save to Db
	campground.create(newCampground, (err, newlyCreated) => {
		if (err) {
			console.log(err);
		} else {
			req.flash('success', 'Campground successfullly created!');
			res.redirect('/campGrounds');
		}
	});
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

router.get('/:id', async (req, res) => {
	//find the campground with provided ID
	try {
		const foundCampground = await campground.findById(req.params.id).populate('comments').exec();
		res.render('campgrounds/show', { campground: foundCampground });
	} catch (e) {
		console.log(e);
	}
});

//edit campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
	campground.findById(req.params.id, (err, foundCampground) => {
		res.render('campgrounds/edit', { campground: foundCampground });
	});
});

//update campground route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			res.redirect('/campground');
		} else {
			req.flash('success', 'Campground successfullly edited!');
			res.redirect('/' + req.params.id);
		}
	});
});

//delete campground route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	campground.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Campground successfully deleted');
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;
