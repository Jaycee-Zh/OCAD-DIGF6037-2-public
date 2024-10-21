//concersation.js manages the conversation function for pets, to make a pet start talking, simplely add value to convoTimeLeft in milliseconds. 

//variable declearations
let convoTimeLeft = 0;
let convooscPlaying = false;
let toneChangeTime = 80;
let toneChangeTimer = 0;
let maxPitch = 2000;
let minPitch = 1000;
let convoosc;

//setup function for conversation functions, should only run ONCE in setup()
function conversationSetup()
{
  convoosc = new p5.Oscillator('sine');
  convoosc.freq(1100); 
  // ConversationTimeVariation = random(0, ConversationTimeVariation)
}

//draw function for converstaion, run this in the main draw() function
//this function manages the pet's conversation pitch, talk time and when to stop.
function updateConversation()
{
  //check to start conversation
  if(convoTimeLeft > 0 && convooscPlaying == false)
    {
      convoosc.start()
      convooscPlaying = true
      toneChangeTime = ConversationMainSpeed + random(-ConversationSpeedVariation, ConversationSpeedVariation)
    }
    //check to update converstation time left
  else if (convoTimeLeft > 0 && convooscPlaying == true)
    {
      convoTimeLeft -= deltaTime
      toneChangeTimer += deltaTime
      if(toneChangeTimer >= toneChangeTime)
        {
          toneChangeTimer -= toneChangeTimer
          convoosc.freq(ConversationMainPitch + random(-ConversationPitchVariation, ConversationPitchVariation))
        }
    }
  //when conversation time is smaller than 0, means the pet should stop
  if(convoTimeLeft - ConversationTimeVariation <= 0)
    {
      convoosc.stop()
      convooscPlaying = false
    }

}
