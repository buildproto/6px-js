Javascript client for 6px
=========================

A completely Javascript framework agnostic SDK for the 6px API.  Includes essential methods to run requests over to 6px along with some convenience methods (dropzone, etc).

## Getting Started

### Installation

Include the 6px Javascript client by pasting the following `<script>` tag immediately before the closing `</head>` tag. If you prefer to use another version (e.g. beta), please download the source file from [GitHub](https://github.com/6px-io/6px-js).

```term
<script src="//cdnjs.cloudflare.com/ajax/libs/6px/0.1.0/6px.min.js"></script>
```

### Initialization

Initialize with hard coded values:

```javascript
px.init({
	userId: 'YOUR_USER_ID',
	apiKey: 'YOUR_API_KEY'
});
```

### Examples

Upload an image to 6px:

```javascript
px.init({
	userId: 'YOUR_USER_ID',
	apiKey: 'YOUR_API_KEY'
});

var _px = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });

_px.output({ taxi: 'unsplashed_taxi' }).tag('raw').url('6px');

_px.save().then(function(res) {
	console.log('Response', res);
});
```

Apply a vintage look to an image and upload to 6px:

```javascript
px.init({
	userId: 'YOUR_USER_ID',
	apiKey: 'YOUR_API_KEY'
});

var _px = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });

_px.output({ taxi: 'unsplashed_taxi' })
	.filter({ sepia: 70 })
	.tag('vintage')
	.url('6px');

_px.save().then(function(res) {
	console.log('Response', res);
});
```

Apply a vintage look, generate a thumbnail, and upload to 6px:

```javascript
px.init({
	userId: 'YOUR_USER_ID',
	apiKey: 'YOUR_API_KEY'
});

var _px = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });

_px.output({ taxi: 'unsplashed_taxi' })
	.filter({ sepia: 70 })
	.tag('vintage_thumb')
	.url('6px')
	.resize({ width: 75 });

_px.save().then(function(res) {
	console.log('Response', res);
});
```

Change the dominate color of an image, and upload to 6px:

```javascript
px.init({
	userId: 'YOUR_USER_ID',
	apiKey: 'YOUR_API_KEY'
});

var _px = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });

_px.output({ taxi: 'unsplashed_taxi' })
	.tag('green')
	.url('6px')
	.filter({ colorize: { hex: '#00FF00', strength: 80 } });

_px.save().then(function(res) {
	console.log('Response', res);
});
```

Change the dominate color of an image, apply a blur effect, and upload to 6px:

```javascript
px.init({
	userId: 'YOUR_USER_ID',
	apiKey: 'YOUR_API_KEY'
});

var _px = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });

_px.output({ taxi: 'unsplashed_taxi' })
	.tag('green_blur')
	.url('6px')
	.filter({
		colorize: { hex: '#00FF00', strength: 80 },
		stackBlur: 20
	});


_px.save().then(function(res) {
	console.log('Response', res);
});
```

> **Tip**: In some cases, you'll want to make sure that you have an open connection with 6px before you send the job. We handle everything with RESTful communication, but a connection is required to see when the job is complete. Maintaining an open connection with 6px is faster and more convenient than polling.

Promise style callback:

```javascript
var init = px.init({
	userId: 'YOUR_USER_ID',
	apiKey: 'YOUR_API_KEY'
});

var _px = px({ img: document.getElementById('imgElm') });

_px.output({ img: false })
.url('6px')
.tag('img');

init.then(function() {
	_px.save().then(function(res) {
		console.log('Response', res);
	});
});
```

Standard callback:

```javascript
px.init({
	userId: 'YOUR_USER_ID',
	apiKey: 'YOUR_API_KEY'
});

px.on('connection', function() {

	var _px = px({ img: document.getElementById('imgElm') });

	_px.output({ img: false })
		.url('6px')
		.tag('img');

	_px.save().then(function(res) {
		console.log('Response', res);
	});

});
```

> **Note**: The examples above cover a couple of the many use cases. Please refer to the [official API documentation](https://github.com/6px-io/6px-api-docs) for a full list of possible methods.

Keep us posted on the cool stuff you are doing by sending an email to <support@6px.io>. If you come across any issues or have suggestions please [open an issue on GitHub](https://github.com/6px-io/6px-js/issues).
