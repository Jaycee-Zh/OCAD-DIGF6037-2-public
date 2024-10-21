// Reference:
// https://editor.p5js.org/EthanHermsey/sketches/yjqWDF5FA
// Used this example as a reference for how to save still images from a video and display them. This example was used more in an animation context so I changed it so rather than appearing as one-at-a-time image frames, it can display each still image onto the page as the photos are taken.

// let liveCamera; // video capture
// let selfieCapture = []; //array to hold images in
// let takePhotoButton; // button to take photos

// let cameraWidth = 320;
// let cameraHeight = 240;


function takeSelfie() {
  if (liveCamera.loadedmetadata) {
    // only shoot pics if the camera is ready (from referenced code)

    let img = liveCamera.get(0, 0, cameraWidth, cameraHeight); //get stills from the live camera feed
    selfieCapture.push(img); // push each captured frame into the array to be saved
  }
}

// function drawSelfies(){
//     // if there are images in the array, show them
//   if (selfieCapture.length > 0) {
//     for (let i = 0; i < selfieCapture.length; i++) {
//       //for loop to continue displaying images as they are saved to the array
//       image(selfieCapture[i], 90 + 120 * i, 5, 80, 60); // creating an image based on each added array object and moving the position further right every time so they don't overlap

//       if (selfieCapture.length >= 6) {
//         textSize(15);
//         text("You're out of photos!", 50, 200); // only screen room for 6 photos, so if more than let people know they have to stop
//       }
//     }
//   }
// }