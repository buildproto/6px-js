Javascript client for 6px
=========================

A completely Javascript framework agnostic SDK for the 6px API.  Includes essential methods to run requests over to 6px along with some convenience methods (dropzone, etc).
##Getting Started

Drop this inside of your `<head>` tags:

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/6px/0.0.11/6px.min.js"></script>
```
## Examples
If you want to simply upload an image to the 6px CDN:
```javascript
px.init({
	apiKey: '***API KEY***',
	userId: '*** USER ID ***',
});

var _px = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });

_px.output({ taxi: 'unsplashed_taxi' }).tag('raw').url('6px');

_px.save().then(function(res) {
  console.log('Got response!', res);
});
```

Given that vintage photos are kind of kind of popular right now, let's take this up a notch:
```javascript
var _px = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });

// Set up an output (or generated image) and apply sepia to it
_px.output({ taxi: 'unsplashed_taxi' })
	.filter({ sepia: 70 })
	.tag('vintage')
	.url('6px');

_px.save().then(function(res) {
    console.log('Job Finished:', res);
});

```
So, we have a bit of an extreme sepia effect going on here, but that's fine.  I think this deserves to be more of a thumbnail.  We are going to resize it now:
```javascript
var _px = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });

_px.output({ taxi: 'unsplashed_taxi' })
	.filter({ sepia: 70 })
	.tag('vintage_thumb')
	.url('6px')
	.resize({ width: 75 });

_px.save().then(function(res) {
	console.log('Job Finished:', res);
});
```
Another thing we can do is change the dominate color of an image:
```javascript
var _px = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });

_px.output({ taxi: 'unsplashed_taxi' })
	.tag('green')
	.url('6px')
  	.filter({ colorize: { hex: '#00FF00', strength: 80 } });


_px.save().then(function(res) {
	console.log('Job Finished:', res);
});
```
Let's blur the image at the same time.
```javascript
var _px = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });

_px.output({ taxi: 'unsplashed_taxi' })
	.tag('green_blur')
	.url('6px')
	.filter({
		colorize: { hex: '#00FF00', strength: 80 },
		stackBlur: 20
	});


_px.save().then(function(res) {
	console.log('Job Finished:', res);
});
```

In some cases, you'll want to make sure we have an open connection with 6px before you send the job to us.  We handle everything with RESTful communication, but the connection is required for seeing when the job is done.  It is a lot nicer to have an open connection with our API to find when the job is finished processing vs polling.

We have two ways of doing this:
```javascript
var init = px.init({
  apiKey: 'api key',
  userId: 'user id'
});

var _px = px({ img: imgElm });

_px.output({ img: false })
  .url('6px')
  .tag('img');

// promise style callback
init.then(function() {
  _px.save().then(function(res) {
    console.log('Job Finished:', res);
  });
});
```

You could also use a standard callback:
```javascript
px.init({
  apiKey: 'api key',
  userId: 'user id'
});


px.on('connection', function() {
  var _px = px({ img: imgElm });
	
  _px.output({ img: false })
    .url('6px')
    .tag('img');
	
  _px.save().then(function(res) {
    console.log('Job Finished:', res);
  });
});
```
<<<<<<< HEAD
Now that we have covered some of the simple use cases, feel free to refer to our documentation!
=======


Now that we have gone through some of the sample use cases, we will go over all of the capabilities of the JS SDK.

# Methods
## resize
Accepts an object, with `width` and `height` inside of it.  If either of those arguments are ommitted, we will resize based on the aspect ratio of the image.

```javascript
output.resize({ width: 125 });
```

## filter
Accepts two types of arguments.  `filter(key, val)` and `filter({ key: val })`.

Our list of filters right now are detailed here: [6px Api Docs for Filters](https://github.com/6px-io/6px-api-docs#filter)

```javascript
output.filter({ invert: true });
```

## rotate
Pass in an object with the key `degrees` and the value of how much you want to rotate it.

The image will rotate from its center point counter clockwise.

```javascript
output.rotate({ degrees: 90 });
```
>>>>>>> c7a17eaf7e3a514b45cf56f4280b6d215d1a1530

##[API Documentation](https://github.com/6px-io/6px-api-docs)

Keep us posted on the cool stuff you are doing by sending us an email at <ops@6px.io>. We are constantly trying to improve the user experience. If you come across any issues or have suggestions please create an [issue ticket.](https://github.com/6px-io/6px-js/issues)
