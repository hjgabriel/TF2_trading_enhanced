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
	}else if(URL.includes("steamcommunity.com/market/listings/")){
		if(!URL.includes("?filter=halloween")){
			var button = '<a class="btn_green_white_innerfade btn_medium" id='+ scm +' ><span>Find Halloween Spells</span></a>';
			$('#market_buyorder_info div div[style="float: right; padding-right: 10px"]').append(button);
			scm_start();
		}
	}else{
		console.log("Something went wrong");
	}
}


$(document).ready(content());
