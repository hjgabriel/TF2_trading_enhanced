var button_scm = "#" + scm;
var columns_scm = "div#searchResultsRows";
var page_scm = "span#searchResults_total";

//steamcommunity
function scm_start(){
	$(document).on('click', button_scm, function(){
		
		//find last page number
		var page_num = parseInt($(page_scm).text());

		var link = document.location.href + "?filter=halloween";
		//console.log(link);
		chrome.runtime.sendMessage({redirect: link});
	});
}