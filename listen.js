//listen.js manages pet's listening functions, it listens for an envirnmental sound, keep about three seconds of the envirnmental sound in an array as reference point
//  so it can better identify new, emerging sound such as other pet or human talking. 

//the following are three working pitches, pet will only be listening for those three pitches,
//   NOTE_CS6: 1109,
//   NOTE_FS6: 1480,
//   NOTE_C7: 2093,

//reference
/*
	pitch detector in p5.js
	Listens to the microphone, displays the loudest pitch
	waveform drawing routine comes from the p5.FFT example.
	created 15 Nov 2018
	by Tom Igoe
*/



//Settings
//how many sample to keep in the envirnmental sound, more sample means more stability but also decreases the sensitivity
let sampleSize = 300;
//any pitch with a volumen past this number will be considered a success identification, lower it for more sensitivity but potentially more error
let threshold = 50;
//legacy variable, too much trouble to remove, basically points to which pitch to listen for.
let keyFreq = [0,1,2]


//mic and analyzer
let mic; 
let fft;
let spectrum

//array of past envirnmental sound values
let envirnmentalAvg = []
//act as a gate, when talking the pet won't listen
let listenClosed = false;
//pitches to listen for
let pitches = [1109, 1480, 2093];

//this function records the current value of surrounding sound values
//it should be in draw() running all time, 
function takeEnv(ftt_p)
{
   spectrum = fft.analyze();
  for(let i = 0; i < pitches.length; i++)
    {
      envirnmentalAvg[i].push(ftt_p.getEnergy(pitches[i]))
      //check if envirnmentalAvg array's length is longer than sampleSize, if so, populate the array. Removes oldest value and push new value to the end of array
      if (envirnmentalAvg[i].length >= sampleSize)
        {
          envirnmentalAvg[i].shift()
        }
      
    }
  
}

//Util function, gets the average of an array. used to get an average sound level here
function getArrayAvg(targetArray) 
{
  let sum = 0;
  for (let i = 0; i < targetArray.length; i++) {
    sum += targetArray[i];
  }
  return sum / targetArray.length;
}

//setup function for listen.js, only run this ONCE in setup()
function listenSetup()
{
  
  
  mic = new p5.AudioIn()
  fft = new p5.FFT();
  mic.start();
  fft.setInput(mic);
  
  //initialize Env Array
  for(let i = 0; i < pitches.length; i++)
    {
      envirnmentalAvg[i] = []
    }
}

//listen part this should run in draw() all the time, and talk functions will control when the listening happens with the listenClosed boolean variable.
function listen()
{
  //listenClosed is controlled by talk function, so if listenClosed is true then the pet is talking.
  if(listenClosed == true)
    {
      return []
    }
  //listen for envirnmental and record
  takeEnv(fft)
  let temp = []
  let tempValue = []
  let highest = 0;
  let highestTemp = 0;
  let result = []
  //cycle through every working pitch, we have 3 at the moment, each take a value and compare that against threshold value(default 50) if the sound value is higher than threshold, it is considered a success match
  for( let i = 0; i < keyFreq.length; i++)
    {
      if(fft.getEnergy(pitches[keyFreq[i]]) - getArrayAvg(envirnmentalAvg[keyFreq[i]]) > threshold)
        {
          temp.push(pitches[keyFreq[i]])
          tempValue.push(fft.getEnergy(pitches[keyFreq[i]]) - getArrayAvg(envirnmentalAvg[keyFreq[i]]))
        }
    
    }

  //this part picks out the highest value amongst all matched values, so it has a higher chance to pickout the actual pitch
  for (let i = 0; i < temp.length; i ++)
    {
      if (tempValue[i] > highest)
        {
          highest = tempValue[i]
          highestTemp = temp[i]
        }
    }
  
  // if(highestTemp == selfTone)
  //   {
  //     highestTemp = 0
  //   }
  if (highestTemp != 0)
  {
    result.push(highestTemp)
  }
  //return will be an array but with only one or zero value, 
  return result
}
