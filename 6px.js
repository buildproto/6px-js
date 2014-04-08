(function() {

	var version = '0.0.8';

	/**
	 * Adds some support to IE8
	 */
	if (!Event.prototype.preventDefault) {
		Event.prototype.preventDefault = function() {
			this.returnValue=false;
		};
	}

	/**
	 * Constructor
	 */
	var _6px = function(input) {

		// Setting some default values
		this.reset();
		this.image = input;

	};

	/**
	 * Reset the request
	_6px.prototype.reset = function() {
		// Setting some default values
		this.image = null;
		this.tag = false;
		this.type = 'image/png';
		this.callback = false;
		this.actions = [];
		this.filters = {};
		this.hasFilters = false;
	};

	/**
	 * Resize input
	 *
	 * @method resize
	 * @param {object} size Pass in width and/or height
	 * @chainable
	 */
	_6px.prototype.resize = function(size) {

		this.actions.push({ method: 'resize', options: size });

		return this;

	};

	/**
	 * Add a filter to our image.
	 *
	 * @method filter
	 * @param {String} type The filter name to apply.
	 * @param {Mixed} value The value of the filter
	 * @chainable
	 */
	_6px.prototype.filter = function(type, value) {

		// User took a shortcut and used an object to define them all at once
		if (typeof type == 'object') {
			this.filters = type;
		} else {
			this.filters[type] = value;
		}

		this.hasFilters = true;

		return this;

	};

	/**
	 * Rotate our image a specific degree amount.
	 *
	 * @method rotate
	 * @param {Object} options Pass in the degrees for the image.  Can also pass in the color for the background.  Defaults to 'transparent'.
	 * @chainable
	 */
	_6px.prototype.rotate = function(options) {

		this.actions.push({ method: 'rotate', options: options });

		return this;
	};

	/**
	 * Recolor the image to the desired hex
	 *
	 * @method colorize
	 * @chainable
	 * @param {String} hex The desired hex color code
	 */
	_6px.prototype.colorize = function(hex) {

		this.actions.push({ method: 'colorize', options: { hex: hex } });

		return this;
	};

	/**
	 * Crop the image to a specific box.
	 *
	 * Options: x, y, width, height
	 *
	 * @method crop
	 * @params {Object} position The box that you want to crop to
	 * @chainable
	 */
	_6px.prototype.crop = function(position) {

		this.actions.push({ method: 'crop', options: position });

		return this;
	};

	/**
	 * Set the tag name for the image.  Used for file name and basic identification
	 *
	 * @method tag
	 * @chainable
	 * @param {String} tag The name you want to tag the output with
	 */
	_6px.prototype.tag = function(tag) {

		this.tag = tag;

		return this;

	};

	/**
	 * Set a callback URL for the API to send a POST request to when finished.
	 *
	 * @method callback
	 * @param {String} url The URL to post to
	 * @chainable
	 */
	_6px.prototype.callback = function(url) {

		this.url = url;

		return this;

	};

	/**
	 * The desired mime type for the image.
	 *
	 * @method type
	 * @param {String} mime The mime type of the file format you want the image to become.  For example: "image/png".
	 * @chainable
	 */
	_6px.prototype.type = function(mime) {

		this.type = mime;

		return this;
	};

	/**
	 * Send the request up to the server for processing.
	 *
	 * Options:
	 * - dryRun: Does not post the request to the server.
	 *
	 * @method save
	 * @param {Object} [options] Some saving options.  Described above.
	 * @param {Function} [fn] Callback function.  Ran whenever we hear back from the API that the request was sent.  Does not mean the job has finished.
	 * @chainable
	 */
	_6px.prototype.save = function(options, fn) {

		var _this = this;

		if (typeof options == 'function') {
			var fn = options;
			var options = {};
		}

		// Combine all of the filters set into one action (if they exist)
		if (this.hasFilters) {
			this.actions.push({ method: 'filter', options: this.filters });
		}

		var json = {
			callback: {
				url: this.callback || null
			},
			output: [{
				ref: [ 'main' ],
				tag: this.tag || null,
				type: this.type,
				methods: this.actions
			}]
		};


		px.parseInput(this.image, function(data) {

			json.input = {};
			json.input['main'] = data;

			if (options.dryRun) {
                if (px.debug) {
                    fn({ json: JSON.stringify(json, undefined, 2) });
                }
                return;
            }

			px.sendToServer(
				'post',
				'/users/:userId/jobs',
				json,
				function(res) {
					// px.log('Sent to server);
				},
				function() {
					px.trigger('error', 'Error sending to server');
				});

		});

	};

	/**
	 * The main px object and convenience functions.
	 *
	 * Will throw an exception if px.init has not been called.
	 */
	var px = function(input) {

		if (!px.userData) {
			throw '6px: You must call init!';
		}

		return new _6px(input);

	};

	/**
	 * Use this to set up your account with apiKey, etc
	 *
	 * Must be called before any other functions.
	 */
	px.init = function(data) {

		if (px.userData) {
			throw '6px: Init must only be called once!';
		}

		px.debug = (!!data.debug || false);
        px.dryRun = (!!data.dryRun || false);

		if (!data.apiKey) {
			throw '6px: apiKey is required!';
		}

		if (!data.userId) {
			throw '6px: userId is required!';
		}

		px.userData = data;

		var success = function(res) {
			px.openSocket();
			px.log(res);
		};

		var failed = function(res) {
			px.log('failed:', res);
			px.trigger('error', '');
		};

		px.sendToServer('post', '/users/:userId/auth', null, success, failed);

	};

	px.openSocket = function() {

		var host = window.location.origin.indexOf('localhost') >= 0
			? 'ws://localhost:3000'
			: 'wss://api.6px.io';

		var socket = new WebSocket(host);

		socket.onopen = function(e) {
			// Send up a simple auth command, which will register our session
			px.sendSocketMsg(socket, { auth: { user_id: px.userData.userId } });
		};

		// ping server to keep socket connection open (closes after 55s)
		setInterval(function() {
			socket.send(JSON.stringify({ ping: true }));
		}, 30000);

		socket.onclose = function(e) {
			setTimeout(function() {
				px.openSocket();
			}, 1000);
		};

		socket.onmessage = px.handleIncoming;

	};

	px.sendSocketMsg = function(socket, obj) {
		socket.send(JSON.stringify(obj));
	};

	px.handleIncoming = function(msg) {
		var data = JSON.parse(msg.data);

		if (data.auth && data.auth === true) {
			console.log('Auth successful');
		}

		if (data.job_id && data.status) {
			px.trigger('job-update', data.job_id, data.status);
		}
	};

	/**
	 * Built in events
	 */
	px.on = function(name, fn) {
		window.addEventListener(name, function(e) {
			var args = [e];
			if (e.detail) {
				for (var i in e.detail) {
					args.push(e.detail[i]);
				}
			}
			fn.apply(null, args);
		}, false);
	};

	px.trigger = function(name) {
		var options = Array.prototype.slice.call(arguments, 1);
		if (name == 'error') {
			px.log(options[0], true);
		}
		window.dispatchEvent(new CustomEvent(name, { detail: options }));
	};

	/**
	 * Very simple dropzone creator to help with creating HTML5 file uploads.
	 *
	 * Allows an element on the page to be set up so you can drag a file from your computer
	 * and have it read the file inline.
	 *
	 * @example
	 * 	px.dropZone('#dropzone', { onDrop: function(e) {
	 *		console.log(e.dataTransfer.files);
     *     } });
	 */
	px.dropZone = function(input, options) {

		if (typeof input == 'string') {
			var elm = document.querySelector(input);
		} else {
			var elm = input;
		}

		if (!elm) {

			px.trigger('error', 'Element is not defined');
			return false;
		}

		var wrapCallbacks = function(e, cb) {
			e.preventDefault();

			if (cb) cb(e);

			return false;
		};

		var dragOver = function(e) {
			return wrapCallbacks(e, options.onDragOver);
		};
		var dragEnd = function(e) {
			return wrapCallbacks(e, options.onDragEnd);
		};
		var dropped = function(e) {
			return wrapCallbacks(e, options.onDrop);
		};

		elm.ondragover = dragOver;
		elm.ondragend = function() { dragEnd; }
		elm.ondrop = dropped;

	};

	/**
	 * Reads in an input of multiple types for parsing as a DataURI
	 *
	 * If using with dropzone, you should utilize e.dataTransfer
	 * @param {Mixed} input Can be a query string of the element, or the element itself.
	 * @param {Function} fn Runs when the input has been parsed.
	 * @example
	 * 	px.dropZone('#dropzone', {
	 *         onDrop: function(e) {
	 *		      px.parseInput(e.dataTransfer, function(uri) {
	 *			     console.log('data uri:', uri);
	 *			  }
	 *		   }
	 *	   });
	 */
	px.parseInput = function(input, fn) {

		if (typeof input == 'string') {
			fn.call(null, input);
			return;
		}

		if (input instanceof Image) {

			fn.call(null, input.src);

			return;
		}

		if (input.nodeType === 1) {

			if (input.tagName.toLowerCase() == 'img') {
				fn.call(null, input.src);
				return;
			}
		}

		// All else failed... must be a FileAPI upload

		if (window.FormData === undefined) {
			throw '6px: FileAPI not supported with your browser.';
		}

		var f = input.files[0];

		var dataUrlReader = new FileReader;
		dataUrlReader.onloadend = function() {

			fn.call(null, this.result);

		};

		dataUrlReader.readAsDataURL(f);
	};

	/**
	 * Sends our data up to the 6px server
	 *
	 * Basically a wrapper that sends an XHR request to the 6px API server
	 */
	px.sendToServer = function(method, path, json, success, failed) {

		var user = px.userData;

		path = path.replace(":userId", user.userId); // make life easier, eh?

		var url = (document.location.protocol == 'https' ? 'https://' : 'http://');
			url += 'api.6px.io/v1'+ path,
			url += (/\?/.test(url) ? '&' : '?') + 'key='+ user.apiKey;

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState < 4)
				return;

			if (xhr.status !== 200)
				return failed.call(JSON.parse(xhr.responseText));

			if (xhr.readyState === 4)
				success.call(null, JSON.parse(xhr.responseText));
		};

		xhr.open(method.toUpperCase(), url, true);
		if (json) {
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send(JSON.stringify(json));
		} else {
			xhr.send();
		}

	};

	/**
	 * Wrapper for a console log.  Only shows if console.log is available and debug is enabled.
	 */
	px.log = function(msg, err) {
		if (px.debug && console && console.log) {
			if (err) {
				console.error('6px:', msg);
			} else {
				console.log('6px:', msg);
			}
		}
	};

	px.version = version;
	window.px = px;

})();
