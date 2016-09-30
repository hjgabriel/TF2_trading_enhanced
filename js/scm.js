var button_scm = "#" + scm;
var columns_scm = "div#searchResultsRows";
var page_scm = "span#searchResults_total";

var item_history = "http://steamcommunity.com/id/***/tradeoffers/sent/";
var trade_offer_link = "steamcommunity.com/tradeoffer/new/";
var item_box = ".trade_item_box.selectableNone";

//steamcommunity
function scm_addbtn(){
	$(document).on('click', button_scm, function(){
		
		//find last page number
		var page_num = parseInt($(page_scm).text());

		var link = document.location.href + "?filter=halloween";
		//console.log(link);
		chrome.runtime.sendMessage({redirect: link});
	});
}

function scm_tradeoffers(){
	$(document).on("DOMSubtreeModified",".inventory_user_tabs", function(){
		console.log("tree changed");
	});
}