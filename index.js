var request = require('request');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true });
var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {

  // If a URL and callback parameters are present
  if(req.param("url") && req.param("callback")) {

    // Get the parameters
    var url = unescape(req.param("url")),
    callback = req.param("callback");

    // Couldn't have done this without the help of bxjx (http://stackoverflow.com/users/373903)
    request({ uri:url, encoding: null, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'} }, function (error, response, body) {
      // If the request was OK
      if (!error && response.statusCode == 200) {

        // Check if the mimetype says it is an image
        var mimetype = response.headers["content-type"];
        if(mimetype == "image/gif" || mimetype == "image/jpeg" ||
        mimetype == "image/jpg" || mimetype == "image/png" ||
        mimetype == "image/tiff") {

          // Create the prefix for the data URL
          var type_prefix = "data:" + mimetype + ";base64,",

          // Get the image from the response stream as a string and convert it to base64
          image_64 = body.toString('base64'),

          buffer = new Buffer(image_64, 'base64'),

          // Set width and height to 0
          width = 0,
          height = 0,

          // Get the image filename
          filename = "/tmp/" + url.substring(url.lastIndexOf('/')+1);

          // Save the file
          fs.writeFile(filename, buffer, function(err) {});

          // Get the image dimensions using GraphicsMagick
          imageMagick(filename).size(function(err, size){

            // Delete the tmp image
            fs.unlink(filename);

            // Error getting dimensions
            if(err) res.send("Error getting image dimensions", 400);
            else {

              width = size.width;
              height = size.height;

              // The data to be returned
              var return_variable = {
                "width": width,
                "height": height,
                "data": type_prefix + image_64
              };

              // Stringifiy the return variable and wrap it in the callback for JSONP compatibility
              return_variable = callback + "(" + JSON.stringify(return_variable) + ");";

              // Set the headers as OK and JS
              res.writeHead(200, {'Content-Type': 'application/javascript; charset=UTF-8'});

              // Return the data
              res.end(return_variable);

            }

          });

          // File type was not a supported image
        } else res.send("This file type is not supported", 400);

        // Error getting the image
      } else res.send("Third-party server error", response.statusCode);

    });

    // Missing parameters
  } else res.send("No URL or no callback was specified. These are required", 400);
});

// Handle 404 and 500 errors
app.get('/404', function(req, res){
	throw new Error('Page not found');
});
app.get('/500', function(req, res){
	throw new Error('Server error');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
