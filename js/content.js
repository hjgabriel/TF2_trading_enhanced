function content(){
	var URL = document.location.href; //get current URL

	if(URL.includes("backpack.tf/classifieds")){
		add_inv_param();
		var button = '<a class="btn btn-success" id='+ bp +' style="">Find Halloween Spells</a>';
		$("div#search-crumbs").append(button);
		BackPack_start();
	}else if(URL.includes("tf2outpost.com/")){
		Outpost_addButton();
		if(URL.includes("tf2outpost.com/search/")){
			var button = '<a class="btn btn-success" id='+ out +' style="margin-top: 10px">Find Halloween Spells</a>';
			$("div.summary-padded").append(button);
			Outpost_start();
		}
	}else if(URL.includes("steamcommunity.com/tradeoffer/new/")){
		steam_trade_start();
	}else if(URL.includes("steamcommunity.com/id/") || URL.includes("steamcommunity.com/profiles/")){
		addRepTF();
	}
}


$(document).ready(content());
