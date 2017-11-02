var page_bp = "ul.pagination li a[href]";
var columns_bp = "ul.media-list";
var button_bp = "#" + bp;
var placement_bp ="div.pull-right.listing-buttons";
var bp_profile_finder = "a.user-link";

//backpack
function BackPack_start(){
	$(document).on('click', button_bp, function(){
		//empty items on the page
		$(columns_bp).empty();
		
		//find last page number
		var url = getBpURL();
		var l_page_num = getBpPageNum(url);

		$(button_bp).text("Loading " + l_page_num + " page(s)....");
		$(button_bp).addClass("disabled");

		var deferreds = [],results = [];

		for(var i = 1; i<= l_page_num;i++){
			//Go to all the other pages and check for halloween spells
			//console.log(document.location.href);
			var new_url = setURLParameter(document.location.href,'page',i);
			deferreds.push(GrabDOM(0,new_url,[results, i]));
		}

		$.when.apply($, deferreds).done(function() {
			//console.log(results);
			for(var i = 0; i< results.length;i++){
				var result = results[i];
				//console.log(result);
				Backpack_Loop(result);
			}
            Backpack_complete();
        });

		//remove page links
		$("nav").empty();
	});
}

//goes over the list and checks for spells. If the item has spells we list them.
function Backpack_Loop(DOM){
	//console.log(DOM);
	var item_list = $(DOM).find(columns_bp).first();
	//console.log(item_list.children('li'));

	item_list.children('li').each(function(){
		if(this.innerHTML.includes("data-spell_1")){
			//console.log(this);
			//add items with spells
			var node = $(this).find("li");
			node.attr('data-toggle',"popover");

			$(columns_bp).first().append(this.outerHTML);

			//show custom popover
			show_popover(node[0]);
			
		}
	});
}

//Helper
function getBpURL(){
	var l_page_url = $(page_bp).last()[0].href;
	//console.log(l_page_url);
	return l_page_url;
}

function getBpPageNum(url){
	var page_text = "&page=";
	var l_page_num = url.split(page_text)[1];
	if(l_page_num == null){
		l_page_num = 1;
	}

	var page_limit=20;
	if(l_page_num >= page_limit){
		l_page_num = page_limit;
		bpMsg("<br><font color='red'>\
			Note: we do not want to overflow backpack.tf servers,so I am limiting loading upto "
			+ page_limit + " pages.</font>");
	}
	return l_page_num;
}

//Post any error or notable message 
function bpMsg(msg){
	$("div#search-crumbs").append(msg);
}

function Backpack_complete(){
	$(button_bp).text("Finished!!!");
}

//shows the popover when you hover over the item. Outpost and other buttons are not implmented yet
function show_popover(info){
	var p_title = info.title;
	var p_spell = info.getAttribute("data-spell_1");
	var p_spell2 = info.getAttribute("data-spell_2");
	var name = info.getAttribute("data-listing_name");
	var price = info.getAttribute("data-listing_price");
	var comment = info.getAttribute("data-listing_comment");
	var link = info.getAttribute("data-listing_offers_url");
	var backpack_id = info.getAttribute("data-original_id");
	var wiki_id = info.getAttribute("data-defindex");
	var backpack_value = info.getAttribute("data-p_bptf");

	var body = '<dl class="item-popover-listing"">'
			+'<dt>Classified Listing</dt><dd>This item is being sold by ' + name 
	        + "<dd>Selling for: "+ price +"</dd>" + "<dd><em>"+ comment +"</em></dd>"
	        + '<dd><a class="btn btn-xs btn-primary btn-listing" href=' + link
	        +' target="_blank"><i class="fa fa-exchange"></i> '+ name +'</a></dd></dd></dl>'
	        +'<dt>Spells</dt><dd>'+ p_spell+ "</dd>";


	if(p_spell2 != null){
		body +='<dd>'+ p_spell2 +'</dd>';
	}

	body+=  '<dt>Suggested Values</dt><dd> backpack.tf: '+ backpack_value + "</dd>"
	+ '<dd class="popover-btns">' + '<a class="btn btn-default btn-xs"'
	+'href="https://backpack.tf/item/' + backpack_id 
	+ '"><i class="fa fa-calendar-o"></i> History</a>'
	+ '<a class="btn btn-default btn-xs" href="http://wiki.teamfortress.com/scripts/itemredirect.php?id=' 
	+ wiki_id  + '" target="_blank"><i class="stm stm-tf2"></i> Wiki</a>'
	+ '</dd>';

	$(".media-object").popover({
	        title: '<h3 class="popover-title">' + p_title + '</h3>',
	        content: body,
	        trigger: "hover click focus",
	        placement: 'top',
	        html: true
    	});
}

//Add see_inventory button
function see_inventory(){
	var item_list = $(columns_bp).first();
	//console.log(item_list);
	item_list.children('li').each(function(){
		//console.log(this.id);
		var item_id = "440_2_"+this.id.split("_")[1];
		//console.log(item_id);
		//find the inventory url
		//In order to do that, we use item id and the user profile link to find the item
		var bp_profile = $(this).find(bp_profile_finder)[0].href;
		//console.log(bp_profile);
		var steam_user_link = defaultSteamURL + bp_profile.replace(/[^0-9]+/, '');
		//console.log(steam_user_link);
		var steam_link_id = steam_user_link + "/inventory/#" + item_id;

		//Add button under the correct placement
		var b_placement = $(this).find(placement_bp);
		//console.log(b_placement);
		var b_inspect = '<a href="'+steam_link_id+'" \
						class="btn btn-xs btn-bottom btn-primary" target="_blank"\
		 				data-original-title="Check in-game"><span>See Inventory</span></a>';
		b_placement.prepend(b_inspect);
	});
}

/*
Adds button under the popover. Current implementation only works on seller's classified.
Scraping this idea because on bp user inventory page, we'll have a situation 
where we would add a listener for every item which would slow down the site.
Keeping this code for future references.

function bpinspect_item(){
	// select the target node
	var target = $($(columns_bp)[0]).find("ul.item-singular.override-440");
	//console.log(target);
	 
	for (var i = 0; i < target.length; i++) {

	    // create an observer instance
	    var observer = new MutationObserver(function(mutations) {
	        mutations.forEach(function(mutation) {
	        	if (mutation.addedNodes && mutation.addedNodes.length > 0) {
	        		//console.log(mutation.target);
	        		var popover = $(mutation.target).find("div.popover-content");
	        		var b_inspect = '<dd class="popover-btns"><a href="'+'" \
						class="btn btn-xs btn-bottom btn-primary" target="_blank"\
		 				>See Inventory</a></dd>';
	        		popover.append(b_inspect);
	        		console.log("Added Button");
	        	}
	        });
	    });

	    // configuration of the observer
	    var config = {
		    childList: true
		};

	    // pass in the target node, as well as the observer options
	    observer.observe(target[i], config);
	}

}
*/