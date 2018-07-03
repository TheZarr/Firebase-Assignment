// Initialize Firebase
  var config = {
	apiKey: "AIzaSyBoz7rPC6-gXk-jPyj9nRoe1uIoBL8r5_g",
    authDomain: "thezarrsproject.firebaseapp.com",
    databaseURL: "https://thezarrsproject.firebaseio.com",
    projectId: "thezarrsproject",
    storageBucket: "thezarrsproject.appspot.com",
    messagingSenderId: "689034750872"
  };
  firebase.initializeApp(config);

var trainData = firebase.database().ref();


// Button for adding trains
$("#addTrainBtn").on("click", function(){
event.preventDefault();  // Keeps from refreshing the page
	// Grabs user input
	var trainName = $("#trainNameInput").val().trim();
	var destination = $("#destinationInput").val().trim();
	var firstTrainUnix = moment($("#firstTrainInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
	var frequency = $("#frequencyInput").val().trim();

	// Creates local "temporary" object for holding train data
	var newTrain = {
		name:  trainName,
		destination: destination,
		firstTrain: firstTrainUnix,
		frequency: frequency
	}

	// Uploads train data to the database
	trainData.push(newTrain);



	// Clears all of the text-boxes
	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#firstTrainInput").val("");
	$("#frequencyInput").val("");

	return false;
});


// Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
trainData.on("child_added", function(childSnapshot, prevChildKey){

	// Store everything into a variable.
	let data = childSnapshot.val();
	let tName = data.name;
	let tDestination = data.destination;
	let tFrequency = data.frequency;
	let tFirstTrain = data.firstTrain;
	// Calculate the minutes until arrival using hardcore math
	// To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time and find the modulus between the difference and the frequency  
	let differenceTimes = moment().diff(moment.unix(tFirstTrain), "minutes");
	let tRemainder = moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency ;
	let tMinutes = tFrequency - tRemainder;

	// To calculate the arrival time, add the tMinutes to the currrent time
	let tArrival = moment().add(tMinutes, "m").format("hh:mm A"); 
	// console.log(tMinutes + " minutes to arrival");
	// console.log(tArrival + " Arrival time");
	// console.log(moment().format("hh:mm A") + " current time Am/Pm format");
	// console.log(moment().format("X") + " current time in Unix format");

	// [Work on later] Sort function
	// let nextTrain = data.firstTrain.orderByValue();
	// console.log(nextTrain);
	// Add each train's data into the table 
	$("#trainTable > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td id='min'>" + tFrequency + "</td><td id='min'>" + tArrival + "</td><td id='min'>" + tMinutes + "</td></tr>");

});

$("#currentTime").append(moment().format("hh:mm A"));

//Sort function

// var sortable = [];
// for (var firstTrain in maxSpeed) {
//     sortable.push([vehicle, maxSpeed[vehicle]]);
// }

// sortable.sort(function(a, b) {
//     return a[1] - b[1];
// });
// var points = [40, 100, 1, 5, 25, 10];
// points.sort(function(a, b){return a - b});


// Assume the following situations. 

// (TEST 1) 
// First Train of the Day is 3:00 AM 
// Assume Train comes every 3 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:18 -- 2 minutes away

// (TEST 2) 
// First Train of the Day is 3:00 AM 
// Assume Train comes every 7 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:21 -- 5 minutes away

// ==========================================================

// Solved Mathematically
// Test case 1: 
// 16 - 00 = 16
// 16 % 3 = 1 (Modulus is the remainder)
// 3 - 1 = 2 minutes away
// 2 + 3:16 = 3:18

// Solved Mathematically  
// Test case 2: 
// 16 - 00 = 16
// 16 % 7 = 2 (Modulus is the remainder)
// 7 - 2 = 5 minutes away
// 5 + 3:16 = 3:21

