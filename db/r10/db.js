// (c) Theo Armour ~ 2014-07-06 ~ r10 ~ MIT License 

	var converter;
	var content;

	function init() {
		if ( !converter ) {
			converter = new Showdown.converter();
// Styles for the doc
			var css = document.body.appendChild( document.createElement('style') );
			css.innerHTML = 'body { font: normal 12pt sans-serif; margin: 0; overflow: hidden; }';

//Styles for menu and content
			var basics = 'border: 3px double #eee; overflow-x: hidden; overflow-y: auto; padding: 10px; position: absolute; ';
			var horizontalsMenu = 'left: 10%; width: 15%; ';
			var horizontalsContent = 'left: 30%; width: 60%; ';
			var verticals = 'height: ' + ( window.innerHeight * 0.88 ) + 'px; top: 60px; ';

// Menu panel
			var menu = document.body.appendChild( document.createElement( 'div' ) );
			menu.style.cssText = basics + horizontalsMenu + verticals ;
			menu.innerHTML = converter.makeHtml( requestFile( 'readme-menu.md' ) );

// Messages panel
			var messages = menu.appendChild( document.createElement( 'div' ) );
			if ( msg ) messages.innerHTML = msg;

// Content panel
			content = document.body.appendChild( document.createElement( 'div' ) );
			content.style.cssText = basics + horizontalsContent + verticals ;

// Events
			window.addEventListener('hashchange', init, false );
		}

		if ( location.hash.indexOf( '.md' ) > -1 ) {
			displayMD( location.hash );
		} else if ( location.hash.indexOf( '.html' ) > -1 ) {
			displayHTML( location.hash );
		} else {
			displayMD( '#readme.md#rm' );
		}
	}

	function displayMD( hash ) {
// Fetch and show the content file
		var hashes = hash.split('#');
		content.innerHTML = converter.makeHtml( requestFile( hashes[1] ) );

// Update window title to match H1 of content file
		var title = content.innerHTML.match( /<h1(.*?)>(.*?)<\/h1>/ )[2];
		updateContainer( title, hash )
	}

	function displayHTML( hash ) {
		var hashes = hash.split('#');
		content.innerHTML = '<iframe id=ifr src=' + hashes[1] + ' height=98% width=100% frameborder=0 ></iframe>';

		var title = hashes[1]; // todo: find better...
		updateContainer( title, hash )
	}

	function updateContainer( title, hash ) {
		var hashes = hash.split('#');

// Update window title to match H1 of content file
		document.title = title;

// Reset background color to all paragraphs in menu ~ thus automatically catching all the menu items
		var paragraphs = document.getElementsByTagName('div');

		for (var i = 0, len = paragraphs.length; i < len; i++) {
			paragraphs[i].style.backgroundColor = '';
		}

// Highlight current menu item
		if ( hashes[ 2 ] ) {
			var element = document.getElementById( hashes[ 2 ] );
			if ( element && element.style ) {
				element.style.backgroundColor = '#edd';
			}
		}

// Update URL hash
		if ( hashes[1] === 'readme.md' ) {
// if at home page, delete any hash and clean up the history
			history.pushState( '', document.title, window.location.pathname );
		} else {
			location.hash = hash;
		}
	}

// Fetch a file
	function requestFile( fname ) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( 'GET', fname, false );
		xmlHttp.send( null );
		return xmlHttp.responseText;
	}
