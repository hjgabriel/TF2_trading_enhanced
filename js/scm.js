var button_scm = "#" + scm;
var columns_scm = "div#searchResultsRows";
var page_scm = "span#searchResults_total";

var button_itemUsed = "#" + itemUsed;
var item_box = ".inventory_item_link";
var item_history = "tradeoffers/sent/";
var item_history_list = "div.tradeoffer_items_ctn:not(.inactive) div.tradeoffer_items.primary div.trade_item";

//steammarketcommunity
function scm_addbtn(){
	$(document).on('click', button_scm, function(){
		
		//find last page number
		var page_num = parseInt($(page_scm).text());

		var link = document.location.href + "?filter=halloween";
		//console.log(link);
		chrome.runtime.sendMessage({redirect: link});
	});
}
//--------------------------------------------------------------------
//steam trade
function scm_tradeoffer(){

	$(document).on('click', button_itemUsed, function(){
		//Hide Button
		$(button_itemUsed).html("<span>Loading...</span>");
		//$(button_itemUsed).addClass("disabled");
		var steamIDURL = $(document).find(item_box)[0].href.split("inventory")[0];
		//console.log(steamIDURL);

		GrabDOM(0,steamIDURL+item_history,steamIDURL,ItemSentHistory);
	});
}

//Find item sent history
function ItemSentHistory(DOM, steamIDURL){
	//console.log(DOM);
	var item_list = [];
	$(DOM).find(item_history_list).each(function(){
		//console.log(this);
		var item_info = $(this).attr("data-economy-item").split('/');
		item_list.push(item_info[item_info.length-2]);
	});

	findUsedItem(item_list,steamIDURL);
}

function findUsedItem(item_list,steamIDURL){
	//loop through only my items	
	$(document).find("a[href^='"+steamIDURL+"']").each(function(){
		//console.log(this.href);
		var link = this.href.split("_");
		var number = link[link.length-1];
		var parent_dom = this;
		$(item_list).each(function(){
			if(this == number){
				var item_div = $(parent_dom).parent();
				//console.log(item_div);
				$(item_div).css("background-color","black");
			}
		});
	});
	finished_ItemSearch();
}

function finished_ItemSearch(){
	$(button_itemUsed).hide();
}
