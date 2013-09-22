6px-js-sdk
==========

A completely Javascript framework agnostic SDK for the 6px API.  Includes essential methods to run requests over to 6px along with some convenience methods (dropzone, etc).

## Examples
If you want to simply upload an image to the 6px CDN:
```
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
```
px.on('done', function() {
  console.log('Our image is ready!');
});
```
Given that vintage photos are kind of kind of popular right now, let's take this up a notch:
```
px(imgElm)
  .filter('sepia', 100)
  .save(function(res) {
    console.log('Processing');
  });
```
So, we have a bit of an extreme sepia effect going on here, but that's fine.  I think this deserves to be more of a thumbnail.  We are going to resize it now:
```
px(imgElm)
  .filter('sepia', 100)
  .resize({ width: 75 })
  .save(function(res) {
    console.log('Processing');
  });
```
