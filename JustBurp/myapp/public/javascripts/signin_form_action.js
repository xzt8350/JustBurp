/*Sign in Pop-up Window */
$( "#sign-in-box" ).click(function() {
  $("#signin-form").fadeIn(350);

  e.preventDefault();
});

$( "#close" ).click(function() {
  $("#signin-form").fadeOut(350);
    e.preventDefault();
});

$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});


function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function isalphabetic(name) {
	var re = /^[a-zA-Z]+$/;
	return re.test(name);
}

function resetInputWarning() {
	$("#first_name_result").attr('class', 'invalid_input');
	$("#last_name_result").attr('class', 'invalid_input');
	$("#signup_email_result").attr('class', 'invalid_input');
	$("#password_result").attr('class', 'invalid_input');
	$("#repeat_password_result").attr('class', 'invalid_input');
}

$('.register-form').on('submit', function(e) {

	resetInputWarning();

	var first_name = $("#first_name").val();
	if (!isalphabetic(first_name)) {
		$("#first_name_result").attr('class', 'invalid_input.is-visible');
		return;
	}

	var last_name = $("#last_name").val();
	if (!isalphabetic(last_name)) {
		$("#last_name_result").attr('class', 'invalid_input.is-visible');
		return;
	}

  	var email = $("#signup_email").val();
  	if (!validateEmail(email)) {
  		$("#signup_email_result").attr('class', 'invalid_input.is-visible');
  		return;
  	}

  	var password = $("#signup_password").val()+"";
  	if (password.length < 8) {
  		$("#password_result").attr('class', 'invalid_input.is-visible');
  		return;
  	}

  	var repeat_passowrd = $("#repeat_signup_password").val()+"";
  	if (repeat_passowrd != password) {
  		$("#repeat_password_result").attr('class', 'invalid_input.is-visible');
  		return;
  	}

    this.submit(); //now submit the form
});

/* Account dropdown menu*/
function profileDropdown() {
  console.log("hello");
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('#profile-icon') && !event.target.matches('#profile-icon img')) {
    var dropdowns = document.getElementsByClassName("profile-dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
