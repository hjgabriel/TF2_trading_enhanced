var button_itemUsed = "#" + itemUsed;
var item_box = ".inventory_item_link";
var item_history = "tradeoffers/sent/";
var item_history_list = "div.tradeoffer_items_ctn:not(.inactive) div.tradeoffer_items.primary div.trade_item";
var border = '<div class="trade_rule selectableNone trade_responsive_hidden"></div>';

//Steam trade offer stuff goes here
function steam_trade_start(){
	// JS Code needed to inject to the page
	//Need to inject JS code in order to get access to valve's functions like
	// MoveItemToTrade or rgItem for items
	var actualCode = code_to_string(function(){

		//init variables
		var key_field = "key_field";
		var ref_field = "ref_field";
		//list of key ids
		var key_ids = ["101785959","339892","664583249","11046885","22989168","107348033", "62839543","22989166",
		"11082610","780613452","780611622", "92538037","780613803","780612779","780612279","80564440","107348667",
		"1096191159"]; 
		var ref_id = "2674";
		var rec_id = "5564";
		var scrap_id = "2675";
		var key_list=[], ref_list=[], rec_list=[], scrap_list=[]; //key, ref arrays
		var userID = 0; //0 is you, 1 is them
		var user = ["My","Their"];

		var parent_id = "pExtID";
		var parent_div = '<div id='+parent_id+'></div>';
		var border = '<div class="trade_rule selectableNone trade_responsive_hidden"></div>';
		var TF2extenUI = "TF2extensionUI";
		var msgDiv = "TF2extensionMSG";
		var TF2extenError = "TF2extenError";
		var statDiv = "TF2extensionStatus";
		var KeyRefbtn = "KeyRefbtn";
		var btn_add = "#" + KeyRefbtn;

		//So that I don't need to add jQuery everytime
		function $(code){
			return jQuery(code);
		}

		//Remove any text if it exists.
		function clearText(){
			$("#"+TF2extenError).remove();
			$('#'+msgDiv).remove();
		}

		function createUI(){
			var default_key = getUrlParam("key");
			default_key = (typeof default_key === 'undefined') ? 0 : default_key;
			var default_ref = getUrlParam("ref");
			default_ref = (typeof default_ref === 'undefined') ? 0.00 : default_ref;

			var key_text = '<span class="market_search_sidebar_section_tip_small">Key:</span>';
			var fieldkey = '<span class="market_search_sidebar_search_box market_search_input_container">\
									<span>\
										<input id=' + key_field + ' class="filter_search_box" type="number" min="0" step="1"\
										 autocomplete="off" tabindex="1" value='+default_key+'>\
									</span>\
								</span>';
			var ref_text = '<span class="market_search_sidebar_section_tip_small">Ref:</span>';
			var fieldref = '<span class="market_search_sidebar_search_box market_search_input_container">\
									<span>\
										<input id=' + ref_field + ' class="filter_search_box" type="number" min="0" step="1"\
										 autocomplete="off" tabindex="1" value='+default_ref+'>\
									</span>\
								</span>';
			var key_ref_btn = '<div class="btn_green_white_innerfade" id='+ KeyRefbtn +' ><span>Add</span></a>';
			var total_ui = '<div id='+TF2extenUI+'>'+border+key_text+fieldkey+ref_text+fieldref+key_ref_btn+
							'</div>'
			$("#"+parent_id).prepend(total_ui);
		}

		function showAmount(user,key,ref,rec,scrap){
			//console.log("does it work?");
			clearText(); //clear anything before any sort of message is shown
			var msg_key = '<div id='+msgDiv+' style="color: white;">' + border + '<strong>' + user + 
			' Total | Keys: ' + key + ' | Ref: '+ ref + ' | Rec: '+ rec + ' | Scrap: '+ scrap +
			' |</strong></div>';
			$("#"+parent_id).prepend(msg_key);
		}

		function showError(message){
			clearText(); //clear anything before any sort of message is shown
			var errorbox = '<div id=' + TF2extenError + '>' + border +'<span id='+TF2extenError +' style="color: red;">'+ message +'</span>';
			$("#"+parent_id).prepend(errorbox);
		}

		function showMSG(code){
			$('#'+statDiv).remove(); //clear progress/status msg if it exist
			var msg = '<div id='+statDiv+'>' + border + '<strong>' + code +
			'</strong></div>';
			$("#"+parent_id).append(msg);
		}

		function showLoading(){
			var load = '<div style="color: white;"> Loading.....';
			showMSG(load);
		}

		function showStatus(compl,miss){
			$('#'+statDiv).remove(); //clear progress/status msg if it exist

			var complete = '', missing = '';

			//check if there was an added item
			if(!([0,0,0,0].every((v,i)=> v === compl[i]))){
				complete = '<div style="color: green;">Currently added - Keys: ' + compl[0] + 
			' | Ref: '+ compl[1] + ' | Rec: '+ compl[2] + ' | Scrap: '+ compl[3] + ' |</div>';
			}

			//check if there is an empty item
			if(!([0,0,0,0].every((v,i)=> v === miss[i]))){
				missing = '<div style="color: red; margin-top:2%">' + '*Missing items* -- Keys: ' + miss[0] + 
			' | Ref: '+ miss[1] + ' | Rec: '+ miss[2] + ' | Scrap: '+ miss[3] +' |</div>';
			}

			showMSG(complete+missing);
		}

		function keyErrorCheck(){
			var key_obj = $("#"+key_field);
			var num = key_obj.val();
			key_obj.val(Math.floor(num));
		}

		function refErrorCheck(){
			var ref_obj = $("#"+ref_field);
			var num = parseInt(ref_obj.val()*10) / 10;
			var decimal = (num - Math.floor(num)).toFixed(2)*10;
			//console.log("num: " + num);
			//console.log("decimal: " + decimal);
			if(decimal == 9){
				num = Math.ceil(num);
			}else{
				num = (num*100 + decimal)/100;
			}
			num = num.toFixed(2);
			ref_obj.val(num);
		}

		//find amount of keys and ref
		function findAmount(){
			key_list=[], ref_list=[], rec_list=[], scrap_list=[];
			var inventory = $("div.inventory_ctn:visible");
			//console.log(inventory);
			//Get all the necessary items
			var items = inventory.find("div.itemHolder").filter(function() {
			    return $(this).css("display") !== "none";
			}).find("div.item").filter(function() {
			    return $(this).css("display") !== "none";
			});
			//console.log(inventory.find(".itemHolder"));
			for (var i =0; i < items.length; i++){
				var item = items[i];
				var data = item.rgItem;
				if(jQuery.inArray(data.classid, key_ids) > -1){ //check if the classid matches
					//console.log(item);
					//console.log(data);
					//console.log(jQuery("#")[0].rgItem);
					key_list.push(item);
				}else if(data.classid == ref_id){
					ref_list.push(item);
				}else if(data.classid == rec_id){
					rec_list.push(item);
				}else if(data.classid == scrap_id){
					scrap_list.push(item);
				}
			}
			showAmount(user[userID],key_list.length,ref_list.length,rec_list.length,scrap_list.length);			
		}

		//add item to list
		function addItem(){
			showLoading(); // show loading indicator

			var vkey = $("#"+key_field).val();
			var vref = $("#"+ref_field).val();
			var decimal = (vref - Math.floor(vref)).toFixed(2)*100;
			var vrec = Math.floor(decimal/33);
			var vscrap = Math.floor((decimal - vrec*33)/11); //using floor just in case
			vref = Math.floor(vref); //ignore reclaimed and scrap

			var miss = [0,0,0,0]; //check for missing key or ref
			var mkey = vkey - key_list.length;
			var mref = vref - ref_list.length;
			var mrec = vrec - rec_list.length;
			var mscrap = vscrap - scrap_list.length;
			var diff = [mkey,mref,mrec,mscrap];

			for(var i=0; i < diff.length; i++){
				if(diff[i] > 0){
					miss[i] = diff[i];
				}
			}

			vkey = Math.min(vkey,key_list.length);
			vref = Math.min(vref,ref_list.length);
			vrec = Math.min(vrec,rec_list.length);
			vscrap = Math.min(vscrap,scrap_list.length);
			//console.log("vkey: "+vkey);
			//console.log("vref: "+vref);
			//console.log("vrec: "+vrec);
			//console.log("vscrap: "+vscrap);

			for(var i=0; i<vkey;i++){
				setTimeout(MoveItemToTrade,i*50,key_list.shift());
			}

			for(var i=0; i<vref;i++){
				setTimeout(MoveItemToTrade,(i+vkey)*50,ref_list.shift());
			}

			for(var i=0; i<vrec;i++){
				setTimeout(MoveItemToTrade,(i+vkey+vref)*50,rec_list.shift());
			}

			for(var i=0; i<vscrap;i++){
				setTimeout(MoveItemToTrade,(i+vkey+vref+vrec)*50,scrap_list.shift());
			}

			//Update result
			setTimeout(showStatus,(vkey+vref+vrec+vscrap)*50,[vkey,vref,vrec,vscrap],miss);
			setTimeout(findAmount,(vkey+vref+vrec+vscrap)*50);
		}

		//add events
		function TF2Events(){
			//If the inventory of the user is clicked, we start searching for the ammount
			var invMyTab = "inventory_select_your_inventory",invTheirTab = "inventory_select_their_inventory";

			$("a#"+invMyTab + ",a#" + invTheirTab).click(function(e){
				//console.log("TF2 tab clicked");
				//console.log(e.currentTarget);
				//console.log($(e.currentTarget).attr("id") == invMyTab); //check which event fired
				if($(e.currentTarget).attr("id") == invMyTab){
					userID = 0;
				}else if($(e.currentTarget).attr("id") == invTheirTab){
					userID = 1;
				}
				//console.log("inventory");
				doesTF2InvExist(errorCheck);
			});

			var my_sel = "div#appselect_option_you_440_2", their_sel = "div#appselect_option_them_440_2",
			filter = "input#filter_control", clear = "div#filter_clear_btn", tag = "input.econ_tag_filter_checkbox";

			//Cases where clear button for input is pressed or TF2 Inventory is selected for either users
			$(my_sel+","+ their_sel +","+ clear).click(function(){
				//console.log("clear");
				doesTF2InvExist(errorCheck);
			});

			//Also have inventory search if the filter has beeen changed
			$(filter).on('input',function(){
				//console.log("filter");
				doesTF2InvExist(errorCheck);
			});

			//check for checkbox changes
			$("div#filter_options").on('change',tag,function(){
				//console.log("checkbox");
				doesTF2InvExist(errorCheck);
			});

			//selected an item in any box
			$("div.trade_item_box").click(function(){
				//console.log("clicked item");
				setTimeout(findAmount,500); //wait for item to move before we check the items
			});

			$(document).on('click', btn_add, function(){
				keyErrorCheck();
				refErrorCheck();
				addItem();
			});
		}

		//check for any problems before we add the functionality
		function errorCheck(check){
			if(check){
				$("#"+TF2extenUI).show();
				findAmount();
			}else{
				console.log("failed to load");
				//Tell user that TF2 has been unable to reload. Either reload or load TF2 the inventory to try again
				var message = "TF2 Inventory was not found. Please select TF2 as the inventory above OR\
				 reload the page to try again";
				showError(message);
			}
		}
		
		//setup here
		function init(){
			$("div.filter_ctn").append(parent_div); 
			createUI();
			$("#"+TF2extenUI).hide(); //hide it and then show it later if we see TF2 inventory
			doesTF2InvExist(errorCheck);
			TF2Events();
		}

		init(); //start!

		//Helper function below

		//Check if TF2 Inventory Exist. Will check every second 10 times.
		function doesTF2InvExist(callback){
			isDivLoaded(function(){
				try{
					var id_check = $("div.inventory_ctn:visible").attr('id').indexOf("_440_2");
					return id_check> -1;
				}catch(e){
					//console.log($("div.inventory_ctn:visible").attr('id'));
					//console.log(check);
				}
			
			},1000,10,callback);
		}

		// Checks if a dynamically added div is in the page.
		// We check 5 times every 1 second. 
		//if We see it during those intervals, we return callback with true, if not we return callback with false.
		//inputs: "check" function which is finding if it exists. "delay" is the number of milliseconds. "repetitions" is the ammount we check
		//output: callback(true or false)
		function isDivLoaded(check, delay, repetitions,callback) {
		    var x = 0;
		    var intervalID = setInterval(function () {       
		       if (check()){
		           clearInterval(intervalID);
		           callback(true);
		       }
		       if (++x === repetitions) {
		           clearInterval(intervalID);
		           callback(false);
		       }
		    }, delay);
		}

		function getUrlParam(paramName) {
		    var params = window.location.search.split(/\?|\&/);
		    for(i = 0; i < params.length; i++) {
		        var currentParam = params[i].split("=");
		        if(currentParam[0] === paramName) {
		            return currentParam[1];
		        }
		    }
		}
	});

	injectJS(actualCode); // Inject Code

	/*
	Used to communicate with background.js Not needed right now
	chrome.runtime.sendMessage({type: "moveItem",time: i*50}, function(response) {
			console.log(response.reply);
	});
	*/

}

//steam trades
/*
Currently Broken. Not sure if I want to fix it. I'll do it at some point
function scm_tradeoffer(){

	$(document).on('click', button_itemUsed, function(){
		//Hide Button
		$(button_itemUsed).html("<span>Loading...</span>");
		//$(button_itemUsed).addClass("disabled");
		var steamIDURL = $(document).find(item_box)[0].href.split("inventory")[0];
		//console.log(steamIDURL);

		GrabDOM(1,steamIDURL+item_history,steamIDURL,ItemSentHistory);
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
*/


