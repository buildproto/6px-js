(function() {

	var version = '0.0.2';

	/**
	 * Sends our data up to the 6px server
	 */
	var sendToServer = function(json, success, failed) {

		var user = px.userData;

		var url = (document.location.protocol == 'https' ? 'https://' : 'http://');
			url += 'api.6px.io/users/'+ user.userId + '/jobs?key='+ user.apiKey;

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState < 4)
				return;

			if (xhr.status !== 200)
				return failed.call();

			if (xhr.readyState === 4)
				success.call(null, JSON.parse(xhr.responseText));
		};

		xhr.open('POST', url, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(json));

	};

	/**
	 * Constructor
	 */
	var _6px = function(input) {

		this.image = input;
		this.tag = false;
		this.type = 'image/png';
		this.callback = false;
		this.actions = {};

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

		if (!this.actions.filter) {
			this.actions.filter = {};
		}

		// User took a shortcut and used an object to define them all at once
		if (typeof type == 'object') {
			this.actions.filter = type;
			return this;
		}

		this.actions.filter[type] = value;

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

		this.actions['layer'] = {
			image: 1,
			opacity: 10
		};

		var json = {
			callback: {
				url: this.callback || null
			},
			user_id: px.userData.userId,
			output: [{
				ref: [0],
				tag: this.tag || null,
				type: this.type,
				methods: [this.actions]
			}]
		};


		px.parseInput(this.image, function(data) {
			
			json.input = [];
			json.input.push(data);

			sendToServer(json,
				function(res) {
					console.log('Sent to server:', res);
				},
				function() {
					console.log('error');
				});

		});

	};

	var px = function(input) {

		if (!px.userData) {
			throw '6px: You must call init!';
		}

		return new _6px(input);

	};

	px.version = version;

	/**
	 * Use this to set up your account with apiKey, etc
	 */
	px.init = function(data) {

		if (!data.apiKey) {
			throw '6px: apiKey is required!';
		}

		if (!data.userId) {
			throw '6px: userId is required!';
		}

		px.userData = data;

	};

	/**
	 * Very simple dropzone creator to help with creating HTML5 file uploads.
	 *
	 * Allows an element on the page to be set up so you can drag a file from your computer
	 * and have it read the file inline.
	 */
	px.dropZone = function(input, options) {

		if (typeof input == 'string') {
			var elm = document.querySelector(selector);
		} else {
			var elm = input;
		}

		var wrapCallbacks = function(e, cb) {
			e.preventDefault();

			if (cb) cb();

			return false;
		};
 
	    var dragOver = function(e) {
	        return wrapCallbacks(e, options.onDragOver);
	    };
	    var dragEnd = function(e) {
	    	return wrapCallbacks(e, options.onDragOver);
	    };
	    var dropped = function(e) {
	    	return wrapCallbacks(e, options.onDrop);
	    };

	    elm.ondragover = dragOver;
	    elm.ondragend = onDragEnd;
	    elm.ondrop = onDrop;

	    /**
	     * Making use of the destroy feature:
	     *
	     * var dropZone = px.dropZone('#drop-area', { 
	     * 	onDrop: function() { 
	     *		console.log('yay!');
	     *		dropZone.destroy();
	     *	}});
		 */
	    return {
	    	destroy: function() {
	    		elm.ondragover = null;
	    		elm.ondragend = null;
	    		elm.ondrop = null;
	    	}
	    }
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

	window.px = px;
	
})();
