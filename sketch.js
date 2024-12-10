/* Creation & Computation - Multiscreen

Stories and Rules：
- （ a user pick a costume, scan the QR code to open this APP, grants the access("adopt me") and turn on the speaker, and install their phone )
- ( they need to stand at certain marked location and find/wait for another user to stand at the related location )
- users' goal is to reach certain points within given time (e.g. 5 mins)
- [optional] they shake their phone to send out a pitch
- another user's phone recognize the pitch and start a "conversation"
- when the conversation ends, update the points
- [optional; test before decided] humans, who don't have the costume for their phone, should try to be taken photo by mimic the pitch of the phone
- users will be awarded or punished based on the human's behavior ( a riskier choice )
- By the end, if no one can reach the goal in time, who has the highest pointing win.
- (rewards: some decorations)


Reference
DEVICE Gyroscope by remarkability https://editor.p5js.org/remarkability/sketches/1D90zhu4a
*/

//Pitch range
//Identifying range 1100, 1600, 2100
// conversation range 

// let selfTone = 2093;

let betweenConversation = 5000; 

//bye bye function, allow pet to say byebye at the end of converstaion, giving both human and pet a clear cue on when the conversation ended
let byebye = [1,2,3]
function sayBye()
{
  //get a random byebye( there's three in total)
  let temp = random(byebye)
  //play it
  temp.play()
}

function preload() {
   heart = loadImage('./assets/heart.gif');
   heartGoal = loadImage('./assets/heart-goal.gif');
   byebye[0] = loadSound('./assets/byebye1.mp3');
   byebye[1] = loadSound('./assets/byebye2.mp3');
   byebye[2] = loadSound('./assets/byebye3.mp3');
}
//setup function
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  angleMode(DEGREES)
  // default settings
  noStroke();
  noFill();
  gyroscopeSetup();
  
  listenSetup();
  
  conversationSetup()
  
  osc = new p5.Oscillator('sine');
  osc.freq(selfTone);
  
  CDToBeep = random(1000,5000)
  // patient = defaultPatient //ceil(random(1,5))
  // osc.start()


//   //camera setup
// let videoConstraints = { 
//   // this piece is from the referenced example, creating a constraint object for the video capture
//   video: {
//     mandatory: {
//       maxWidth: cameraWidth,
//       maxHeight: cameraHeight,
//     },
//   },
//   audio: false,
// };

// liveCamera = createCapture(videoConstraints); // create video capture based on the constraints
// liveCamera.position(10, 250); //position the camera (change these values when added to full project code)
// liveCamera.hide();

// // takePhotoButton = createButton("Take Selfie");
// // takePhotoButton.mousePressed(takeSelfie); // click to take the selfie
// takePhotoButton.position(5,5);

// takePhotoButton.style('border-radius', '40px');
// takePhotoButton.style("width", "60px");
// takePhotoButton.style("height", "60px");
// takePhotoButton.style("background-color", "white");
}
let CDToBeep
let permissionGrant = false;
let lastStableTime = 0;
let inStableCooldown = false;

let secondsUntilListen = 1000;

let matchingMode = false;
let matched = false;
let soundPlayed = false;

let timeEnteredMatchingMode = 0;



let lastUnstableTime = 0;
let stableTimeBeforeListen = 1000;
let selfIdentified = false;
let identifiedCounter = false;
let identifiedFrequency;
let identifiedTime = 0;


let pairingSuccess = false;

let matchedPet = []

let talkStartTime = 0;
let talkTime = 1000;

let surrounding ;



// conversation related
let conversationStartTime = 0;
let yourTurnToTalk = false;
let talkedInThisBlock = false;
let talkBlock = 2
let currentTalkBlock = 0;


let talkOffset = 0;
let convoDuration = 0;

let loopStartTime = 0;

//resetPet resets all variables so the pet can start a new conversation, and it will say byebye at the end
function resetPet()
{
  lastStableTime = 0;
  inStableCooldown = false;
  
  secondsUntilListen = 1000;
  
  matchingMode = false;
  matched = false;
  soundPlayed = false;
  
  timeEnteredMatchingMode = 0;
  
  
  
  lastUnstableTime = 0;
  stableTimeBeforeListen = 1000;
  selfIdentified = false;
  identifiedCounter = false;
  identifiedFrequency = [];
  identifiedTime = 0;
  
  //personality traits
  patient = defaultPatient;
  
  pairingSuccess = false;
  
  matchedPet = []
  
  talkStartTime = 0;
  talkTime = 1000;
  
  
  
  
  // conversation relatedconversationStartTime = 0;
  yourTurnToTalk = false;
  talkedInThisBlock = false;
  talkBlock = 2
  currentTalkBlock = 0;
  
  talkOffset = 0;
  convoDuration = 0;
  lastUnstableTime = millis()
  loopStartTime = millis()
  sayBye()
}

//the draw function is splitted into four sections, there will only be one section running at a time, controlled by two variables, isStable and pairedSuccess
//isStable == false, pairedSuccess == false
//  this means the pet is not stable(not on a stable surface) and is has not connected with any pets yet. it wound do much at this stage, just a few shakes and wait til everything is stable

//isStable == true, pairedSuccess == false
//  this means the pet is stable, on a stable surface and it is not connected with any pet or human
//  it will run the search function, trying to listen for an identifying pitch from the existing working pitches, if it waited for a long time without hearing anything, it will identify itself first, aka play its own pitch
//  the other pet will catch that pitch and reply with their own pitch

//isStable == true, pairedSuccess == true
//  this is when the pet is stable and a connection is made. 
//  the pet will start conversation in timeblocks(default 4 seconds) for a few round until one of the pet in conversation loses patient and calls the byebye function
//  when a pet loses patient, they will run reset() function so it resets some variables for next pairing attempt.

//isStable == false, pairedSuccess == true
//  this means the pet has a working connection but is taken away by someone in the middle of the conversation
//  the pet will be mad and do something accordingly. then the pet will do a reset()

function draw() {
  background(faceColour);
  updateGyroscopeData()
  checkTalkTime()
  updateConversation()
 

  if (isStable == false && pairingSuccess == false)
    //Not paired and not stable // for when moving, the conversation ended successfully
    {
      // takePhotoButton.hide();
      lastUnstableTime = millis();
      drawFace("shock");
      drawStatus();
    }
  if (isStable == true && pairingSuccess == false)
    //pairing sequence
    {
      drawFace("initial");
      drawStatus();
      // takePhotoButton.hide();
      // trying to listen for a identifying pitch
      if(identifiedCounter == false && millis() - lastUnstableTime > stableTimeBeforeListen + betweenConversation )
        {
          identifiedFrequency = listen()
          // if identifiedFrequency is not empty then there's a match!
          if(identifiedFrequency.length != 0)
            {
              for (let i = 0; i < identifiedFrequency.length; i++)
                {
                  matchedPet.push(identifiedFrequency[i])
                }
                identifiedCounter = true;
                identifiedTime = millis()
                
              }
            }
            // if is stable for 1 seconds + a random time between 1 - 3 seconds and still no match, the pet will make a sound first, expecting the other pet hears it and will reply
            //reason for a random time is to reduce the chance of two pet identifying themselves at the same time, which they won't listen during that time.
            if(millis() - lastUnstableTime > stableTimeBeforeListen + CDToBeep  + betweenConversation  && selfIdentified == false && identifiedCounter == false)
            {
              if(talkStartTime == 0)
                {
                  talk(1,talkTime)
            }
          talkStartTime = millis()
          
          selfIdentified = true;
          yourTurnToTalk = true;
        }

        else if(millis() - lastUnstableTime > identifiedTime + 1000 - loopStartTime && selfIdentified == false && identifiedCounter == true)
          {
            if(talkStartTime == 0)
              {
                talk(1,talkTime)
              }
          talkStartTime = millis()
          
          selfIdentified = true;
          yourTurnToTalk = false;
          
        }
        //if both variable is true it means the pet has identified itself, and it knows who it paired with, then it is a success pair. pairingSuccess = true
        if(selfIdentified == true && identifiedCounter == true)
          {
            pairingSuccess = true
            //NOW we run code for seudo talk
            conversationStartTime = millis()
            //this decides the order which pet talks first.
            if (yourTurnToTalk == true)
              {
                talkOffset = 0
                updatePoints();
              }
              else
              {
                updatePoints();
                talkOffset = talkBlock
              }
            }
          }
          //paired up and talk // For when talking in stationary position
          if (isStable == true && pairingSuccess == true)
  {    
      drawFace("talking");
      drawStatus();
      //updateing conversation related code
      convoDuration = floor((millis() - conversationStartTime) / 1000) + talkOffset
      //some math to determin if this is pet's turn to talk
      //time here is seperated into blocks
      //each block is splitted into half, the first to talk will use first half and seconds to talk will use second half
      //this guarentees both pet can say something and the other pet is listening.
      //and it makes the conversation sounds better.
      if(convoDuration % (talkBlock*2) == 0 && talkedInThisBlock == false)
        {
        //patient is how many more blocks the pet is willing to talk for, if it's 0 then the pet will say byebye, everypet has a different patient value
        if(patient <= 0)
          {
            //if no patient then we disconnect
            updatePoints();
          // talk(1,talkTime)
          talkStartTime = millis()
          talkedInThisBlock = true;
          resetPet()
          }
        else
          {
          convoTimeLeft += talkBlock*1000
          talkedInThisBlock = true;
          }
          
        }
      //if current block passed, reset talkedInThisBlock and -1 on patient as the block advanced 1.
      if(floor((convoDuration - talkOffset) / (talkBlock*2)) != currentTalkBlock)
        {
          currentTalkBlock = floor((convoDuration - talkOffset) / (talkBlock*2))
          talkedInThisBlock = false
          patient -= 1
        }
      
    }
  //when moved away in the middle of conversation, be MAD!!!!!
  if (isStable == false && pairingSuccess == true)
  {
      drawFace("shock");

      drawStatus();
      convoTimeLeft += 1000
      resetPet()
    }

}
