//==================================================
// Last-fm
//==================================================


/**
 * @version           1.1
 * @datelastmodified  01:21 07/01/2016
 * @category          000_Last-fm
 * @author            matthias.morin@gmail.com
 * @purpose           Displays artists, albums and tracks from Last-fm API in a Masonry layout
 * @requires          jQuery, Bootstrap, Masonry
 * @uses              fnAppendArtistCard
 * @link              http://www.last.fm/fr/api
 */

// Sets $Grid as global variable
$Grid = $(".grid");
// Initializes script
init();




//==================================================
// FUNCTIONS
//==================================================


//--------------------------------------------------
// fnAppendArtistCard
//--------------------------------------------------


function fnAppendArtistCard(arArtists, $Target){

/**
 * @version           1.3b
 * @datelastmodified  22:50 06/01/2016
 * @category          Last-fm_DOM
 * @author            matthias.morin@gmail.com
 * @purpose           Appends artists cards to DOM
 * @input             arArtists As Array, $Target As jQuery object
 * @requires          jQuery, Masonry
 * @uses              fnAppendTitle, fnAppendArtistImage
 */

	// Gets elements count from array
	intLength = arArtists.length;
	for (i=0; i<intLength; i++){
		// Defines variables from Last-fm API
		strArtistName =     arArtists[i].name;
		strArtistImageSrc = arArtists[i].image[3]["#text"];
		strArtistId =       arArtists[i].mbid;
		// Creates artist card
		var $Card = $("<div>");
		$Card.addClass("card grid-item col-sm-6 col-lg-4 thumbnail");
		// Adds attribute for strArtistId easy access
		$Card.attr("data-artist-id", strArtistId);
		fnAppendTitle(strArtistName, $Card);
		// Creates ImageBox
		var $ImageBox = $("<div>");
		$ImageBox.addClass("image-box");
		// Adds attribute for strArtistId easy access
		$ImageBox.attr("data-artist-id", strArtistId);
		// Appends box to card
		$Card.append($ImageBox);
		fnAppendArtistImage(strArtistId, strArtistImageSrc, $ImageBox);
		// Creates card ListBox
		var $ListBox = $("<div>");
		$ListBox.addClass("list-box");
		// Adds attribute to target ListBox easily
		$ListBox.attr("data-artist-id", strArtistId);
		// Appends ListBox to card
		$Card.append($ListBox);
		// Appends $Card to $Grid
		$Target.append($Card);
		// Updates masonry
		$Target.masonry('appended', $Card);
	}
	// Reloads masony layout
	$Target.masonry("reloadItems");
	// Refreshes $Target layout
	$Target.masonry("layout");
}




//--------------------------------------------------
// fnAppendArtistImage
//--------------------------------------------------


function fnAppendArtistImage(strArtistId, strArtistImageSrc, $Target){

/**
 * @version           1.1
 * @datelastmodified  12:26 15/01/2016
 * @category          last-fm_DOM
 * @author            matthias.morin@gmail.com
 * @purpose           Append artist image to DOM
 * @input             strArtistId As String, strArtistImageSrc As String, $Target As jQuery object
 * @requires          jQuery
 * @uses              fnGetArtistAlbums
 */

	// Empties $Target
	$Target.empty();
	// Creates ArtistImage
	var $ArtistImage = $("<img>");
	$ArtistImage.attr("src", strArtistImageSrc);
	$ArtistImage.attr("width", 300);
	$ArtistImage.attr("height", 300);
	$ArtistImage.attr("data-artist-id", strArtistId);
	$ArtistImage.addClass("artist-image");
	// Listens to events on image
	$ArtistImage.on("mousedown", function(){
		// Gets strArtistId from image attribute (anonymous function doesn't accept arguments)
		var strArtistId = $(this).attr("data-artist-id");
		// Targets $Card
		var $Card = $(this).parent().parent();
		fnGetArtistAlbums(strArtistId, $Card.children(".list-box"));
	});
	// Appends ArtistImage to DOM
	$Target.append($ArtistImage);
}



//--------------------------------------------------
// fnAppendTitle
//--------------------------------------------------


function fnAppendTitle(strTitle, $Target){

/**
 * @version           1.1
 * @datelastmodified  12:16 15/01/2016
 * @category          last-fm_DOM
 * @author            matthias.morin@gmail.com
 * @purpose           Append title to DOM
 * @input             strTitle As String, $Target As jQuery object
 * @requires          jQuery
 */

	// Creates title
	var $Title = $("<h1>");
	$Title.html(strTitle);
	// Appends card title
	$Target.append($Title);
}



//--------------------------------------------------
// fnAppendAlbumSmallCovers
//--------------------------------------------------


function fnAppendAlbumSmallCovers(arAlbums, $Target){

/**
 * @version           1.1b
 * @datelastmodified  12:46 15/01/2016
 * @category          Last-fm_DOM
 * @author            matthias.morin@gmail.com
 * @purpose           Appends artist albums to DOM
 * @input             arAlbums As Array, $Target As jQuery object
 * @assumes           $Grid
 * @requires          jQuery, Masonry
 * @uses              fnGetAlbumTracks
 */

	// Empties $Target
	$Target.empty();
	// Initializes masonry for small-covers
	$Target.masonry({
	  itemSelector: ".small-cover",
	  gutter: 15,
	});
	intLength = arAlbums.length;
	for (i=0; i<intLength; i++){
		strAlbumName =      arAlbums[i].name;
		strAlbumId =        arAlbums[i].mbid;
		strSmallCoverSrc =  arAlbums[i].image[1]["#text"];  // 64x64
		// strMediumCoverSrc = arAlbums[i].image[2]["#text"];  // 174x174
		// strLargeCoverSrc =  arAlbums[i].image[3]["#text"];  // 300x300
		if (!!strSmallCoverSrc && !!strAlbumId){
			var $Cover = $("<img>");
			$Cover.attr("data-album-id", strAlbumId);
			$Cover.attr("data-album-name", strAlbumName);
			$Cover.attr("src", strSmallCoverSrc);
			$Cover.attr("width", 64);
			$Cover.attr("height", 64);
			$Cover.addClass("small-cover");
			$Target.append($Cover);
			// Listens to events on image
			$Cover.one("mousedown", function(){
				$ListBox = $(this).parent();
				// $ListBox.empty();
				// strTitle = $(this).attr("data-album-name");
				// Appends album title
				// fnAppendTitle(strTitle, $ListBox);
				// Gets strArtistId from parent attribute
				var strAlbumId = $(this).attr("data-album-id");
				fnGetAlbumTracks(strAlbumId, $ListBox);
			});
			// Updates masonry
			$Target.masonry("appended", $Cover);
		}
	}
	// Reloads $Target layout
	$Target.masonry("reloadItems");
	// Refreshes $Target layout
	$Target.masonry("layout");
	// Reloads grid layout
	$Grid.masonry("reloadItems");
	// Refreshes $Grid layout
	$Grid.masonry("layout");
}



//--------------------------------------------------
// fnAppendAlbumTracks
//--------------------------------------------------


function fnAppendAlbumTracks(arTracks, $Target){

/**
 * @version           1.3b
 * @datelastmodified  11:57 15/01/2016
 * @category          Last-fm_DOM
 * @author            matthias.morin@gmail.com
 * @purpose           Appends artist albums to DOM
 * @input             arTracks As Array, $Target As jQuery object
 * @assumes           $Grid
 * @requires          jQuery, Masonry
 */

	// Empties $Target
	$Target.empty();
	// Initializes masonry for tracks
	$Target.masonry({
	  itemSelector: ".tracks",
	});
	var $TrackList = $("<ol>");
	$TrackList.addClass("tracks");
	var strTrackList = "";
	intLength = arTracks.length;
	for (i=0; i<intLength; i++){
		strtrackId =         arTracks[i].mbid;
		strTrackName =       arTracks[i].name;
		strTrackUrl =        arTracks[i].url;
		strTrackStreamable = arTracks[i].streamable;
		intTrackNumber = i+1;
		if (strTrackUrl != ""){
			strTrackList += "<li>" + "<a href=\"" + strTrackUrl + "\" target=\"_blank\">" + strTrackName + "</a></li>";
		}
	}
	// Appends list HTML to DOM
	$TrackList.html(strTrackList);
	// $Target.masonry("appended", $TrackList);
	$Target.append($TrackList);
	// Reloads $Target layout
	$Target.masonry("reloadItems");
	// Refreshes $Target layout
	$Target.masonry("layout");
	// Reloads $Grid layout
	$Grid.masonry("reloadItems");
	// Refreshes $Grid layout
	$Grid.masonry("layout");
}



//--------------------------------------------------
// fnGetAlbumTracks
//--------------------------------------------------


function fnGetAlbumTracks(strAlbumId, $Target){

/**
 * @version           1.0b
 * @datelastmodified  02:33 06/01/2016
 * @category          Last-fm_Ajax
 * @author            matthias.morin@gmail.com
 * @purpose           Gets artist summary from Last-fm with Ajax
 * @input             strAlbumId As String, $Target As jQuery object
 * @requires          jQuery
 * @uses              fnAppendAlbumTracks
 * @note              Caches jSon object into sessionStorage
 */

	// Checks if data is availlable in sessionStorage to avoid unnecessary server requests
	var jsTracks = window.sessionStorage.getItem(strAlbumId + "_tracks");
	if (!!jsTracks){
		// Appends jsTracks to DOM
		fnAppendAlbumTracks(JSON.parse(jsTracks), $Target);
	}else{
		$.ajax({
			"url": "http://ws.audioscrobbler.com/2.0/",
			"data":{
				"method":  "album.getInfo",
				"mbid" :   strAlbumId,
				"api_key": "e748a7f1fb6cb7ae4a5ae7bf78fd6517",
				"format":  "json"
			}
		})
		.done(function(response){
			// Stringifys response to properly cache it into sessionStorage
			var jsTracks = JSON.stringify(response.album.tracks.track);
			// Caches resulting string into sessionStorage in order to avoid unnecessary server requests
			window.sessionStorage.setItem(strAlbumId + "_tracks", jsTracks);
			// Returns response value
			var arTracks = response.album.tracks.track;
			// Appends arTracks to DOM
			fnAppendAlbumTracks(arTracks, $Target);
		});
	}
}



//--------------------------------------------------
// fnGetArtistAlbums
//--------------------------------------------------


function fnGetArtistAlbums(strArtistId, $Target){

/**
 * @version           1.0b
 * @datelastmodified  02:33 06/01/2016
 * @category          Last-fm_Ajax
 * @author            matthias.morin@gmail.com
 * @purpose           Gets artist albums from Last-fm with Ajax
 * @input             strArtistId As String, $Target As jQuery object
 * @requires          jQuery
 * @uses              fnAppendAlbumSmallCovers
 * @note              Caches jSon object into sessionStorage
 */

	// Checks if data is availlable in sessionStorage to avoid unnecessary server requests
	var jsAlbums = window.sessionStorage.getItem(strArtistId + "_albums");
	if (!!jsAlbums){
		// Appends jsAlbums to DOM
		fnAppendAlbumSmallCovers(JSON.parse(jsAlbums), $Target);
	}else{
		$.ajax({
			"url": "http://ws.audioscrobbler.com/2.0/",
			"data":{
				"method":  "artist.getTopAlbums",
				"mbid" :   strArtistId,
				"api_key": "e748a7f1fb6cb7ae4a5ae7bf78fd6517",
				"format":  "json"
			}
		})
		.done(function(response){
				// Stringifys response to properly cache it into sessionStorage
				var jsAlbums = JSON.stringify(response.topalbums.album);
				// Caches resulting string into sessionStorage in order to avoid unnecessary server requests
				window.sessionStorage.setItem(strArtistId + "_albums", jsAlbums);
				// Returns response value
				var arAlbums = response.topalbums.album;
				// Appends arAlbums to DOM
				fnAppendAlbumSmallCovers(arAlbums, $Target);
		});
	}
}



//--------------------------------------------------
// fnGetTopArtists
//--------------------------------------------------


function fnGetTopArtists(strCountry, $Target){

/**
 * @version           1.0b
 * @datelastmodified  02:33 06/01/2016
 * @category          Last-fm_Ajax
 * @author            matthias.morin@gmail.com
 * @purpose           Gets top artists from Last-fm with Ajax
 * @input             strCountry As String, $Target As jQuery object
 * @requires          jQuery
 * @uses              fnAppendArtistCard
 * @note              Caches jSon object into sessionStorage
 */

	// Checks if data is availlable in sessionStorage to avoid unnecessary server requests
	var jsArtists = window.sessionStorage.getItem(strCountry + "_artists");
	if (!!jsArtists){
		// Appends jsArtists to DOM
		fnAppendArtistCard(JSON.parse(jsArtists), $Target);
	}else{
		$.ajax({
			"url": "http://ws.audioscrobbler.com/2.0/",
			"data":{
				"method":  "geo.getTopArtists",
				"country": strCountry,
				"limit" :  10,
				"api_key": "e748a7f1fb6cb7ae4a5ae7bf78fd6517",
				"format":  "json"
			}
		})
		.done(function(response){
			// Stringifys response to properly cache it into sessionStorage
			var jsArtists = JSON.stringify(response.topartists.artist);
			// Caches resulting string into sessionStorage in order to avoid unnecessary server requests
			window.sessionStorage.setItem(strCountry + "_artists", jsArtists);
			// Returns response value
			var arArtists = response.topartists.artist;
			// Appends arArtists to DOM
			fnAppendArtistCard(arArtists, $Target);
		});
	}
}




//--------------------------------------------------
// init
//--------------------------------------------------


function init(){

/**
 * @version           1.1
 * @datelastmodified  11:53 15/01/2016
 * @category          last-fm
 * @author            matthias.morin@gmail.com
 * @purpose           Initialyzes script
 * @assumes           $Grid
 * @requires          jQuery, Masonry
 * @uses              fnGetTopArtists
 */

	$Grid.masonry({
		itemSelector: ".grid-item",
	});
	// Loads default page
	fnGetTopArtists("france", $Grid);
	$("form").on("submit", function(e){
		// Prevents browser from refreshing page after form submit
		e.preventDefault();
		// Empties $Grid
		$Grid.empty();
		// Converts input to lower case
		strCountry = $("#country").val().toLowerCase();
		fnGetTopArtists(strCountry, $Grid);
	});
}
