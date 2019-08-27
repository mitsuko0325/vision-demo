const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient()

const fileName = require('/crying.jpg');


client
.faceDetection(fileName)
  .then(results => {
    const faces = results[0].faceAnnotations;

    console.log(JSON.stringify(faces))

    console.log('Faces:');
    faces.forEach((face, i) => {
      console.log(`  Face #${i + 1}:`);
      console.log(`    Joy: ${face.joyLikelihood}`);
      console.log(`    Anger: ${face.angerLikelihood}`);
      console.log(`    Sorrow: ${face.sorrowLikelihood}`);
      console.log(`    Surprise: ${face.surpriseLikelihood}`);
    });
  })
  .catch(err => {
    console.error('ERROR:', err);
  });