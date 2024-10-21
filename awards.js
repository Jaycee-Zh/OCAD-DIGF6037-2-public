/* This file is for awarding system, including:

- conversation among phones: add points

- conversation with human: add points (temporarily; later should add or minus according to its character setting)

- calculate the points every time the array updates, if certain points are reached, happy or sad

*/

// add points
function updatePoints(){
    points += rewardForConversation;
    checkPoints();
}


// change the status based on the points
function checkPoints(){
if(points>=goal){
    petStatus = "win";
}else if (points<=0){
    petStatus = "sad";
    petStatus = "win";
}else if (points<=0){
    petStatus = "sad";
}else{
    petStatus = "counting"
    petStatus = "counting"
}
}
