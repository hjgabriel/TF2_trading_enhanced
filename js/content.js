function content(){
	var URL = document.location.href; //get current URL

	if(URL.includes("backpack.tf/classifieds")){
		see_inventory();
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
		var key_text = '<span class="market_search_sidebar_section_tip_small">Key:</span>';
		var key_field = '<span class="market_search_sidebar_search_box market_search_input_container">\
								<span>\
									<input class="" type="text" autocomplete="off" tabindex="1">\
								</span>\
							</span>';
		var ref_text = '<span class="market_search_sidebar_section_tip_small">Ref:</span>';
		var ref_field = '<span class="market_search_sidebar_search_box market_search_input_container">\
								<span>\
									<input class="" type="text" autocomplete="off" tabindex="1">\
								</span>\
							</span>';
		var button = '<div class="btn_green_white_innerfade btn_medium" style="margin-top: 20px" id='+ itemUsed +' ><span>Find Items in use on other trades</span></a>';
		//$("div.filter_ctn").append(key_text+key_field+ref_text+ref_field+button);
		//scm_tradeoffer();
	}else if(URL.includes("steamcommunity.com/id/") || URL.includes("steamcommunity.com/profiles/")){
		addRepTF();
	}
}


$(document).ready(content());
