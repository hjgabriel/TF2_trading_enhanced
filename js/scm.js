var button_scm = "#" + scm;
var columns_scm = "div#searchResultsRows";
var page_scm = "span#searchResults_total";

//steamcommunity
function scm_start(){
	$(document).on('click', button_scm, function(){
		
		//find last page number
		var page_num = parseInt($(page_scm).text());

		//Can't disable buttons atm
		$(button_scm).css("visibility","hidden"); //text("Loading " + Math.floor(page_num/10) + " page(s)....");
		$("#market_buyorder_info").append('<span class="market_commodity_orders_header_promote"> Please Note this is still under development, the items could be 1-2 pages off.</span>');
		//$(button_scm).addClass("disabled");

		//empty items on the page
		//$(columns_scm).empty();

		//empty pages
		//$("div#searchResults_ctn").empty();

		//Amount of items steam can load
		var max_load = 100;
		for(var i = 0; i < page_num; i+=max_load){
			//Go to all the other pages and check for halloween spells
			var link = "/render/?query=&start="+ i +"&count="+ max_load +"&country=USA&language=english&currency=1"
			
			if(i+max_load >= page_num){
				GrabDOM(2,document.location.href + link,i, scm_loop);
			}else{
				GrabDOM(2,document.location.href + link,i, scm_loop);
			}
		}
	});
}

function scm_loop(DOM,start){
	var item_list = DOM.assets[440][2];
	//console.log(item_list.children('li'));
	//console.log(item_list);
	var item_length = Object.keys(item_list).length;
	var item_index = 0;
	//console.log(item_length);


	$.each(item_list,function(key,value){
		item_index++;
		//console.log(key);
		//console.log(value.descriptions);
		$.each(value.descriptions,function(key,value){
			//console.log(key);
			var text = value.value;
			//console.log(text);
			if(text.includes("Halloween:")){
				//console.log(("Found " + text + " in Page: " +Math.floor((item_index + start)/10+1)));
				 $("#market_buyorder_info").append(("<p>Found " + text + " in Page: " +Math.floor((item_index + start)/10+1)) + ". </p>");
			}
		});
	});
	//console.log("Total Items seen: " + (item_index + start));

	// if(start === "last"){
	// 	scm_complete();
	// }
	
}

function scm_complete(){
	$(button_scm).text("Finished!!!");
}