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
let byebye = []
function preload() {
   heart = loadImage('./assets/heart.gif');
   heartGoal = loadImage('./assets/heart-goal.gif');
   byebye[0] = loadSound('assets/byebye1.mp3');
   byebye[1] = loadSound('./assets/byebye2.mp3');
   byebye[2] = loadSound('./assets/byebye3.mp3');
}


function sayBye()
{
  let temp = random(byebye)
  temp.play()
}

function setup() {
  createCanvas(windowWidth, windowHeight);
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
  sayBye()
  lastUnstableTime = millis()
  loopStartTime = millis()
}

function draw() {
  background(faceColour);
  updateGyroscopeData()
  checkTalkTime()
  updateConversation()
  // fill(0)
  // stroke(8)

  
  // text("Stable:" + str(isStable), 0, 50)
  // text("Paired:" + str(pairingSuccess), 0, 100)
  // text("TalkStartTime：" + str(talkStartTime), 0, 150)
  // text("Identified Countr：" + str(identifiedCounter), 0, 200)
  // text("Identified self: " + str(selfIdentified), 0, 250)
  // text("Counter Frequency：" + str(matchedPet), 0, 300)
  // text("Patient:" + str(patient), 0, 350)
  // text(str(talkOffset), 0, 400)
  // text("Total Rot:" + str(totalRot), 0, 450)
  // for test
  // isStable = false; pairingSuccess = false;

  // console.log(isStable+" "+pairingSuccess+" "+convoTimeLeft+" "+patient)

  if (isStable == false && pairingSuccess == false)
    //Not paired and not stable // for when moving, the conversation ended successfully
    {
      lastUnstableTime = millis();
      drawFace("shock");
      drawStatus();
      console.log("hi")
    }
  if (isStable == true && pairingSuccess == false)
    //pairing sequence
    {
      drawFace("initial");
      drawStatus();
      if(identifiedCounter == false && millis() - lastUnstableTime > stableTimeBeforeListen + betweenConversation )
        {
          identifiedFrequency = listen()
          if(identifiedFrequency.length != 0)
            {
              for (let i = 0; i < identifiedFrequency.length; i++)
                {
                  matchedPet.push(identifiedFrequency[i])
                }
                identifiedCounter = true;
                identifiedTime = millis()
                //BUG, HERE
                
              }
            }
            
            if(millis() - lastUnstableTime > stableTimeBeforeListen + CDToBeep  + betweenConversation  && selfIdentified == false && identifiedCounter == false)
              // if is stable for 1 seconds + a random time between 1 - 3 seconds
            {
              if(talkStartTime == 0)
                {
                  talk(1,talkTime)
            }
          talkStartTime = millis()
          
          selfIdentified = true;
          yourTurnToTalk = true;
        }
        //BUG in 188 if statement, itendified time is an abusolute value but millis() - lastUnstableTime is a relative value
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
        if(selfIdentified == true && identifiedCounter == true)
          {
            pairingSuccess = true
            //NOW we run code for seudo talk
            conversationStartTime = millis()
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
          
          if (isStable == true && pairingSuccess == true)
    //paired up and talk // For when talking in stationary position
  
  {    
      drawFace("talking");
      drawStatus();
      //updateing conversation related code
      convoDuration = floor((millis() - conversationStartTime) / 1000) + talkOffset
      if(convoDuration % (talkBlock*2) == 0 && talkedInThisBlock == false)
        {
          
        if(patient <= 0)
          {
            //if no patient then we disconnect
            updatePoints();
          talk(1,talkTime)
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
      if(floor((convoDuration - talkOffset) / (talkBlock*2)) != currentTalkBlock)
        {
          currentTalkBlock = floor((convoDuration - talkOffset) / (talkBlock*2))
          talkedInThisBlock = false
          patient -= 1
        }
      
    }
  if (isStable == false && pairingSuccess == true)
    //when moved away in the middle of conversation, be MAD!!!!!
  {
      drawFace("shock");

      drawStatus();
      convoTimeLeft += 1000
      resetPet()
    }
}
