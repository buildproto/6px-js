(function() {

	var version = '0.0.2';

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
	 * @param {object} size: Pass in width and/or height
	 */
	_6px.prototype.resize = function(size) {

		this.actions.push({ method: 'resize', options: size });

		return this;

	};

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

	_6px.prototype.rotate = function(options) {

		this.actions.push({ method: 'rotate', options: options });

		return this;
	};

	_6px.prototype.crop = function(position) {
		
		this.actions.push({ method: 'crop', options: position });

		return this;
	};

	_6px.prototype.tag = function(tag) {

		this.tag = tag;

		return this;

	};

	_6px.prototype.callback = function(url) {

		this.url = url;

		return this;

	};

	_6px.prototype.type = function(mime) {

		this.type = mime;

		return this;
	};

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
			user_id: px.userData.userId,
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

			px.sendToServer(
				'post',
				'/users/:userId/jobs/create',
				json,
				function(res) {
					px.log('Sent to server:', res);
				},
				function() {
					px.trigger('error', 'Error sending to server');
				});

		});

	};

	/**
	 * The main px object and convenience functions
	 */
	var px = function(input) {

		if (!px.userData) {
			throw '6px: You must call init!';
		}

		return new _6px(input);

	};

	/**
	 * Use this to set up your account with apiKey, etc
	 */
	px.init = function(data) {

		if (px.userData) {
			throw '6px: Init must only be called once!';
		}

		px.debug = (!!data.debug || false);

		if (!data.apiKey) {
			throw '6px: apiKey is required!';
		}

		if (!data.userId) {
			throw '6px: userId is required!';
		}

		px.userData = data;

		var success = function(res) {
			px.log('success:', res);
		};

		var failed = function(res) {
			px.log('failed:', res);
			px.trigger('error', '');
		};

		px.sendToServer('post', '/users/:userId/auth', null, success, failed);

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
