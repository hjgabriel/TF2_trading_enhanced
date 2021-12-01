var rep_site = "https://rep.tf/";

//add button on steam profile
function addRepTF(){
	// https://steamcommunity.com + /id/[Vanity URL]/
	// or https://steamcommunity.com + /profiles/[Community ID]/
	var steamURL = window.location.origin + window.location.pathname;
	steamURL = steamURL.split('/');
	var steamID = steamURL[steamURL.length - 1] == '' ? steamURL[steamURL.length - 2] : steamURL.pop();
	//console.log(steamID);

	$("div.header_real_name.ellipsis").append('<br><a class="btn_green_white_innerfade btn_medium" target="_blank" href="'+
		rep_site+steamID+'"><span>Rep.TF</span></a>');
}

