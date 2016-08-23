function init(){
	var URL = document.location.href; //get current URL

	if(URL.includes("https://backpack.tf/classifieds?")){
		var button = '<a class="btn btn-success" id="backpack_spells" style="margin-top: 10px">Find Halloween Spells</a>';
		$("div.classifieds-user-controls").append(button);
		BackPack_start();
	}else if(URL.includes("http://www.tf2outpost.com/")){

	}else if(URL.includes("http://steamcommunity.com/market/listings/")){
		//var button = '<a class="btn_green_white_innerfade btn_medium" id="comm_spells"><span>Find Halloween Spells</span></a>';
		//$('#market_buyorder_info div div[style="float: right; padding-right: 10px"]').append(button);
		//SteamCommunity_start();
	}else{
		console.log("Something went wrong")
	}
}


$(document).ready(init());

function toHTML(html) {
	var page = document.createElement('html');
	page.innerHTML = html;
	return page;
}

function GrabDOM(URL,c_page,callback){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", URL, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
     	  //handle the xhr response here
	 	  //console.log("ready");
	 	  //console.log(xhr);
	 	  //console.log(toHTML(xhr.responseText));
	 	  callback(toHTML(xhr.responseText),c_page);
	 	  
		}
	}
	
	xhr.send();
}
