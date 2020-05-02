const express = require('express');
const { check, validationResult } = require('express-validator');
const session = require('express-session');
const csrf = require('csurf');
const bcrypt = require('bcrypt');
const Auth = require('../middleware/auth');
const router = express.Router();
const User = require('../models/User');



//   Index


router.get('/', (req, res, next) => {
	res.render('index');
});



//   Register User

router.get('/register', (req, res, next) => {
	res.render('register');
});



router.post('/register',


	//   Validation

	[
		check('email').not().isEmpty().trim().escape().isEmail().normalizeEmail().withMessage('Email must be an email'),
		check('password').not().isEmpty().trim().escape().isLength({ min: 6 }).withMessage('Password must be at least 6 chars long'),
		check('confirm_password').not().isEmpty().trim().escape().withMessage('Password must be at least 6 chars long'),
	], 
	
	
	async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.render('register', {errors: errors.errors });
	}

	
	
	//  Get fields from request
	const email = req.body.email;
	const password = req.body.password;
	const confirm_password = req.body.confirm_password;


	if (password !== confirm_password){
		return res.render('register', {errors: [{msg: "Passwords must match"}]});
	}

  
	//   See if user already exists

	try {

		let existing_user = await User.findOne({ email: email });


		//   Stop if email already exists
		if (existing_user) {
			return res.redirect('/signup');
		  }


		let hashedPassword = await bcrypt.hash(password, 12);

		const user = new User({
			email: email,
			password: hashedPassword,
		  });

		  let result = await user.save();
		  res.redirect('/login');
		
	}
	catch(err){
		console.log(err);
	}

});








//   Login User



router.get('/login', (req, res, next) => {
	res.render('login');
});



router.post('/login',

[
	check('email').not().isEmpty().trim().escape().isEmail().normalizeEmail(),
	check('password').not().isEmpty().trim().escape(),
],

async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.render('login', {errors: errors.errors });
	}

	//   Get form data

	const email = req.body.email;
	const password = req.body.password;
  
	//  Check if the Email Field is correct
  

	try{
		let user = await User.findOne({ email: email });

		if (!user) {
			return res.render('login', {errors: [{msg: "User does not exist"}] });
		  }

		  //   Check if passwords match

		  let doMatch = await bcrypt.compare(password, user.password);
		  if (doMatch) {
  
			//   Create session

			req.session.LoggedIn = true;
			req.session.user = user;
			
			
			//   Save session and redirect

			return req.session.save(err => {
			  console.log(err);
			  res.redirect('/protected');
			});

		  }

		  else{

			//   Redirect to login if passwords do not match

			return res.render('login', {errors: [{msg: "Invalid Credentials"}] });
		  }
		  

	}
	catch(err){
		console.log(err)
	}
	
});


//   Logout

router.get('/logout',async (req, res, next) => {

	req.session.destroy(err => {
		console.log(err);
		res.redirect('/');
	  });
	
});




//   Protected Page
router.get('/protected', Auth, (req, res, next) => {
	res.render('protected');
});









module.exports = router;
