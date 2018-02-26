var columns_out = ".trade.widget.widget-trade.trade-has-tools";
var page_out = "ul.pagination.widget.widget-pagination li";
var button_out = "#" + out;
var item_search_div = "div.summary-padded li.search-query-arrow";
var op_search_widget = "div.search-query.widget.widget-summary";

var summary_tag = "div.modal-item.widget.widget-summary";
var attribute_tag = "div.modal-item-attributes.widget.widget-summary";
var history_tag = "div.modal-item-history.widget.widget-summary";

var seller_div = "div.trade-has.col-md-6";
var get_bp_price = "get_bp_price";
var btn_getprice = "."+get_bp_price;

//outpost
function Outpost_start(){
	$(document).on('click', button_out, function(){
		//empty items on the page
		$(columns_out).remove();
		
		//find last page number
		var page_num = getoutpostPageNum();

		//create loading button
		$(button_out).text("Loading " + page_num + " page(s)....");
		$(button_out).addClass("disabled");

		//Find items
		var item_ID = [];
		$(item_search_div).prevAll().each(function(){
			item_ID.push($(this).attr("data-hash").split(',')[1]);
		});
		//console.log(item_ID);

		//Find link
		var link = getoutpostURL();

		var deferreds = [],results = [];

		for(var i = 1; i<=page_num;i++){
			//Go to all the other pages and check for halloween spells
			//console.log(document.location.href +page_text+ i);

			deferreds.push(GrabDOM(1, link+","+ i,[results, i]));
		}

		$.when.apply($, deferreds).done(function() {
			for(var i = results.length-1; i>=0;i--){
				var result = results[i];
				//console.log(result);
				Outpost_Loop(result,item_ID);
			}
            Outpost_complete();
        });

		//remove page links
		$(page_out).empty();
	});
}

function Outpost_Loop(DOM,item_ID){
	var box_list = $(DOM).find(columns_out);
	var item_list = $(box_list).find(seller_div);
	//console.log(item_list);
	//console.log(item_list.length);
	item_list.each(function(index){
		var hasHalloween = false;
		//console.log(this);
		$(this).find("ul").children('li').each(function(){
			//console.log(this);
			var current_item_ID = $(this).attr("data-hash").split(",")[1];

			if($.inArray(current_item_ID,item_ID) > -1){
				var op_attribute = $(this).attr("data-attributes");
				//console.log(this);
				if(op_attribute != null && op_attribute.includes('Halloween Spell:')){
					hasHalloween = true; //once we find an item with halloween spell, no need to search that post
					return false; //break out of the loop
				}
			}
		});

		if(hasHalloween){
			//console.log(this);
			$(box_list[index]).insertAfter(op_search_widget);
		}
	});
}

//Helper
function getoutpostURL(){
	var link = document.location.href;
	var ulist = link.split(",");
	if(ulist.length > 0){
		link = ulist[0];
		//console.log(link);
	}
	return link;
}

function getoutpostPageNum(){
	var page_num = $(page_out).length - 2; // - 2 for previous page and next page
	var page_limit=20;
	//console.log(page_num);

	if(page_num <= 0){
		page_num = 1;
	}else if(page_num >= page_limit){
		page_num = page_limit;
		outpostMsg("<br><font color='red'>\
			Note: we do not want to overflow outpost servers,so I am limiting loading upto "
			+ page_limit + " pages.</font>");
	}
	return page_num;
}

//Post any error or notable message 
function outpostMsg(msg){
	$("div.summary-padded").append(msg);
}

function Outpost_complete(){
	$(button_out).text("Finished!!!");
}

//get bp prices for outpost
function getBPprice(node){
	var value = 0;
	value = $(node).find("div.tag.bottom-right>span").html();
	//console.log($(node).find("span.tag.bottom-right"));
	//console.log("value: "+value);
	if (value == null || value === '') {
		value = '???';
	}
	return value;
}

//handler for get_bp_price
function btn_bp_price(){
	$(document).on('click', btn_getprice, function(){
		var c_btn = this;
		$(c_btn).text("Loading....");
		var item_list = $(this).closest("div.row.row-no-gutter").find(seller_div);
		var deferreds = [],results = [],node = [];
		//console.log(item_list);

		item_list.each(function(){
			//console.log(this);
			$(this).find("ul").children('li').each(function(index){
				//console.log(this);
				var id = $(this).attr("data-id");
				var bp_history = "https://backpack.tf/item/" + id;
				//console.log(bp_history);
				deferreds.push(GrabDOM(0, bp_history,[results, 1+index]));
				node.push(this);
			});
		});

		$.when.apply($, deferreds).done(function() {
			for(var i = 0; i < results.length;i++){
				var result = results[i];
				var value = getBPprice(result);
				//console.log(value);
				$(node[i]).find("a.item-summary").append('<div style="color: red;" class="craft_no">'+value+'</div>');
				$(c_btn).text("Try Again?");
			}
		});
	});
}


//Add Item history button on outpost
function Outpost_addButton(){
	//using history instead of attribute as it will also try to run for buying sections
	$(document).on("DOMNodeInserted",history_tag, function(){
		var original_id = $(document).find(attribute_tag + " div.col-md-9.summary-white")[1].innerHTML;
		//console.log(original_id);
		var history_btn = '<a class="btn btn-success" '
		+'href="https://backpack.tf/item/' + original_id +'">BP HISTORY</a>';
		$(summary_tag).find("div.summary-padded.summary-light ul.item-links").append(history_btn);

		//Add bp price here
		//$(summary_tag).find("div.item-info div.item-subtitle").append(" ");

	});

	//add get bp prices btn
	var post = $(columns_out);
	if(post.length > 0){
		//console.log(post);
		var item_list = post.find("ul.trade-tools");

		item_list.each(function(){
			var btn = '<li><a href="javascript:;" class='+get_bp_price+'>Get BP Prices beta</div></a></li>';
			$(this).prepend(btn);
		});
		btn_bp_price(); //handler for button
	}

}
