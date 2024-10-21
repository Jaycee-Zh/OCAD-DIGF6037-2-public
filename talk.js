//talk.js. similar to conversation, makes sound, but this sketch makes actual meaningful sound unlike conversation.js makes fake sound. 

let osc; // Oscillator
let startTalkTime = 0
let talkDuration = 0

//this will make pet talk for certain duration, and it will make the sound of it's own tone, which can be accessed through selfTone variable.
function talk(index, duration_l)
{
  let pets = []
  talkDuration = duration_l
  startTalkTime = millis()
  osc.start();  
  //stop listen
  listenClosed = true

}

//this runs every frame to check if the talk timer is smaller than 0, if so the talk time is done and the pet will stop talking.
function checkTalkTime()
{
  if( millis() - startTalkTime > talkDuration)
    {
      osc.stop();
      //start listen again
      listenClosed = false;
    }
}
