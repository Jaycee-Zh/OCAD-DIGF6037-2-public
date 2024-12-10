// const videoSize = [1600,900];
const videoSize = [1520,840];
const resolution = 40;

function setup() {
  createCanvas(videoSize[0], videoSize[1]);
  video= createCapture(VIDEO);
  // video= createCapture(VIDEO, { flipped: true });
  video.size(videoSize[0], videoSize[1]);
  video.hide();

  function mousePressed(){ //!debug
    if(mouseX>0&& mouseX<videoSize[0] && mouseY>0 && mouseY<videoSize[1]){
      let fs=fullscreen();
      fullscreen(!fs);
    }

  }
  
  // random number
  humanId = random(0,16581375).toString(16).toUpperCase();  
  console.log(humanId);
}

function draw() {
  background(255);
  colorMode(RGB,255);
  noStroke();

    // Draw the webcam video
    image(video, 0, 0, videoSize[0], videoSize[1]);

    for (i=0;i*resolution < videoSize[1]; i++){ // y
      for (j=0; j*resolution< videoSize[0]; j++){ //x
        let colour = get(j*resolution, i*resolution);
        // console.log(colour);
        fill(colour);
        square(j*resolution,i*resolution,resolution);
      }
    }

    push();
    rotate(HALF_PI);
    textFont('Courier New', resolution);
    textAlign(CENTER);
    fill(0);
    stroke(255);
    strokeWeight(4);
    // text("Human "+humanId, videoSize[0]/2-resolution*10, videoSize[1] - resolution*4 )
    text("Human "+humanId, videoSize[1]/2, -videoSize[0]+resolution*4 )
    pop();
}
