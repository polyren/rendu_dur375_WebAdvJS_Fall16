var app = app || {};

app.main = (function() {

	var tarot=[];
	var tarotmean=[];
	var pickup;
	var short;
	var checkboxes = $('.flipper');

	var createImage =function(src){
		var img = new Image();
		img.src = src;
		img.width = 133;
		return img;
	};

	for(i=0;i<22;i++){
	tarot.push(createImage('elements/tarot_'+[i]+'.png'));
	}

	shuffle(tarot);

function shuffle(array){
	var m=array.length,t,i;
	while(m){
		i=Math.floor(Math.random()*m--);
		t=array[m];
		array[m]=array[i];
		array[i]=t;
	}
	return array;
}
	
	for(i=0;i<22;i++){
	$('#card'+[i]).append( tarot[i]);
	}
	$('.flipper').flip();

function attachEvents() {
	$('.flipper').on('click', function(){
        var $$ = $(this)
        if( !$$.is('.checked')){
            $$.addClass('checked');
            $('.flipper').prop('checked', true);
            $('.flipper').not(this).removeClass('checked');
            $$.flip(true);
            $('.flipper').not(this).flip(false);
            var cardnumber=$(this).find(".back img").attr('src');
            short=cardnumber.slice(15,-4);
            createQueryHash(short);
            // console.log(JSON.stringify(short));
            // alert($$.val(''));
        } else {
            $$.removeClass('checked');
            $('.flipper').prop('checked', false);
            $$.flip(false);
        }
  	  });

	$(".button").hover(function() {
		$(this).attr("src","elements/button_2.svg");
			}, function() {
		$(this).attr("src","elements/button_1.svg");
	});



}

function createQueryHash(filters){
	// Here we check if filters isn't empty.
	if(!$.isEmptyObject(filters)){
		// Stringify the object via JSON.stringify and write it after the '#filter' keyword.

		// since filters is an object we need to stringify it
		var str = JSON.stringify(filters);

		window.location.hash = '#tarot/' + str;
	}
	else{
		// If it's empty change the hash to '#' (the homepage).
		window.location.hash = '#';
	}
	$('.close').click(function (e) {
			e.preventDefault();
			window.location.hash = '#';
		});
  }

	/*------------------------------------------------*/
	//	Load the JSON
	/*------------------------------------------------*/
	function loadData() {

		$.getJSON( "../results.json", function( data ) {
			// Write the data into our global variable.
			
			tarotmean = data;
			console.log(tarotmean);
			// Call a function to create HTML for all the students.
			gotoCardsHTML();

			// Manually trigger a hashchange to start the app.
			$(window).trigger('hashchange');
		});
	}
// 		/*------------------------------------------------*/
// 	// This fills up the students list via a handlebars template.
// 	// It receives one parameter - the data we took from students.json.
// 	/*------------------------------------------------*/
	function gotoCardsHTML() {
		$('#button').on('click', function (e) {
			e.preventDefault();
			var cardIndex =  JSON.stringify(short);
			window.location.hash = 'meaning/' + cardIndex;
			console.log(cardIndex);
		})
	}

	// function renderErrorPage(){
	// 	var page = $('.error');
	// 	page.addClass('visible');
	// }
// /*------------------------------------------------*/
// 	//	Mapping nav url to render specific page
// 	/*------------------------------------------------*/
	function render(url) {
		// console.log('fuckyou1');
		var temp = url.split('/')[0];
		// console.log('fuckyou');
		$('.main_content .page').removeClass('visible');

		var	map = {
			'':function(){
				renderHomePage();
			},
			'#tarot':function(){
				renderHomePage();
			},
			'#meaning': function() {
				var index = short;
				renderSingleCardPage(index, tarotmean);
			},

		};
		if(map[temp]){
			map[temp]();
		}
		// If the keyword isn't listed in the above - render the error page.
		// else {
		// 	renderErrorPage();
		// }
	}
// 	/*------------------------------------------------*/
// 	// Iterate through the students object & Make the students page visible
// 	/*------------------------------------------------*/
	function renderHomePage(){

		var page=$('.custom_page');
		page.addClass('visible');
	}
// 	/*------------------------------------------------*/
// 	// This fills up the students list via a handlebars template.
// 	// It receives one parameter - the data we took from students.json.
// 	/*------------------------------------------------*/

// 	/*------------------------------------------------*/
// 	// Pop-up the project detail
// 	/*------------------------------------------------*/
	// Its parameters are an index from the hash and the students object.
	function renderSingleCardPage(index, data){
		var page = $('.meancontainer'),
			logo = $('.meaning');

		// Find the wanted project by iterating the data object and searching for the chosen index.
		if(data.length){
			data.forEach(function (item) {
				if(item.id == index){
					// Populate '.popup-detail' with the chosen project's data.
					page.find('h1').text(item.title);
					page.find('#content1').text(item.content.General);
					page.find('#content2').text(item.content.Work);
					page.find('#content3').text(item.content.Love);
					page.find('#content4').text(item.content.Finances);
					page.find('#content5').text(item.content.Health);
					page.find('#content6').text(item.content.Spirituality);
					logo.find('img').attr('src', 'elements/tarotsign_'+[item.id+1]+'.png');
				}
			});
		}
		logo.addClass('visible');
	}

	var init = function(){
		attachEvents();
		loadData();
		
		$(window).on('hashchange', function(){
			render(decodeURI(window.location.hash));
		});
	};
		return {
		init: init
	};
})();

window.addEventListener('DOMContentLoaded', app.main.init);