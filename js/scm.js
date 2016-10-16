var button_itemUsed = "#" + itemUsed;
var item_box = ".inventory_item_link";
var item_history = "tradeoffers/sent/";
var item_history_list = "div.tradeoffer_items_ctn:not(.inactive) div.tradeoffer_items.primary div.trade_item";

var rep_site = "https://rep.tf/";

//add button on steam profile
function addRepTF(){
	var steamURL = window.location.href.split('/');
	var steamID = steamURL[steamURL.length - 1] == '' ? steamURL[steamURL.length - 2] : steamURL.pop();
	//console.log(steamID);

	$("div.header_real_name.ellipsis").append('<a class="btn_green_white_innerfade btn_medium" target="_blank" href="'+
		rep_site+steamID+'"><span>Rep.TF</span></a>');
}

//steam trades
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

