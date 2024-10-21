
// This sketch contains functions and variables related to gyroscope utilization of the phone. It includes a button for motion sensing approval.

// Reference: "DEVICE gyroscope" by remarkability, https://editor.p5js.org/remarkability/sketches/1D90zhu4a
//// This reference was used to structure the gyroscope functionality and to base the permission pop-up off of.
//// Specifically, the requestAccess() functionality was referenced.

//Variable declearation
let permissionGranted = false; //start at false, will move to true if permission granted
let prevRotX;
let prevRotY;
let prevRotZ;
let rotDX;
let rotDY;
let rotDZ;
let totalRot;
let isStable = false;

function gyroscopeSetup() {
  if (typeof (DeviceOrientationEvent) !== 'undefined' && typeof (DeviceOrientationEvent.requestPermission) === 'function') {
    // ios 13 device

    // show permission dialog only the first time
    DeviceOrientationEvent.requestPermission()
      .catch(() => {

        // create permission button
        // for simplification with debugging, styling the button so it appears as a modal but is really just a fancy button
        let permissionButton = createButton(`Hi! My name is <b>${petName}.</b> <br/><br/>  I love being social and going on walks! <br/> I want to make friends but I need help moving around.<br/> Can you help me? <br/><br/><br/>  <i> Tap the screen to begin! </i>`);
        permissionButton.style("font-size", "18px");
        permissionButton.style('font-family', "'dunbar-text', sans-serif");
        permissionButton.style("opacity", "65%");
        permissionButton.style("border", "none");
        permissionButton.style("background-color", "white");
        permissionButton.position(0, 0);
        permissionButton.size(windowWidth, windowHeight); //fill the screen
        permissionButton.mousePressed(requestAccess); // when the user taps the screen, requesting sensor access

        throw error;
      })
      .then(() => {
        // on any subsequent visits
        permissionGranted = true;

      })
  } else {
    // non ios 13 device
    //automatically give permission, devices don't require the approval like IOS does
    permissionGranted = true;

    //re-creating the modal popup but only so they are prompted with the same information and will turn on fullscreen
    let permissionButton = createButton(`Hi! My name is <b>${petName}.</b> <br/><br/>  I love being social and going on walks! <br/> I want to make friends but I need help moving around.<br/> Can you help me? <br/><br/><br/>  <i> Tap the screen to begin! </i>`);
    permissionButton.style("font-size", "18px");
    permissionButton.style('font-family', "'dunbar-text', sans-serif");
    permissionButton.style("opacity", "65%");
    permissionButton.style("border", "none");
    permissionButton.style("background-color", "white");
    permissionButton.position(0, 0);
    permissionButton.size(windowWidth, windowHeight);
    permissionButton.mousePressed(makeFullscreen); //if pressed, make fullscreen
  }
}


function requestAccess() {
  DeviceOrientationEvent.requestPermission()
    .then(response => {
      if (response == 'granted') {
        permissionGranted = true;

      } else {
        permissionGranted = false;
      }
    })
    .catch(console.error);

  //remove the modal/pop-up button
  this.remove();

  //make fullscreen on tap
  fullscreen();
}

//using rotation variables with stored data to determine if the phone is stable or not, which is used for the conversation state in other functions
function updateGyroscopeData() {
  totalRot = abs((rotationY - prevRotY) * 100) +
    abs((rotationX - prevRotX) * 100) +
    abs((rotationZ - prevRotZ) * 100)

  prevRotY = rotationY
  prevRotX = rotationX
  prevRotZ = rotationZ

  if (totalRot >= 8) {
    isStable = false
  }
  else {
    isStable = true
  }
}

// make the non-IOS device fullscreen and get rid of the button
function makeFullscreen() {
  fullscreen();
  this.remove();
}
