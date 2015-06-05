var cv = require('opencv');
var counter = 0;
var camera;

try {
  camera = new cv.VideoCapture(0);


  setTimeout(takePicture, 500);
} catch (e) {
  console.log("Couldn't start camera:", e)
}

function takePicture() {
  camera.read(function (err, im) {
    if (err) throw err;
    console.log(im.size());
    if (im.size()[0] > 0 && im.size()[1] > 0) {
      im.detectObject("../data/haarcascade_frontalface_alt.xml", {}, function (err, faces) {
        if (err) throw err;

        if (faces.length > 0) {
          cv.readImage("./imgs/hideme.png", function (err, hideme) {
            if (err) throw err;

            for (var i = 0; i < faces.length; i++) {
              console.log('found a face');
              var face = faces[i];
              //var result = im.roi(face.x, face.y, face.width, face.height);
              //displayImage('image', im);
              //displayImage('mask', hideme);
              hideme.resize(face.width, face.height);
              var result = new cv.Matrix(hideme.width(), hideme.height());
              result.addWeighted(im.roi(face.x, face.y, face.width, face.height), 0.5, hideme, 1, 0.5);
              //var ims = hideme.size();
              //hideme.adjustROI(-face.y, (face.y + face.height) - ims[0], -face.x, (face.x + face.width) - ims[1]);
              //result.addWeighted(result, 1.0, resized, 1, 1.0);
              result.save('./imgs/hideme_' + counter + '.png');
              counter++;
              console.log('Image saved');
            }
          });
        }
      });
    }
  });

  if (counter < 10) {
    setTimeout(takePicture, 500);
  }
}

