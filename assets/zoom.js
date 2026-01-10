//Adapted (to the point of unrecognisability) from Cabel Sasser's FancyZoom script:
//www.fancyzoom.com

//Preferences
var clearance	= 60,
	shadowColor	= '0, 0, 0',
	shadowSize	= '0px 5px 25px';

var zoomPane;
var gT='getElementsByTagName';

//Image preloader
var p = preloader = new Image();
p.images	= {};
p.onload	= function()
{
	var t=this;
	t.images[t.src] = { width: t.width, height: t.height };
	if (t.priority) { zoomIn(t.priority); t.priority = null; }
}
p.onerror	= function() { this.priority = null; }
p.preload	= function(from, prioritise)
{
	var t=this;
	if (prioritise || !t.priority) {
		t.src	= from.href;
		if (prioritise)
		{
			t.priority = from;
			setTimeout(showSpinner, 150);	//delay in case we load quickly
		}
	}
}

//Build zoom pane elements
function makeZoomPane()
{
	var b=document[gT]('body')[0],
		fC='firstChild',
		aC='appendChild',
		iB='insertBefore',
		baseStyle = { position: 'absolute', visibility: 'hidden' };
	
	var z=zoomPane	= buildEl('div',	{ id: 'zoom-pane', onclick: zoomOut },	baseStyle);
	z.spinner		= buildEl('div',	{ id: 'zoom-spinner' },					baseStyle);

	z[aC](z.close 	= buildEl('div',	{ id: 'zoom-close' })	);
	z[aC](z.image	= buildEl('img',	{ id: 'zoom-image' })	);
	z[aC](z.caption	= buildEl('div', 	{ id: 'zoom-caption' })	);
	
	//Can't use appendChild because it makes the page longer in Firefox
	b[iB](zoomPane,		b[fC]);
	b[iB](z.spinner,	b[fC]);
}

//Add event handlers to every image link
//Skips links that have "nozoom" in their rel tag
function prepLinks()
{
	var i, p, l	= document[gT]('a'),
		evts	= {
		click:		linkClicked,
		mouseover:	linkFocused,
		focus:		linkFocused
	};

	for (i=0; i<l.length; i++)
		if (!/\bnozoom\b/i.test(l[i].rel)
		&& /\.(jpe?g|png|gif|bmp|tiff?)$/i.test(l[i].pathname))
			for (p in evts) addEvent(l[i], p, evts[p]);
}

/* Event handlers */

//image link was hovered, preload its image
function linkFocused()	{ if (!preloader.images[this.href]) preloader.preload(this); }

//image link was clicked, check if image is loaded and display it
function linkClicked(e)
{
	//Skip our behaviour if any modifier keys were pressed
	if (e.metaKey || e.altKey || e.shiftKey || e.ctrlKey) return;

	//if the image isn't preloaded yet, do it now and show the spinner
	if (!preloader.images[this.href]) preloader.preload(this, true);

	//if we're already looking at this image, zoom it back out
	else if (this.href == zoomPane.image.src && zoomPane.isZoomed) zoomOut();
	
	//otherwise zoom in
	else zoomIn(this);
	
	//prevent the browser from following the link
	cancelEvent(e);
}

//Listen for esc/space hotkeys while image is zoomed
function getKey(e)
{
	if (e.keyCode == 27 || e.keyCode == 32 || e.charCode == 32)
	{
		zoomOut();
		cancelEvent(e);
	}
}

/* Spinner */

//Show the spinner animation
function showSpinner()
{
	//Don't bother if the preloader isn't doing anything
	if (!preloader.priority) return;
	
	var s=zoomPane.spinner;
	if (!s.anim) s.anim = new Anim({
		rate:	80,
		frame:	1,
		frames: 12,
		el:		s,
		step:	function() {
			var t=this;
			if (!preloader.priority) t.stop();
			t.el.style.backgroundPosition = -(t.el.offsetWidth * (t.frame - 1)) + 'px 0';
			t.frame = ++t.frame%t.frames;
		},
		after:	function() { this.el.style.visibility = 'hidden' }
	});
	else if (s.anim.active) return;

	var view = getViewport();
	s.style.left		= (view.left	+ 0.5 * (view.width - s.offsetWidth))	+ 'px';
	s.style.top			= (view.top		+ 0.5 * (view.height - s.offsetHeight))	+ 'px';
	s.style.visibility	= 'visible';
	s.anim.start();
	fade(s, 0, 1, 250);
	
	zoomOut(); //hide any zoomed image
}

/* Zoom */

//Zoom the pane to its final width and height, using the source link as a starting-point
function zoomIn(fromLink) {
    var z = zoomPane;
    
    // Clear any current zoom immediately
    if (z.zoomAnim) {
        z.zoomAnim.stop(true);
        z.style.visibility = 'hidden';
        z.image.src = ''; // Clear current image
    }
    
    // Halt any pending preload priorities
    preloader.priority = null;
    preloader.src = ''; // Stop any current loading



	

	//Halt any zooms in the queue
	if (z.zoomAnim) z.zoomAnim.stop(true);
	preloader.priority = null;
	
	//Hide the close icon and caption
	z.close.style.visibility = z.caption.style.visibility = 'hidden';
	
	//Set the caption text
	z.caption.innerHTML = fromLink.title;

	//Determine starting size from the source element: either the thumbnail or the link itself
	//store this in origin for zoomOut to use later
	z.origin	= fromLink[gT]('img')[0] || fromLink;
	var from	= getPos(z.origin);

	//Determine final size from preloaded image dimensions
	var uri		= z.image.src = fromLink.href,
		img		= preloader.images[uri];
	var to		= { width: img.width, height: img.height };
	var ratio	= to.width / to.height;

	//Scale to fit the window (preserving aspect ratio)
	var view		= getViewport(),
		captionSize = z.caption.offsetHeight * 1.5,
		maxWidth	= view.width - clearance,
		maxHeight	= view.height - clearance - captionSize;

	if (to.width > maxWidth)	{ to.width = maxWidth; to.height = to.width / ratio; }
	if (to.height > maxHeight)	{ to.height = maxHeight; to.width = to.height * ratio; }

	to.top	= view.top	+ 0.5 * (view.height - to.height - captionSize);
	to.left	= view.left	+ 0.5 * (view.width - to.width);

	// Start the zoom
	zoom(z, from, to, 250, afterZoomIn);
	fade(z, 0, 1, 200);

	z.style.visibility = 'visible';
	
	z.isZoomed = true;
	//Listen for dismissal keypresses
	addEvent(document, 'keypress', getKey);
}

//Post-zoom-in setup
function afterZoomIn()
{
	var z=this.el;
	//Display the caption
	if (z.caption.innerHTML.length) z.caption.style.visibility = 'visible';
	
	//Show close icon
	z.close.style.visibility = 'visible';
	
	//Fade in box shadow
	fade(z, 0, 0.5, 400, setShadow);
}

//Zoom back out to the source link
function zoomOut()
{
	var z=zoomPane;

	if (!z.isZoomed) return;
	if (z.zoomAnim) z.zoomAnim.stop(true);

	//Figure out where we came from to get back there
	var p, from={}, to=getPos(z.origin);
	for (p in to) from[p]=parseInt(z.style[p]);

	//Hide shadow, close box and caption
	setShadow(z, 0);
	z.close.style.visibility = z.caption.style.visibility = 'hidden';

	zoom(z, from, to, 200, afterZoomOut);
	fade(z, 1, 0, 150);
	
	z.isZoomed = false;
	
	// Stop grabbing keypresses
	removeEvent(document, 'keypress', getKey);
}
//Hide pane after zoomout
function afterZoomOut()	{ this.el.style.visibility = 'hidden'; }

//Start zoom animation
function zoom(el, from, to, duration, afterZoom)
{
	//Cancel other animations
	if (el.fadeAnim) el.fadeAnim.stop();
	el.zoomAnim = new Anim({
		el:		el,
		from:	from,
		to:		to,
		duration: duration,
		after:	afterZoom,
		apply:	applyZoom
	}, true);
}

//Perform each frame of the zoom
function applyZoom(ratio)
{
	var p, t=this;
	for (p in t.from) t.el.style[p] = easeInOut(ratio, t.from[p], t.to[p]) + 'px';
}


/* Fade */

//Start a fade animation
function fade(el, from, to, duration, fadeWith)
{
	if (el.fadeAnim) el.fadeAnim.stop();
	if (!fadeWith) fadeWith = setOpacity;
	
	el.fadeAnim = new Anim({
		apply:	applyFade,
		fader:	fadeWith,
		duration: duration,
		el:		el,
		from:	from,
		to:		to,
	}, true);
}

//Perform each frame of the fade
function applyFade(ratio)
{
	var t=this, opacity = linear(ratio, t.from, t.to);
	t.fader(t.el, opacity);
}


if (document.body.filters)	//IE
	setOpacity	= function(el, opacity) { el.style.filter = (opacity == 1) ? '' : 'alpha(opacity=' + (opacity * 100) + ')'; }
else	//Everyone else
	setOpacity	= function(el, opacity) { el.style.opacity = (opacity == 1) ? '' : opacity; }

function setShadow(el, opacity)
{
	var s=el.style,
		shadow = (opacity <= 0) ? '' : 'rgba(' + shadowColor + ',' + opacity + ')' + shadowSize;
	s.boxShadow = s.webkitBoxShadow = s.MozBoxShadow = shadow;
}

//Math functions for smooth animation, adapted from http://www.robertpenner.com/easing/
function linear(r, f, t)	{ return (r*(t-f))+f; }
function easeInOut(r, f, t)
{
	t=(t-f)/2;
	if ((r*=2) < 1) return t*r*r*r + f;
	return t*((r-=2)*r*r + 2) + f;
}

//Get the dimensions of the viewport
if (window.innerHeight) getViewport=function() //Everyone but IE
{
	return {
		width:	innerWidth,
		height: innerHeight,
		left:	pageXOffset,
		top:	pageYOffset
	};
}
else getViewport=function() //IE
{
	var b=document.documentElement || document.body;
	return {
		width:	b.clientWidth,
		height:	b.clientHeight,
		left:	b.scrollLeft,
		top:	b.scrollTop
	};
}

//Get the position and size of the specified element
function getPos(el)
{
	var pos = {
		width:	el.offsetWidth,
		height:	el.offsetHeight,
		left:	0,
		top:	0
	};
	do {
		pos.left	+= el.offsetLeft;
		pos.top		+= el.offsetTop;
	}
	while (el=el.offsetParent)
	return pos;
}

//Create a new element with attributes and styles
function buildEl(type, attrs, styles)
{
	var p, el = document.createElement(type);
	for (p in attrs)	el[p]		= attrs[p];
	for (p in styles)	el.style[p]	= styles[p];
	return el;
}

//Prototype for animations
function Anim(props, now) { for (var p in props) this[p] = props[p]; if (now) this.start(); }
Anim.prototype = {
	rate: 20,
	start: function()
	{
		var t=this;
		t.startTime = new Date().getTime();
		t.active = setInterval(function(){ t.step() }, t.rate);
		t.step();
	},
	step: function()
	{
		var t=this;
		t.elapsed = new Date().getTime() - t.startTime;
		if (t.elapsed >= t.duration) t.stop();
		else t.apply(t.elapsed/t.duration);
	},
	stop: function(c)
	{
		var t=this;
		if (t.active)
		{
			if (!c)
			{
				if (t.apply) t.apply(1);
				if (t.after) t.after();
			}
			clearInterval(t.active);
			t.active = null;
		}
	}
}

/*
AddEvent Manager (c) 2005-2006 Angus Turnbull http://www.twinhelix.com
Free usage permitted as long as this credit notice remains intact.
*/
function addEvent(o, t, f, l)
{
	var d = 'addEventListener';
	if (o[d] && !l) return o[d](t, f, false);
	if (!o._evts) o._evts = {};
	if (!o._evts[t])
	{
		var n = 'on' + t;
		o._evts[t] = o[n] ? { b: o[n] } : {};
		if (o[n]) o[n]._i = -1;
		o[n] = new Function('e', 'return addEvent._c(e||window.event, this, this._evts["' + t + '"])');
	}
	if (!f._i) f._i = addEvent._i++;
	o._evts[t][f._i] = f;
	if (t != 'unload') addEvent(window, 'unload', function() {removeEvent(o, t, f, l)});
}
addEvent._i = 1;
addEvent._c = function(e, o, a)
{
	var r = true, i;
	for (i in a) { if (a[i]._i) {o._f = a[i]; r = o._f(e) != false && r} }
	o._f = null;
	return r;
}
function removeEvent(o, t, f, l)
{
	var d = 'removeEventListener';
	if (o[d] && !l) return o[d](t, f, false);
	if (o._evts && o._evts[t] && f._i) delete o._evts[t][f._i];
}
function cancelEvent(e)
{
	e.returnValue = false;
	if (e.preventDefault) e.preventDefault();
}

addEvent(window, 'load', function() { makeZoomPane(), prepLinks() });
