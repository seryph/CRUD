const edit = document.querySelectorAll(".edit_button");
const edit_comment_div = document.querySelectorAll('.edit_comment_div');



for (var i=0; i<edit.length; i++) {


	
	
	edit[i].addEventListener('click', function(e) {
		console.log(e);
		e.target.nextElementSibling.classList.toggle("hide");
	});	

	//   e.target.nextElementSibling.classList.toggle("hide")
	// e.target.parentNode.childNodes[3].className.replace(/\bmystyle\b/g, "row");
	//e.target.nextElementSibling.childNodes[3].classList.toggle("hide");
  }

