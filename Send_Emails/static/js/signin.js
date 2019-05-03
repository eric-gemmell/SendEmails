USERNAME="";
PASSWORD="";
STATUS = "USERNAME"; //the status is whether we are receiving username or password

$("#login").keyup(function(event) {
	if (event.keyCode === 13) {
		if(STATUS=="USERNAME"){
			console.log("Received on username enter");
			USERNAME = document.getElementById("login").value.toLowerCase();  
			console.log(USERNAME);
			STATUS="PASSWORD";
			document.getElementById("login").value = "";
			$('#login').attr('placeholder','PASSWORD');
		}
		else if(STATUS == "PASSWORD"){	
			console.log("Received on password enter");
			PASSWORD = document.getElementById("login").value.toLowerCase();  
			console.log(PASSWORD);
			STATUS="SENDING";
			SignIn();
		}
	}
});	

function SignIn(){
	console.log("Signing in");
	var xmlhttp = new XMLHttpRequest();
	var url = "/signin/"
	var request_json_string = '{ '
		+ '"username" : "'+USERNAME+'", '
		+ '"password" : "'+PASSWORD+'" }'
	console.log(request_json_string);       
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log("reveived response");
			var json_response = JSON.parse(this.responseText);
			console.log(this.responseText);
			console.log(json_response.status);
			if(json_response.status == "ok"){
				window.location.replace("/");	
			}
			else{
				//Refresh the page, set status, reset USERNAME and PASSWORD, set text input box to empty string
				ResetPage();
			}
		}
	}
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
	xmlhttp.send(request_json_string);  
}

function ResetPage(){
	USERNAME = "";
	PASSWORD = "";
	STATUS = "USERNAME";
	document.getElementById("login").value = "";
	$('#login').attr('placeholder','USERNAME');
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
