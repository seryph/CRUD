const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Comment = require('../models/Comment');




//   Create Comment
router.post('/add_comment', [check('add_comment').not().isEmpty().trim().escape()] , async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.redirect('/');
	}

	try {
  
		const new_comment = new Comment({
			text: req.body.add_comment
		});

  
		const added_comment = await new_comment.save();
		return res.redirect('/');
	  } catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	  }
});





//   Read Comments
router.get('/', async (req, res, next) => {

	try {
		const comments = await Comment.find({}) || {};
		res.render('index', {comments: comments});
	  } catch (err) {
		res.render('index', {comments: comments});
	  }
  });


//  Update Comments
router.post('/edit-product', [check('edited_comment').not().isEmpty().trim().escape()], async (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.redirect('/');
	}

	try {

		const comment_id = req.body.edit_comment_id;
		const edited_text = req.body.edited_comment;
  
		let comment = await Comment.findById(comment_id);
		comment.text = edited_text;
		const updated_comment = await comment.save();
		return res.redirect('/');
		
	  } catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	  }

	  
});




//   Delete Comments
router.post('/delete_comment', async (req, res) => {
	try {
	  const comment = await Comment.findById(req.body.comment_id);
  
	  await comment.remove();
  
	  res.redirect('/');
	} catch (err) {
	  console.error(err.message);
	  res.redirect('/');
	}
  });





module.exports = router;
