var page_div = "ul.pagination li a";
var order_columns = "ul.media-list";
var button_id = "#backpack_spells";

//backpack
function BackPack_start(){
	$(document).on('click', button_id, function(){
		//empty items on the page
		$(order_columns).empty();
		
		//find last page number
		var page_link = $(page_div).last()[0].href;
		var page_text = "&page=";
		var page_num = page_link.slice(page_link.indexOf(page_text)+page_text.length);

		if(page_num == ""){
			page_num = 1;
		}

		$(button_id).text("Loading " + page_num + " page(s)....");
		$(button_id).addClass("disabled");

		for(var i = 1; i<= page_num;i++){
			//Go to all the other pages and check for halloween spells
			//console.log(document.location.href +page_text+ i);
			if(i == page_num){
				GrabDOM(document.location.href +page_text+ i,"last", Backpack_Loop);
			}else{
				GrabDOM(document.location.href +page_text+ i,"none", Backpack_Loop);
			}
		}

		//remove page links
		$("nav").empty();
	});
}

function Backpack_Loop(DOM,c_page){
	var item_list = $(DOM).find(order_columns).first();
	//console.log(item_list.children('li'));

	item_list.children('li').each(function(){
		if(this.innerHTML.includes("data-spell_1")){
			//console.log(this);
			//add items with spells
			var node = $(this).find("li");
			node.attr('data-toggle',"popover");

			$(order_columns).first().append(this.outerHTML);

			//show custom popover
			show_popover(node[0]);
			
		}
	});

	if(c_page === "last"){
		Backpack_complete();
	}
}

function Backpack_complete(){
	$(button_id).text("Finished!!!");
}

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
	        html: true
    	});
}


//steamcommunity
function SteamCommunity_start(){
	$(document).on('click', "#comm_spells", function(){
		console.log("spell_button");
		console.log(($("div.responsive_page_template_content script")[1]).innerHTML);
	});
}
