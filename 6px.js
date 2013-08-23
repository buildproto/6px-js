(function() {

	var version = '0.0.1';

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

		var url = 'http://api.6px.io/users/'+ user.userId + '/jobs?key='+ user.apiKey;

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
	var SixPx = function(input) {
		this.image = input;
		this.actions = {};
	};

	/**
	 * Resize input
	 *
	 * @param {object} size: Pass in width and/or height
	 */
	SixPx.prototype.resize = function(size) {

		this.actions.resize = size;

		return this;
	};

	SixPx.prototype.filter = function(type, value) {

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

	SixPx.prototype.crop = function(position) {
		
		this.actions.crop = position;

		return this;
	};

	SixPx.prototype.save = function(options, fn) {
		
		var _this = this;

		if (typeof options == 'function') {
			var fn = options;
			var options = {};
		}

		var json = {
			callback: {
				url: options.callback || false
			},
			user_id: px.userData.userId,
			output: [{
				ref: [0],
				tag: options.tag || null,
				type: options.type || 'image/png',
				url: options.url || null,
				methods: [this.actions]
			}]
		};


		parseInput(this.image, function(data) {
			
			json.input = [];
			json.input.push(data);

			console.log(json);

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

		return new SixPx(input);
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

	window.px = px;
})();