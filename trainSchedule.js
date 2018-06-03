//   Display Current Date and Time

document.getElementById("date-time").innerHTML = formatAMPM();

function formatAMPM() {
var d = new Date(),
    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    ampm = d.getHours() >= 12 ? 'pm' : 'am',
    months = ['January','February','March','April','May','June','July','August','September','October','November','December'],
    days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
return 'Today is ' +days[d.getDay()]+', '+months[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear()+'. '+ 'The time is now ' +hours+':'+minutes+ ' ' +ampm + '.';
}

// Display Random Quotes
var quote = [
  ["Never, never, never give up.", "Winston Churchill"],
  ["Good artists copy. Great artists steal.", "Pablo Picasso"],
  ["Argue with idiots, and you become an idiot.", "Paul Graham"],
  ["Those who dare to fail miserably can achieve greatly.", "John F. Kennedy"],
  ["Simplicity is the ultimate sophistication.", "Leonardo Da Vinci"]
]
var quoteHTML = ""; 

function doQuotes(){
  var i = Math.floor(Math.random() * quote.length);
  quoteHTML = "<p>&ldquo;" + quote[i][0] + "&rdquo; &mdash; <em>" + quote[i][1] + "</em></p>";
  document.getElementById("quote").innerHTML = quoteHTML;
  return quoteHTML;
};

var myInterval = setInterval(doQuotes, 5000);

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBE-brUDlll1jF5XXzxV6hlDszOEgMt6QQ",
    authDomain: "train-schedule-a8359.firebaseapp.com",
    databaseURL: "https://train-schedule-a8359.firebaseio.com",
    projectId: "train-schedule-a8359",
    storageBucket: "train-schedule-a8359.appspot.com",
    messagingSenderId: "166378719768"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Create a variable to reference the current time.
var currentTime = moment();

// 2. Create Firebase function for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnap) {
        // Store everything into a variable.
    var name = childSnap.val().name;
    var destination = childSnap.val().destination;
    var firstTrain = childSnap.val().firstTrain;
    var frequency = childSnap.val().frequency;
    var minTrain = childSnap.val().minTrain;
    var nextTrain = childSnap.val().nextTrain;

// Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + 
        frequency + "</td><td>" + nextTrain + "</td><td>" + minTrain + "</td></tr>");
});

 // 3. Create jQuery on.click button for adding Trains
$("#add-train-btn").on("click", function() {

 // Grab user's input
    var trainName = $("#tName-input").val().trim();
    var destination = $("#tDestination-input").val().trim();
    var firstTrain = $("#firstTrain-input").val().trim();
    var frequency = $("#tFrequency-input").val().trim();

// Train Prediction (Source U of T Coding Boot Camp)
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");
    // Difference between the times: current time and first train
    var difference = currentTime.diff(moment(firstTrainConverted), "minutes");
    // Time apart (remainder)
    var remainder = difference % frequency;
    // Minute Until Train
    var minTillTrain = frequency - remainder;
    // Next Train
    var nextTrain = moment().add(minTillTrain, "minutes").format("hh:mm a");

    // Create local "temporary" object for holding train's data    
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        minTrain: minTillTrain,
        nextTrain: nextTrain
    }

    // Uploads train's data to the database
    database.ref().push(newTrain);
    
    // Alert
    alert("Train successfully added");
    
    // Clears all of the text-boxes
    $("#tName-input").val("");
    $("#tDestination-input").val("");
    $("#firstTrain-input").val("");
    $("#tFrequency-input").val("");

    // Determine when the next train arrives
    return false;
});
