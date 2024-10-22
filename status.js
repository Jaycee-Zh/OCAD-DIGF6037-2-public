/* draw the progress bar based on status

*/


function drawStatus() {

    // settings
    push();
    stroke(210);
    strokeWeight(4);
    let statusY = windowWidth * 0.05, heartSize = 60;
    let heartX = constrain(leftEyeX + (rightEyeX - leftEyeX) / goal * points - heartSize / 2, leftEyeX - heartSize / 2, rightEyeX - heartSize / 2), heartY = statusY - heartSize / 2;

    // draw the bar
    line(leftEyeX, statusY, rightEyeX, statusY);

    // draw the text
    noStroke();
    textSize(18);
    fill(50);
    switch (petStatus) {
        case "win":
            heart.setFrame(9);
            image(heart, heartX, heartY, heartSize, heartSize);
            text("I am sooo HAPPY!", windowWidth / 2, 60);
            break;
        case "sad":
            heart.setFrame(0);
            image(heart, heartX, heartY, heartSize, heartSize);
            text("Oh, it's nothing...but my broken heart.", leftEyeX + heartSize / 2, 60);
            break;
        case "counting":
            heart.setFrame(constrain(1 + Math.floor(points / 60 * 8), 1, 8));
            image(heart, heartX, heartY, heartSize, heartSize);
            fill(255);
            textSize(14);
            text(points, heartX + heartSize / 2 - 4, heartY + heartSize / 2 + 7);       
        default:
            heart.setFrame(constrain(1 + Math.floor(points / 60 * 8), 1, 8));
            image(heart, heartX, heartY, heartSize, heartSize);
    }
    pop();
}
