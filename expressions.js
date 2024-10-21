/* This file is for different expressions, including:

- "initial"

- reactions to shake: 
    - "shock"
    - if(isFaint) faint for 5 seconds (a punishment for player); // stage2

- "conversation" mode: // stage2
    - "talking"
    - if (isStarted): open mouth, show random squares/dots
    - while(isStarted && frameCount<conversationLength) time goes, the squares/dots disappear one by one; in the meantime, the eyes move around
    - if (isEnd): when all the dots gone, close mouth

- reactions to touch // stage2

- reactions to human pitch: // stage2
    - tooLow: look down, face colour changes;
    - tooHigh: look up, face colour changes;
    - isCorrectPitch: eyes turn to camera and split a picture

- random expressions:
    - neutral // = initial
    - look around // stage2
    - shock // stage2
    - happy // stage2
*/


// the main function to draw the face
function drawFace(expression) {

  // draw eyes
  // left eye
  drawEye(leftEyeX, leftEyeY, eyeSize, 45, expression);
  // right eye - mirror with left eye
  push();
  translate(rightEyeX, rightEyeY);
  scale (-1,1);
  drawEye(0, 0, eyeSize, 45, expression);
  pop();

  // draw mouth
  drawMouth(expression);
};


// the function to draw eye
function drawEye(x, y, size, angle, expression) {
  push();
  translate(x, y);
  rotate(angle);
  switch (expression) {
    // initial: just blink
    case "initial":
      drawEyeShade(0, 0, eyeShadeColour, size, expression);
      drawEyeBall(0, 0, eyeColour, size, expression);
      break;
    // talking: the eye move randomly according to its character setting
    case "talking":
      if(eyeMoveTimer > 0){
        eyeMoveTimer --;
      }     
      if (eyeMoveTimer == 0){
        eyeMoveRange = round(random(0,10))-5;
        eyeMoveTimer = eyeMovePause;        
      }
      drawEyeShade(eyeMoveRange*0.5, 0, eyeShadeColour, size + eyeMoveRange*0.2, expression);
      drawEyeBall(eyeMoveRange*0.5, eyeMoveRange, eyeColour, size + eyeMoveRange, expression);
      break;
    // shock: the eye randomly swiftly
    case "shock":        
          eyeMoveRange = round(random(0,10))-5;        
        drawEyeShade(eyeMoveRange*0.5, 0, eyeShadeColour, size + eyeMoveRange*0.2, expression);
        drawEyeBall(eyeMoveRange*0.5, eyeMoveRange, eyeColour, size + eyeMoveRange, expression);
        break;
    // default: just blink
    default:
      drawEyeShade(0, 0, eyeShadeColour, size, expression);
      drawEyeBall(0, 0, eyeColour, size, expression);
  }
  pop()
}

// the function to draw shade (expression as a parameter is for later work)
function drawEyeShade(x, y, colour, eyeSize, expression) {
  push();
  fill(colour);
  translate(x, y);
  ellipse(0, eyeSize * 0.2, eyeSize * 1.1, eyeSize * 1.3);
  pop();
}

// the function to draw eyeball with blinking
function drawEyeBall(x, y, colour, size, expression) {

  push();
  translate(x, y);

  // eye bg
  fill(255);
  circle(0, 0, size);
  pop();

  push();
  translate(x, y);
// mask the eyeball and lids
  beginClip();
  fill(100);
  circle(0, 0, size);
  endClip();

  // eye ball  
  fill(colour);
  switch (expression) {
    case "talking":
      circle(0-0.5*eyeMoveRange, 0+0.5*eyeMoveRange, ballSize+2*eyeMoveRange);
      break;  
    default:
      circle(0, 0, ballSize);
      break;
  }


  //eye lids blinking

  // eye lid - top

  // counting down the pause
  if (blinkTimer > 0) {
    blinkTimer--;
  }

  // if count to 0, start to blink
  if (blinkTimer == 0) {

    // set the position
    eyeLidTopPosY += blinkSpeed * direction;
    eyeLidBottomPosY -= blinkSpeed * direction;

    // if closed, change the movement direction
    if (eyeLidTopPosY >= eyeLidTopClosePosY) {
      direction = -direction;
    }

    // draw the eye lids
    fill(faceColour);
    rect(-eyeLidWidth / 2, eyeLidTopPosY, eyeLidWidth, eyeLidHeight);
    fill(eyeShadeColour);
    rect(-eyeLidWidth / 2, eyeLidBottomPosY, eyeLidWidth, eyeLidHeight);

    // if the lids are back to open position, reset the lids, pause and direction 
    if (eyeLidTopPosY <= eyeLidTopOpenPosY) {
      blinkTimer = blinkPause;
      eyeLidTopPosY = eyeLidTopOpenPosY;
      eyeLidBottomPosY = eyeLidBottomOpenPosY;
      direction = -direction;
    }
  }
  pop();

  // eye lines
  push();
  translate(x, y);
  stroke(colour);
  strokeWeight(eyeLineWidth);
  circle(0, 0, size);
  pop();

}

// the function to draw mouth
function drawMouth(expression) {
  push();
  strokeWeight(mouthThickness);
  stroke(eyeColour);
  fill(faceColour.map(a => constrain(a - 50, 128, 255)));

  switch (expression) {
    // initial: not move
    case "initial":
      ellipse(windowWidth / 2, windowHeight * 0.75, mouthWidth - mouthHeight * 1, mouthInitialHeight);
      break;
    // talking: move randomly according to its character setting
    case "talking":
      if (mouthTimer > 0) {
        mouthTimer--;
      }
      if (mouthTimer == 0) {
        mouthHeight = round(random(10, 60));
        mouthTimer = constrain(mouthPause - round(random(1, 30)), 5, 60);
      }
      ellipse(windowWidth / 2, windowHeight * 0.75, mouthWidth - mouthHeight * 1, mouthHeight);
      break;
      // shock: move randomly swiftly
      case "shock":
      mouthHeight = round(random(0, 10));      
      ellipse(windowWidth / 2, windowHeight * 0.75, mouthWidth - mouthHeight * 1, mouthHeight);
      break;
      // default: = initial
      default:
        ellipse(windowWidth / 2, windowHeight * 0.75, mouthWidth - mouthHeight * 1, mouthInitialHeight);

  }
  pop()
}



/*
References:
- eye movement: https://editor.p5js.org/khamiltonuk/sketches/9LTXJPAoE
*/
