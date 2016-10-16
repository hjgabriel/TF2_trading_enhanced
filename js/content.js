function content(){
	var URL = document.location.href; //get current URL

	if(URL.includes("backpack.tf/classifieds")){
		var button = '<a class="btn btn-success" id='+ bp +' style="margin-top: 10px">Find Halloween Spells</a>';
		$("div.panel-body.padded.panel-body-alt").append(button);
		BackPack_start();
	}else if(URL.includes("tf2outpost.com/")){
		Outpost_addButton();
		
		if(URL.includes("tf2outpost.com/search/")){
			var button = '<a class="btn btn-success" id='+ out +' style="margin-top: 10px">Find Halloween Spells</a>';
			$("div.summary-padded").append(button);
			Outpost_start();
		}
	}else if(URL.includes("steamcommunity.com/tradeoffer/new/")){
		var button = '<div class="btn_green_white_innerfade btn_medium" style="margin-top: 20px" id='+ itemUsed +' ><span>Find Items in use on other trades</span></a>';
		$("div.filter_ctn").append(button);
		scm_tradeoffer();
	}else if(URL.includes("steamcommunity.com/id/") || URL.includes("steamcommunity.com/profiles/")){
		addRepTF();
	}
}


$(document).ready(content());
