var page_bp = "ul.pagination li a";
var columns_bp = "ul.media-list";
var button_bp = "#" + bp;

//backpack
function BackPack_start(){
	$(document).on('click', button_bp, function(){
		//empty items on the page
		$(columns_bp).empty();
		
		//find last page number
		var page_link = $(page_bp).last()[0].href;
		var page_text = "&page=";
		var page_num = page_link.slice(page_link.indexOf(page_text)+page_text.length);

		if(page_num == ""){
			page_num = 1;
		}

		var page_limit=20;
		if(page_num >= page_limit){
			page_num = page_limit;
			$("div#search-crumbs").append("<br><font color='red'>\
				Note: Due to the server problems on backpack.tf, I am limiting to load up to "
				+ page_limit + " pages.</font>");
		}

		$(button_bp).text("Loading " + page_num + " page(s)....");
		$(button_bp).addClass("disabled");

		var deferreds = [];

		for(var i = 1; i<= page_num;i++){
			//Go to all the other pages and check for halloween spells
			//console.log(document.location.href +page_text+ i);

			deferreds.push(GrabDOM(0,document.location.href +page_text+ i,null, Backpack_Loop));
		}

		$.when.apply($, deferreds).done(function() {
            Backpack_complete();
        });

		//remove page links
		$("nav").empty();
	});
}

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

function Backpack_complete(){
	$(button_bp).text("Finished!!!");
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