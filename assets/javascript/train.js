var firebaseConfig = {
    apiKey: "AIzaSyBhwxkgylwQyham2598o1wAiZkYBwlL9S0",
    authDomain: "train-scheduler-sgh.firebaseapp.com",
    databaseURL: "https://train-scheduler-sgh.firebaseio.com",
    projectId: "train-scheduler-sgh",
    storageBucket: "",
    messagingSenderId: "263204007633",
    appId: "1:263204007633:web:63fe6c33e2ca4b11"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

//on click submit
$('#submit').on('click', function(event){
    //prevents page from refreshing
    event.preventDefault();

    //pull input information 
    var trainName = $('#trainName').val().trim();
    var destination = $('#destination').val().trim();
    var trainTime = $('#trainTime').val().trim();
    var frequency = parseInt($('#frequency').val().trim()); //returns integer for min
    var firstTimeConverted = moment(trainTime,"HH:mm").subtract(1,'years');
    var diffTime = moment().diff(moment(firstTimeConverted),"minutes");
    var tRemainder = diffTime % frequency;
    //calculate minutes away
    var minTillTrain = frequency - tRemainder;
    //calculate next arrival
    var nextTrainTime = moment().add(minTillTrain, "minutes");
    var nextArrival = moment(nextTrainTime).format('hh:mm');

    console.log(trainName);
    console.log(destination);
    console.log(trainTime);
    console.log(firstTimeConverted);
    console.log(diffTime);
    console.log(tRemainder);
    console.log("Minutes until next train: " + minTillTrain);
    console.log('Arrival Time: ' + nextArrival);
    console.log(frequency);

    //make fields required
    if(trainName==''||destination==''||trainTime==''||frequency==''){
        alert('please fill in all parts of form')
    };

    //set input format for minutes inputs
    if(Number.isInteger(frequency)==false){
        alert('please fill in an integer for "frequency(min)')
    }

    //clear out form inputs so form is ready for next input
    $('#trainName').val('');
    $('#destination').val('');
    $('#trainTime').val('');
    $('#frequency').val('');

    var newTrain = {
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        diffTime: diffTime
        //nextArrival: nextArrival,
        //minutesAway:minTillTrain
    };
//push information to database
    database.ref().push(newTrain);
})

//pull information from database and display on table
database.ref().on('child_added', function(childSnapshot) {
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var diffTime = childSnapshot.val().diffTime;
    //var nextArrival = childSnapshot.val().nextArrival;
    //var minTillTrain = childSnapshot.val().minutesAway;

    var tRemainder = diffTime % frequency;
    //calculate minutes away
    var minTillTrain = frequency - tRemainder;
    //calculate next arrival
    var nextTrainTime = moment().add(minTillTrain, "minutes");
    var nextArrival = moment(nextTrainTime).format('hh:mm');

    var newRow = $('<tr>').append(
        $('<td>').text(trainName),
        $('<td>').text(destination),
        $('<td>').text(frequency),
        $('<td>').text(nextArrival),
        $('<td>').text(minTillTrain),
    );

    $('#schedule').append(newRow);
});


//set input format for time inputs
