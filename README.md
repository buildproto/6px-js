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

_px.save(function(res) {
  console.log('Got response!', res);
});
```
Note: When that callback on the save object is fired, it is only the API's acknowledgment that it received the request.

If we want to check whenever the API is done processing the request, we listen for a 'done' event.
```javascript
px.on('job-update', function(e, id, status) {
	if (status == 'complete') {
		console.log('Our image is ready!');
	}
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

_px.save(function(res) {
    console.log('Processing');
});

div
```
So, we have a bit of an extreme sepia effect going on here, but that's fine.  I think this deserves to be more of a thumbnail.  We are going to resize it now:
```javascript
var _px = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });

_px.output({ taxi: 'unsplashed_taxi' })
	.filter({ sepia: 70 })
	.tag('vintage_thumb')
	.url('6px')
	.resize({ width: 75 });

_px.save(function(res) {
	console.log('Processing');
});
```
Another thing we can do is change the dominate color of an image:
```javascript
var _px = px({ taxi: 'https://s3.amazonaws.com/ooomf-com-files/mtNrf7oxS4uSxTzMBWfQ_DSC_0043.jpg' });

_px.output({ taxi: 'unsplashed_taxi' })
	.tag('green')
	.url('6px')
  	.filter({ colorize: { hex: '#00FF00', strength: 80 } });


_px.save(function() {
	console.log('Processing');
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


_px.save(function() {
	console.log('Processing');
});
```
Ok, great.  We have all of these jobs being sent to the 6px API.  Since we are working with a clientside library, we aren't able to post a response to your server.  Though, that's where WebSockets come in.
```javascript
px.on('job-update', function(e, id, status) {
  if (status == 'pending') {
    console.log('Job is pending');
  }

  if (status == 'processing') {
    console.log('Job is processing');
  }

  if (status == 'complete') {
    console.log('Job is complete!');
  }

});
```
Now that we have covered some of the simple use cases, feel free to refer to our documentation!

##[API Documentation](https://github.com/6px-io/6px-api-docs)

Keep us posted on the cool stuff you are doing by sending us an email at <ops@6px.io>. We are constantly trying to improve the user experience. If you come across any issues or have suggestions please create an [issue ticket.](https://github.com/6px-io/6px-js/issues)
