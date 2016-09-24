var columns_out = ".trade.widget.widget-trade.trade-has-tools";
var page_out = "ul.pagination.widget.widget-pagination li";
var button_out = "#" + out;


//backpack
function Outpost_start(){
	$(document).on('click', button_out, function(){
		//empty items on the page
		$(columns_out).empty();
		
		//find last page number
		var page_num = $(page_out).length - 2; // - 2 for previous page and next page
		//console.log(page_num);

		if(page_num <= 0){
			page_num = 1;
		}

		$(button_out).text("Loading " + page_num + " page(s)....");
		$(button_out).addClass("disabled");

		for(var i = 1; i<= page_num;i++){
			//Go to all the other pages and check for halloween spells
			//console.log(document.location.href +page_text+ i);
			var c_page = "none";
			if(i == page_num){
				c_page = "last"
			}

			GrabDOM(1,document.location.href +","+ i,c_page, Outpost_Loop);
		}

		//remove page links
		$(page_out).empty();
	});
}

function Outpost_Loop(DOM,c_page){
	var box_list = $(DOM).find(columns_out);
	var item_list = $(box_list).find("div.trade-has.col-md-6");
	//console.log(item_list);
	//console.log(item_list.length);
	var isHalloween = false;
	item_list.each(function(index){
		//console.log(this);
		if(this.innerHTML.includes('Halloween Spell:')){
			$(columns_out).first().append(box_list[index]);
		}
	});

	if(c_page === "last"){
		Outpost_complete();
	}
}

function Outpost_complete(){
	$(button_out).text("Finished!!!");
}