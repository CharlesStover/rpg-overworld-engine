// X-coordinate sprite sheet navigation
$.fn.backgroundPositionX = function(x)
{
	return this.css("background-position", this[0].style.backgroundPosition.replace(/^[\d\-]+(?:px)?/, x));
};

// XY-coordinates sprite sheet navigation
$.fn.backgroundPositionXY = function(x, y)
{
	this.backgroundPositionX(x);
	this.backgroundPositionY(y);
	return this;
};

// Y-coordinate sprite sheet navigation
$.fn.backgroundPositionY = function(y)
{
	return this.css("background-position", this[0].style.backgroundPosition.replace(/[\d\-]+(?:px)?$/, y));
};

// check to see if an event exists for a jQuery object
$.fn.hasEvent = function(event)
{
	return GAMEngine.keyExists(event, $.data(this[0], "events"));
};

// move objects
$.fn.move = function(x, y)
{

	// If multiple objects are being moved,
	if (GAMEngine.keyExists(1, this))
	{
		for (var z = 0; GAMEngine.keyExists(z, this); z++)
			$(this.get(z)).move(x, y);
		return this;
	}
	if (x != 0)
		this.css("left", (GAMEngine.px2int(this.css("left")) + x) + "px");
	if (y != 0)
		this.css("top", (GAMEngine.px2int(this.css("top")) + y) + "px");
	return this;
};

// relative background position scrolling
$.fn.scroll = function(x, y, animate)
{
	var backgroundPosition = this[0].style.backgroundPosition; // this.css("background-position");
	var oldX = 0,
		oldY = 0,
		xType = "px",
		yType = "px";
	if (backgroundPosition.match(/^([\d\-]+)(em|%|px)?\s([\d\-]+)(em|%|px)?$/))
	{
		oldX = parseInt(RegExp.$1, 10);
		xType = RegExp.$2;
		oldY = parseInt(RegExp.$3, 10);
		yType = RegExp.$4;
	}
	if (
		typeof(animate) != "undefined" &&
		Math.abs(x) > 1 &&
		animate
	)
	{
		//return this.animate({backgroundPosition: backgroundPosition}, animate);
		var step = animate / Math.abs(x),
			tempID = 1;
		while (GAMEngine.keyExists("animate" + tempID, GAMEngine.temp))
			tempID++;
		GAMEngine.temp["animate" + tempID] = this;
		for (var z = 0; z < Math.abs(x); z += 1)
			setTimeout("GAMEngine.temp.animate" + tempID + ".scroll(" + (x > 0 ? 1 : -1).toString() + ", 0);", (z + 1) * step);
		setTimeout("delete GAMEngine.temp.animate" + tempID + ";", animate);
		return this;
	}
	return this.css("background-position", (oldX + x).toString() + xType + " " + (oldY + y).toString() + yType);
};

// jQuery object collision detection
$.fn.touching = function(x1, y1, x2, y2, shiftx, shifty)
{

	var shift = [
		typeof(shiftx) == "number" ? shiftx : 0,
		typeof(shifty) == "number" ? shifty : 0
	];

	// Convert Object 2 to coordinate values.
	if (typeof(x1) == "object")
	{
		if (typeof(y1) == "number")
			shift[0] = y1;
		if (typeof(x2) == "number")
			shift[1] = x2;
		var left = GAMEngine.px2int(x1.css("left")),
			top = GAMEngine.px2int(x1.css("top"));
		var y1 = top,
			x2 = left + x1.width() - 1,
			y2 = top + x1.height() - 1;
		x1 = left;
	}

	// Convert Object 1 to coordinate values.
	var left = GAMEngine.px2int(this.css("left")),
		top = GAMEngine.px2int(this.css("top"));
	return GAMEngine.touching(
			left + shift[0], top + shift[1],
			left + this.width() - 1 + shift[0],
			top + this.height() - 1 + shift[1],
			x1, y1, x2, y2
		);
};

var $document = $(document),
	$window = $(window),
	GAMEngine = {
		$objects: [],
		audio: {},

		// key binding
		bind: function(keys, execute, settings)
		{
			if (typeof(keys) != "object")
				keys = [keys];
			if (typeof(settings) != "object")
				settings = {};
			for (var x = 0; x < keys.length; x++)
			{
				this.keyBinds[keys[x]] = {
					action: (typeof(settings.action) == "undefined" ? "down" : settings.action),
					execute: execute,
					speed: (typeof(settings.speed) == "undefined" ? 20 : settings.speed),
					type: (typeof(settings.type) == "undefined" ? "hold" : "once")
				};
			}
		},

		// cookie reading/writing
		cookies: {
			read: function(name)
			{
				var cookies = document.cookie.split(";");
				name = name + "=";
				for (x = 0; x < cookies.length; x++)
				{
					var c = cookies[x].match(/^\s*(.*)$/)[1];
					if (c.indexOf(name) == 0)
						return c.substring(name.length, c.length);
				}
				return null;
			},
			remove: function(name)
			{
				document.cookie = name + "=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
			},
			set: function(name, value, expires)
			{
				if (typeof(expires) == "undefined")
					expires = 31536000000;
				var d = new Date();
				d.setTime(d.getTime() + expires);
				document.cookie = name + "=" + value + "; expires=" + d.toGMTString() + "; path=/";
			}
		},
		copyright: {
			html: '<a href="http://www.charlesstover.com/gamengine/" title="GAMEngine &copy; 2011, Charles Stover">GAMEngine</a> &copy; 2011, <a href="http://www.charlesstover.com/" title="Charles Stover">Charles Stover</a>',
			text: "GAMEngine (c) 2011, Charles Stover"
		},

		// object creation
		createObject: function(settings)
		{
			if (typeof(settings) != "object")
				settings = {};
			var defaultSettings = {
					collisionable: true,
					data: false,
					gravity: 0,
					gravityCallback: false,
					gravityCollision: false,
					group: false,
					left: "0",
					position: "absolute",
					top: "0"
				};
			for (x in defaultSettings)
			{
				if (!GAMEngine.keyExists(x, settings))
					settings[x] = defaultSettings[x];
			}
			var id = "object" + (this.$objects.length + 1).toString();
			this.$screen.append('<div class="object' + (settings.group ? " " + settings.group : "") + '" id="' + id + '"></div>');
			var $object = $("#" + id);
			if (settings.data)
				$object.data(settings.data);
			$object.data("collisionable", settings.collisionable);
			$object.data("gravities", 0);
			$object.data("gravity", settings.gravity);
			$object.bind("gravityCallback", settings.gravityCallback);
			$object.bind("gravityCollision", settings.gravityCollision);
			delete settings.collisionable, settings.data, settings.gravity, settings.gravityCallback, settings.gravityCollision, settings.group;
			$object.css(settings);
			this.$objects.push($object);
			return $object;
		},

		// CSS alteration
		css: {
			add: function(id, content)
			{
				$head.append("<style id=\"" + id + "\" type=\"text/css\"><!--\r\n" + content + "\r\n--><\/style>");
			},
			remove: function(id)
			{
				$head.remove("#" + id);
			},
			update: function(id, content)
			{
				this.remove(id);
				this.add(id, content);
			}
		},

		// debug system
		debug: function(string, append)
		{
			if (typeof(string) == "undefined")
				return this.$debug.html();
			return this.$debug[typeof(append) == "undefined" ? "html" : "append"](
				typeof(string) == "boolean" ?
				string ?
				"true" :
				"false" :
				typeof(string) == "object" ?
				this.object2string(string).replace(/\r\n/g, "<br />") :
				string
			);
		},
		global: {},

		// pull on objects
		gravity: function()
		{

			// For each object
			for (var x = 0; x < this.$objects.length; x++)
			{

				// that is affected by gravity,
				if (this.$objects[x].data("gravity") != 0)
				{

					// Have we collided yet?
					var collided = false,
						absGravity = Math.abs(this.$objects[x].data("gravity"));

					// for every pixel it is to travel,
					// (if we already know it collides after Y pixels, don't check further than Y)
					for (var y = 1; y <= Math.ceil(absGravity); y++)
					{

						// for each object
						for (var z = 0; z < this.$objects.length; z++)
						{

							// that isn't the first object,
							if (x != z)
							{

								// check to see if the second object is in the way of the first object's movement.
								if (
									this.$objects[z].data("collisionable") &&
									this.$objects[x].touching(this.$objects[z], 0, this.$objects[x].data("gravity") > 0 ? y : -1 * y)
								)
								{
									collided = true;

									// If we've already collided, don't bother checking further objects for the same coordinates.
									break;
								}
							}
						}

						// If we've already collided, don't bother checking further pixels.
						if (collided)
							break;
					}

					// Use the last safe pixel.
					y--;

					// The pixel is unoccupied. Move to it!
					if (y > 0)
					{

						// It has not collided with anything.
						this.$objects[x].data("collision", false);

						// Gravity has affected it this many times.
						this.$objects[x].data("gravities", this.$objects[x].data("gravities") + 1);

						// Move the object.
						this.$objects[x].css("top",
							(

								// current vertical alignment, plus
								this.px2int(this.$objects[x].css("top")) +

								// move the maximum number of pixels in the same direction as gravity is pulling, plus
								(
									this.$objects[x].data("gravity") > 0 ?
									y :
									-1 * y
								) +

								// fractions of pixels
								(

									// if there is a fraction of a pixel, and we don't collide before we reach it,
									absGravity % 1 > 0 &&
									y == absGravity ?
									(
										Math.random() > absGravity % 1 ?
										-1 :
										0
									) :
									0
								)
							).toString() + "px"
						);

						// If a gravity callback exists for the object, call it.
						if (this.$objects[x].hasEvent("gravityCallback"))
							this.$objects[x].trigger("gravityCallback");
					}

					// We've collided!
					else
					{
						// If this is a new collision (not re-colliding with something they are already touching),
						if (this.$objects[x].data("collision") != z)
						{

							// Set the last object with which the current object collided.
							this.$objects[x].data("collision", z);

							// If a gravity-induced collision callback exists for the object, call it.
							if (this.$objects[x].hasEvent("gravityCollision"))
								this.$objects[x].trigger("gravityCollision");
						}
						this.$objects[x].data("gravities", 0);
					}
				}
			}
			setTimeout("GAMEngine.gravity();", 20);
			return true;
		},

		// port of in_array
		inArray: function(needle, haystack, strict)
		{
			if (
				typeof(needle) == "object" &&
				typeof(haystack) != "object"
			)
			{
				var temp = needle;
				needle = haystack;
				haystack = temp;
				delete temp;
			}
			if (typeof(strict) == "undefined")
				strict = false;
			for (x in haystack)
			{
				if (
					haystack[x] == needle &&
					(
						!strict ||
						haystack[x] === needle
					)
				)
					return true;
			}
			return false;
		},
		intervals: {},
		keyBinds: {},

		// convert a key code to its key name
		keyCode2Key: function(keyCode, shift)
		{
			var lowercase = null;

			// For every "known" keyCode,
			for (x in this.keyCodes)
			{

				// If the keyCode is a match,
				if (this.keyCodes[x] == keyCode)
				{

					// If we're looking for an uppercase character,
					if (
						typeof(shift) != "undefined" &&
						shift
					)
					{

						// If the lowercase character was already found, this is the uppercase character.
						if (lowercase)
							return x;
						lowercase = x;
					}

					// If we're not looking for an uppercase character, return this key.
					else
						return x;
				}
			}

			// If no uppercase character exists, return the lowercase character.
			// If no key exists, return null.
			return lowercase;
		},

		// list of key names
		keyCodes: {
			backspace: 8, tab: 9, enter: 13, shift: 16, ctrl: 17, capsLock: 20, esc: 27,
			space: 32, pageUp: 33, pageDown: 34, end: 35, home: 36,
			left: 37, up: 38, right: 39, down: 40,
			insert: 45, del: 46,
			0: 48, ")": 48, 1: 49, "!": 49, 2: 50, "@": 50, 3: 51, "#": 51, 4: 52, "$": 52,
			5: 53, "%": 53, 6: 54, "^": 54, 7: 55, "&": 55, 8: 56, "*": 56, 9: 57, "(": 57,
			a: 65, A: 65, b: 66, B: 66, c: 67, C: 67, d: 68, D: 68, e: 69, E: 69, f: 70, F: 70, g: 71,
			G: 71, h: 72, H: 72, i: 73, I: 73, j: 74, J: 74, k: 75, K: 75, l: 76, L: 76, m: 77, M: 77,
			n: 78, N: 78, o: 79, O: 79, p: 80, P: 80, q: 81, Q: 81, r: 82, R: 82, s: 83, S: 83, t: 84,
			T: 84, u: 85, U: 85, v: 86, V: 86, w: 87, W: 87, x: 88, X: 88, y: 89, Y: 89, z: 90, Y: 90,
			windows: 91, rightClick: 93,
			f1: 112, F1:112, f2: 113, F2: 113, f3: 114, F3: 114, f4: 115, F4: 115, f5: 116, F5: 116, f6: 117, F6: 117,
			f7: 118, F7: 118, f8: 119, F8: 119, f9: 120, F9: 120, f10: 121, F10: 121, f11: 122, F11: 122, f12: 123, F12: 123,
			numLk: 144,
			";": 186, ":": 186, "=": 187, "+": 187, ",": 188, ".": 188, "-": 189, "_": 189, ".": 190, ">": 190, "/": 191, "?": 191, "`": 192, "~": 192,
			"[": 219, "{": 219, "\\": 220, "|": 220, "]": 221, "}": 221, "'": 222, '"': 222
		},

		// function called onkeydown
		keyDown: function(e, queue)
		{

			// Identify queued keys - keys waiting to execute until another key with the same function is done executing.
			if (typeof(queue) == "undefined")
				queue = false;

			var key = GAMEngine.keyCode2Key(e.keyCode);

			// If a key down bind exists, and it isn't already being pressed, or it is queued.
			if (
				GAMEngine.keyExists(key, GAMEngine.keyBinds) &&
				GAMEngine.inArray(GAMEngine.keyBinds[key].action, ["down", "both"]) &&
				(
					!GAMEngine.keyExists(key, GAMEngine.keysDown) ||
					queue
				)
			)
			{

				// Make sure there are no key aliases (i.e. don't run it again if both keys are pressed).
				for (x in GAMEngine.keysDown)
				{

					// If this function is identical to one already running, queue it to run later. There is a delay between the browser's recognition
					// of the first and second key execution. By trying to execute the key later, we effectively stop this gap from being noticeable.
					// e.g. If left and right are both bound to the same function, the user is already holding left, presses right (first execution), then lets go of left,
					// there will be a gap until the second execution of the right key. During that gap, no action will occur for the user, when the right key *should* be executing.
					if (
						x != key &&
						GAMEngine.keyBinds[x].execute == GAMEngine.keyBinds[key].execute
					)
					{
						GAMEngine.keysDown[key] = true;

						// If it's still held down, try again.
						setTimeout("if (GAMEngine.keyExists(GAMEngine.keyCode2Key(" + e.keyCode + "), GAMEngine.keysDown)) GAMEngine.keyDown({keyCode: " + e.keyCode + "}, true);", 2);
						return false;
					}
				}

				// If it is a key to hold, set an interval. Otherwise, execute it once.
				if (GAMEngine.keyBinds[key].type == "once")
					GAMEngine.keysDown[key] = true;
				else
					GAMEngine.keysDown[key] = setInterval('GAMEngine.keyBinds.' + key + '.execute("' + key + '", ' + e.keyCode + ', "down");', GAMEngine.keyBinds[key].speed);
				GAMEngine.keyBinds[key].execute(key, e.keyCode, "down");
				return true;
			}
			return false;
		},

		// port of array_key_exists
		keyExists: function(needle, haystack)
		{
			if (
				typeof(needle) == "object" &&
				typeof(haystack) != "object"
			)
			{
				var temp = needle;
				needle = haystack;
				haystack = temp;
				delete temp;
			}
			return needle in haystack;
		},
		keysDown: {},

		// function called onkeyup
		keyUp: function(e)
		{
			var key = GAMEngine.keyCode2Key(e.keyCode);

			// If a key bind exists, and it is executing.
			if (
				GAMEngine.keyExists(key, GAMEngine.keyBinds) &&
				GAMEngine.keyExists(key, GAMEngine.keysDown)
			)
			{

				// If it's an interval, clear it.
				if (GAMEngine.keysDown[key] !== true)
					clearInterval(GAMEngine.keysDown[key]);
				delete GAMEngine.keysDown[key];

				// If a key up bind is set
				if (GAMEngine.inArray(GAMEngine.keyBinds[key].action, ["up", "both"]))
					GAMEngine.keyBinds[key].execute(key, e.keyCode, "up");
				return true;
			}
			return false;
		},

		// re-arrange an array to alter its first value
		makeFirst: function(needle, haystack)
		{
			if (typeof(needle) == "object")
			{
				var temp = needle;
				needle = haystack;
				haystack = temp;
				delete temp;
			}
			var newHaystack = [],
				found = false;
			for (x = 0; x < haystack.length; x++)
			{
				if (haystack[x] == needle)
					found = x;
				if (found !== false)
					newHaystack.push(haystack[x]);
			}
			for (x = 0; x < found; x++)
				newHaystack.push(haystack[x]);
			return newHaystack;
		},

		// mute all audio elements
		mute: function()
		{
			for (player in this.audio)
			{
				if (typeof(this.audio[player].pause) == "function")
					this.audio[player].pause();
				else
					break;
			}
			this.muted = true;
		},
		muted: false,

		// convert an array/object to a string
		object2string: function(object)
		{
			var temp = "";
			for (x in object)
				temp += x + ": " + object[x] + "\r\n";
			return temp;
		},

		// play a music file via an audio element
		play: function(player, sound)
		{
			if (typeof(this.audio[player].play) == "function")
			{
				this.audio[player].setAttribute("src", sound);
				if (!this.muted)
					audio[player].play();
			}
		},

		// position the game screen
		position: function(x, y)
		{

			// When the window is resized, convert the event object to intended variables for use in the later algorithm.
			if (typeof(x) == "object")
			{
				var y = x.data.y;
				x = x.data.x;
			}

			// If either value is non-static, set this function to execute whenever the window is resized.
			// ELSE is used because the bind already exists if an object is being sent.
			else if (
				typeof(x) == "string" ||
				typeof(y) == "string"
			)
				$window.bind("resize", {x: x, y: y}, this.position);

			// If both values are static, stop executing this function whenever the window is resized.
			else
				$window.unbind("resize", {x: x, y: y}, this.position);

			GAMEngine.$screen.css({
				left: (
					x == "center" ?
						($window.width() - GAMEngine.$screen.outerWidth()) / 2 :
					x == "left" ?
						0 :
					x == "right" ?
						$window.width() - GAMEngine.$screen.outerWidth() :
					x
				),
				top: (
					y == "bottom" ?
						$window.height() - GAMEngine.$screen.outerHeight() :
					GAMEngine.inArray(y, ["center", "middle"]) ?
						($window.height() - GAMEngine.$screen.outerHeight()) / 2 :
					y == "top" ?
						0 :
					y
				)
			});
		},
		positions: {
			x: 0,
			y: 0
		},

		// preload files
		preloader: {
			add: function()
			{
				while (this.element.childNodes.length > 0)
					this.element.removeChild(this.element.firstChild);
				this.loaded = 0;
				this.started = new Date().getTime();
				this.total = arguments.length;
				for (var x = 0; x < this.total; x++)
				{
					var y = new Image();
					y.onload = function()
					{
						GAMEngine.preloader.loaded++;
						GAMEngine.preloader.callback();
					};
					y.setAttribute("src", arguments[x]);
					this.element.appendChild(y);
				}
			},
			callback: function(){},
			element: document.getElementById("preload"),
			loaded: 0,
			started: 0,
			total: 0
		},

		// strip px from a string
		px2int: function(string)
		{
			return parseInt(string.match(/^([\-\d]+)(?:px)?$/)[1], 10);
		},

		// easy random numer generator
		random: function(from, to)
		{
			if (typeof(to) == "undefined")
				return from[Math.floor(Math.random() * from.length)];
			return Math.floor(Math.random() * (to - from + 1)) + from;
		},

		// function called when the document is ready
		ready: function()
		{
			GAMEngine.$body = $("body");
			GAMEngine.$debug = $("#debug");
			GAMEngine.$head = $("head");
			GAMEngine.$screen = $("#screen");
			var audio = document.getElementsByTagName("audio"),
				x;
			for (x = 0; x < audio.length; x++)
			{
				if (audio.item(x).getAttribute("id"))
					GAMEngine.audio[audio.item(x).getAttribute("id")] = audio.item(x);
			}
		},

		// pad a string
		// strPadLeft(25, 4, 0) -> 0025
		strPadLeft: function(str, length, pad)
		{
			if (typeof(str) != "string")
				str = str.toString();
			if (typeof(pad) == "undefined")
				pad = " ";
			else if (typeof(pad) != "string")
				pad = pad.toString();
			while (str.length < length)
				str = pad + str;
			return str;
		},
		temp: {},
		timeouts: {},

		// block collision detection
		touching: function(x1, y1, x2, y2, x3, y3, x4, y4)
		{

			// If they are horizontally aligned,
			if (
				(
					x1 >= x3 &&
					x1 <= x4
				) ||
				(
					x3 >= x1 &&
					x3 <= x2
				)
			)
			{

				var bottom = false,
					top = false;

				// Object 1 is touching the top of Object 2.
				if (
					(
						y2 >= y3 &&
						y2 <= y4
					)
				)
					top = true;

				// Object 1 is touching the bottom of Object 2.
				if (
					y1 <= y4 &&
					y1 >= y3
				)
					bottom = true;

				// If either the top or bottom are touching,
				if (
					top ||
					bottom
				)

					// If both are touching, Object 1 is inside Object 2.
					return (top && bottom ? "inside" : top ? "top" : "bottom");
			}
			return false;
		},

		// unmute all audio elements
		unmute: function()
		{
			for (player in this.audio)
			{
				if (typeof(this.audio[player].play) == "function")
					this.audio[player].play();
				else
					break;
			}
			this.muted = false;
		}
	};

$document.bind("keydown", GAMEngine.keyDown);
$document.bind("keyup", GAMEngine.keyUp);
$document.bind("ready", GAMEngine.ready);
GAMEngine.gravity();

var global = {
		message : false,
		optionsMenu: function(done)
		{
			return menu.create(
				"options",
				[
					{Border: makeFirst(settings.border, ["dashed", "dotted", "double", "groove", "inset", "outset", "ridge", "solid"])},
					{Color: makeFirst(settings.color, ["red", "orange", "yellow", "green", "blue", "purple", "gold", "silver", "black", "white", "gray"])},
					{Introduction: (settings.introduction ? ["On", "Off"] : ["Off", "On"])},
					{Skin: makeFirst(player.spriteSheet, ["Brendan", "Leaf", "May", "Red"])},
					{Sound: (settings.sound ? ["On", "Off"] : ["Off", "On"])},
					"Done"
				],
				function(item, value)
				{
					if (item == "Border")
					{
						$head.remove(".style-border");
						$head.append("<style class=\"style-border\" type=\"text/css\"><!--\n.border { border-style : " + value + "; }\n--><\/style>");
						cookies.set("border", value);
						settings.border = value;
					}
					else if (item == "Color")
					{
						$head.remove(".style-color");
						$head.append("<style class=\"style-color\" type=\"text/css\"><!--\n.border { border-color : " + value + "; }\n--><\/style>");
						cookies.set("color", value);
						settings.color = value;
					}
					else if (item == "Introduction")
					{
						if (value == "Off")
							cookies.set("introduction", "Off");
						else
							cookies.remove("introduction");
						settings.introduction = (value == "On" ? true : false)
					}
					else if (item == "Skin")
					{
						player.spriteSheet = value;
						if (typeof($player) != "undefined")
							$player.css("background-image", 'url("./images/maps/trainers/' + value.toLowerCase() + '.gif")');
					}
					else if (item == "Sound")
					{
						if (value == "Off")
						{
							if (typeof(audio.background.pause) == "function")
							{
								audio.background.pause();
								audio.foreground.pause();
							}
							cookies.set("sound", "Off");
						}
						else
							cookies.remove("sound");
						settings.sound = (value == "On" ? true : false)
					}
					else
					{
						menu.remove("options");

						// No map loaded (start menu).
						if (map.currentID == null)
							startMenu();
						else
							global.pauseMenu();
					}
				}
			);
		},
		pauseMenu: function()
		{
			menu.remove("pause");
			$wrapper.append(
				menu.create(
					"pause",
					[
						"Player",
						"Pok&eacute;dex",
						"Pok&eacute;mon",
						"Options",
						"Save",
						"Close"
					],
					function(item)
					{
						if (item == "Options")
						{
							menu.remove("pause");
							$wrapper.append(global.optionsMenu());
						}
						else if (
							item == "Close" ||
							item == "Esc"
						)
							menu.remove("pause");
					}
				)
			);
		},
		spriteOffset: {
			down: 0,
			left: -63,
			right: -21,
			up: -42
		},
		testLedge: function(move, ledge)
		{
			if (ledge <= 6)
				return ["down", "right", "up", "left"][ledge - 3] == move;
			if (ledge == 7)
				return move == "up" || move == "down";
			if (ledge == 8)
				return move == "left" || move == "right";
			return true;
		}
	};

var menu = {
		create: function(id, items, enter)
		{

			// Lock the player.
			if (typeof(player) == "object")
				player.locked = true;

			// Remove the menu if it already exists.
			if ($("#menu-" + id).is("div"))
				menu.remove(id);
			var list = "",
				first = true,
				horizontal = false;
			for (x = 0; x < items.length; x++)
			{
				list += '<li' + (first ? ' class="selected"' : '') + '>';
				if (typeof(items[x]) == "object")
				{
					horizontal = true;
					for (y in items[x])
					{
						first = true;
						list += '<strong>' + y + ':<\/strong><ul>';
						for (z = 0; z < items[x][y].length; z++)
						{
							list += '<li' + (first ? ' class="selected"' : '') + '>' + items[x][y][z] + '<\/li>';
							first = false;
						}
						list += '<\/ul><\/li>';
					}
				}
				else
					list += items[x];
				list += '<\/li>';
				first = false;
			}
			$document.bind("keydown",
				{
					horizontal: horizontal,
					id: id,
					enter: enter
				},
				menu.keydown
			);
			return '<div class="menu" id="menu-' + id + '">' +
					'<div class="border">' +
						'<ul>' + list + '<\/ul>' +
					'<\/div>' +
				'<\/div>';
		},
		keydown: function(e)
		{
			// Don't do anything unless there is no message displayed on screen.
			if (!global.message)
			{

				// Esc
				if  (inArray(e.keyCode, [16, 27, 81]))
				{
					menu.remove(e.data.id);
					e.data.enter("Esc");
				}

				else
				{

					$selected = $("#menu-" + e.data.id + " > .border > ul > .selected");

					// horizontal menus
					if (
						e.data.horizontal &&
						$selected.find(".selected").is(".selected")
					)
					{

						// enter keys become right keys
						if (
							$selected.find(".selected").is(".selected") &&
							inArray(e.keyCode, [13, 32, 65, 68, 69, 70, 83, 88, 90])
						)
							e.keyCode = 39;

						// direction keys
						// left and right affect inner list
						if (
							e.keyCode == 37 ||
							e.keyCode == 39
						)
						{
							menu[e.keyCode == 37 ? "previous" : "next"]($selected.find(".selected"));
							e.data.enter($selected.children("strong").text().match(/^(.*)\:$/)[1], $selected.find(".selected").text());
						}
						else if (e.keyCode == 38)
							menu.previous($selected);
						else if (e.keyCode == 40)
							menu.next($selected);
					}
					else
					{
						// left and up are synonymous
						if (
							e.keyCode == 37 ||
							e.keyCode == 38
						)
							menu.previous($selected);

						// right and down are synonymous
						else if (
							e.keyCode == 39 ||
							e.keyCode == 40
						)
							menu.next($selected);

						// enter keys send item information
						else if (inArray(e.keyCode, [13, 32, 65, 68, 69, 70, 83, 88, 90]))
							e.data.enter($selected.text());
					}
				}
			}
		},
		next: function($selected)
		{
			$selected.removeClass("selected");
			if ($selected.nextAll("li").first().is("li"))
				$selected.nextAll("li").first().addClass("selected");
			else
				$selected.parent().children("li:first-child").addClass("selected");
		},
		previous: function($selected)
		{
			$selected.removeClass("selected");
			if ($selected.prevAll("li").first().is("li"))
				$selected.prevAll("li").first().addClass("selected");
			else
				$selected.parent().children("li:last-child").addClass("selected");
		},
		remove: function(id)
		{
			$("#menu-" + id).remove();
			$document.unbind("keydown", menu.keydown);
			player.locked = false;
		}
	},
	message = {
		create: function(messages, finish)
		{

			// Don't do anything if the player is still walking.
			if (!player.midwalk)
			{

				// a message is displayed, lock player
				global.message = true;
				player.locked = true;

				// string -> array
				if (typeof(messages) == "string")
					messages = [messages];

				$wrapper.append(
					'<div class="message">' +
						'<div class="border">' +
							messages[0] +
						'<\/div>' +
					'<\/div>'
				);
				$("div.message").data({
					messages: messages,
					on: 1
				});

				// monitor key presses to remove messages
				$document.bind("keydown",
					{
						finish: (typeof(finish) == "function" ? finish : false)
					},
					message.remove
				);
			}
		},
		remove: function(e)
		{

			var $message = $("div.message");
			var data = $message.data();
			if (data.messages.length > data.on)
			{
				$message.children("div.border").html(data.messages[data.on]);
				$message.data("on", data.on + 1);
			}

			// if all the messages have been removed,
			// tell the program that no messages are displayed,
			// unbind the remove function,
			// and execute a final function if one exists
			else
			{
				$document.unbind("keydown", message.remove);
				$message.remove();
				global.message = false;
				player.locked = false;
				if (typeof(e.data.finish) == "function")
					e.data.finish();
			}
		}
	};