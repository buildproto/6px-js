JS SDK for 6px
==========

A completely Javascript framework agnostic SDK for the 6px API.  Includes essential methods to run requests over to 6px along with some convenience methods (dropzone, etc).

## Examples
If you want to simply upload an image to the 6px CDN:
```javascript
px.init({
	apiKey: '***API KEY***',
	userId: '*** USER ID ***',
	debug: true
});

px(imgElm).save(function(res) {
  console.log('Got response!', res);
});
```
Note: When that callback on the save object is fired, it is only the API's acknowledgment that it received the request.

If we want to check whenever the API is done processing the request, we listen for a 'done' event.
```javascript
px.on('done', function() {
  console.log('Our image is ready!');
});
```
Given that vintage photos are kind of kind of popular right now, let's take this up a notch:
```javascript
px(imgElm)
  .filter('sepia', true)
  .save(function(res) {
    console.log('Processing');
  });
```
So, we have a bit of an extreme sepia effect going on here, but that's fine.  I think this deserves to be more of a thumbnail.  We are going to resize it now:
```javascript
px(imgElm)
  .filter('sepia', true)
  .resize({ width: 75 })
  .save(function(res) {
    console.log('Processing');
  });
```
Another thing we can do is change the dominate color of an image:
```javascript
px(imgElm)
  .colorize('#00FF00')
  .save(function() {
    console.log('Processing');
  });
```
Let's blur the image at the same time.
```javascript
px(imgElm)
  .colorize('#00FF00')
  .filter('gaussianBlur', 3)
  .save(function() {
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
Now that we have gone through some of the sample use cases, we will go over all of the capabalities of the JS SDK.

# Methods
## resize
Accepts an object, with `width` and `height` inside of it.  If either of those arguments are ommitted, we will resize based on the aspect ratio of the image.

```javascript
px.resize({ width: 125 });
```

## filter
Accepts two types of arguments.  `filter(key, val)` and `filter({ key: val })`.

Our list of filters right now are detailed here: [6px Api Docs for Filters](https://github.com/6px-io/6px-api-docs#filter)

```javascript
px.filter({ invert: true });
```

## rotate
Pass in an object with the key `degrees` and the value of how much you want to rotate it.

The image will rotate from its center point counter clockwise.

```javascript
px.rotate({ degrees: 90 });
```

## colorize
Recolors the entire image.  Pass in a hex value as the argument.

```javascript
px.colorize('#00ff00');
```

## crop
Pass in an object with the coordinates desired.  Looks for `x`, `y`, `width`, and `height`.  If you are looking to crop to a face in the picture, you can omit the coordinates and pass in `face` and set that to true.  Then you can add padding around the face by passing in the `padding` value and that is converted to a pixel value.

```javascript
px.crop({ x: 100, y: 100, width: 250, height: 90 });
```
or
```javascript
px.crop({ face: true, padding: 50 });
```
