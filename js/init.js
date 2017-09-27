var bp = "backpack_spells";
var out = "outpost_spells";
var scm = "scm_spells";
var itemUsed = "itemUsed";
var defaultSteamURL = "https://steamcommunity.com/profiles/";

function GrabDOM(content_id,URL,arg){
	return $.ajax({
	  url: URL,
	  dataType: 'text',
	  success: function(data) {
	  	//console.log(data);
	    (arg[0])[arg[1]-1] = data;
	  },error: function(){
	  	if(content_id == 0){
	    	bpMsg("<br><font color='red'>\
				Note: Page "+ arg[1] + " failed to load. " +
				"It may be because of backpack server or a bug. " +
				"Please refresh and try again.</font>");
	 	}else if(content_id == 1){
	 	  	outpostMsg("<br><font color='red'>\
				Note: Page "+ arg[1] + " failed to load. " +
				"It may be because of outpost server or a bug. " +
				"Please refresh and try again.</font>");
	 	}else if(content_id == 2){
	 		//callback(JSON.parse(data),arg);
	 	}
	  }
	});
}

//get query of a specific parameter
function setURLParameter(url,key,value) {
	var l_url = url.split('&'), query = {}, new_url="";
	//console.log(url_list);
	for (var i=0; i < l_url.length; i++){
		if(l_url[i].indexOf('=') !== -1){
			var param = l_url[i].split('=');
			query[param[0]] = param[1];
			//console.log(param);
		}else if(i !== l_url.length-1){
			new_url +=str+"&";
		}
	}
	query[key] = value; //sets new query
	new_url += $.param(query);
	new_url = decodeURIComponent(new_url);
	//console.log(new_url);
	return new_url;
}