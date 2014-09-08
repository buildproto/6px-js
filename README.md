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

px.on('connection', function() {

    var image = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });
    var output = image.output({ taxi: 'unsplashed_taxi' })
        .tag('vintage')
        .url('6px')
        .filter({ sepia: 70 });

    image.save().then(function(res) {
        console.log('Res', res);
    }, function(err) {
        console.log('Err', err);
    });

});
```

Apply a vintage look, generate a thumbnail, and upload to 6px:

```javascript
px.init({
	userId: 'YOUR_USER_ID',
	apiKey: 'YOUR_API_KEY'
});

px.on('connection', function() {

    var image = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });
    var output = image.output({ taxi: 'unsplashed_taxi' })
        .tag('vintage_thumb')
        .url('6px')
        .filter({ sepia: 70 })
        .resize({ width: 75 });

    image.save().then(function(res) {
        console.log('Res', res);
    }, function(err) {
        console.log('Err', err);
    });

});
```

Change the dominant color of an image and upload to 6px:

```javascript
px.init({
	userId: 'YOUR_USER_ID',
	apiKey: 'YOUR_API_KEY'
});

px.on('connection', function() {

    var image = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });
    var output = image.output({ taxi: 'unsplashed_taxi' })
        .tag('green')
        .url('6px')
        .filter({ colorize: { hex: '#00FF00', strength: 80 } });

    image.save().then(function(res) {
        console.log('Res', res);
    }, function(err) {
        console.log('Err', err);
    });

});
```

Change the dominant color of an image, apply a blur effect, and upload to 6px:

```javascript
px.init({
	userId: 'YOUR_USER_ID',
	apiKey: 'YOUR_API_KEY'
});

px.on('connection', function() {

    var image = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });
    var output = image.output({ taxi: 'unsplashed_taxi' })
        .tag('green')
        .url('6px')
        .filter({ colorize: { hex: '#00FF00', strength: 80 } });

    image.save().then(function(res) {
        console.log('Res', res);
    }, function(err) {
        console.log('Err', err);
    });

});
```

Get info (e.g. height, width, bytes, size, etc.) on an image:

```javascript
px.init({
	userId: 'YOUR_USER_ID',
	apiKey: 'YOUR_API_KEY'
});

px.on('connection', function() {

    var image = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });

    image.getInfo().then(function(res) {
        console.log('Res', res);
    }, function(err) {
        console.log('Err', err);
    });

});
```

Override previously specified output using its tag name:

```javascript
px.init({
	userId: 'YOUR_USER_ID',
	apiKey: 'YOUR_API_KEY'
});

px.on('connection', function() {

    var image = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });

    var output = image.output({ taxi: 'unsplashed_taxi' })
        .tag('thumb')
        .url('6px')
        .resize({
            height: 200,
            width: 200
        });

    // optionally override previously specified output
    image.getOutputByTagName('thumb').resize({ height: 400, width: 400 });

    image.save().then(function(res) {
        console.log('Res', res);
    }, function(err) {
        console.log('Err', err);
    });

});
```

Convenience function for uploading an image without specifying methods:

```javascript
px.init({
	userId: 'YOUR_USER_ID',
	apiKey: 'YOUR_API_KEY'
});

px.on('connection', function() {

    px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' })
        .upload().then(function(res) {
            console.log('Res', res);
        }, function(err) {
            console.log('Err', err);
        })
    ;

});
```

### Callback Options

Promise:

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

Standard:

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

[![Analytics](https://ga-beacon.appspot.com/UA-44211810-2/6px-js)](https://github.com/igrigorik/ga-beacon)
