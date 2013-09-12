(function() {

	var version = '0.0.2';

	var parseInput = function(input, fn) {

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

			if (window.FormData === undefined) {
				throw '6px: FileAPI not supported with your browser.';
			}

			var f = input.files[0];

			var dataUrlReader = new FileReader;
			dataUrlReader.onloadend = function() {
				fn.call(null, this.result);
			};

			dataUrlReader.readAsDataURL(f);

		}
	};

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

		this.actions.resize = size;

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

	_6px.prototype.priority = function(value) {

		this.priority = value;

		return this;

	};

	_6px.prototype.rotate = function(options) {

		this.actions.rotate = options;

		return this;
	};

	_6px.prototype.crop = function(position) {
		
		this.actions.crop = position;

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

		var json = {
			callback: {
				url: this.callback || null
			},
			priority: (this.priority || 0),
			user_id: px.userData.userId,
			output: [{
				ref: [0],
				tag: this.tag || null,
				type: this.type,
				methods: [this.actions]
			}]
		};

		parseInput(this.image, function(data) {
			
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

	px.priorities = {
		high: 1,
		normal: 0
	};

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

	window.px = px;
	
})();