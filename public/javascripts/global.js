//Userlist data array for filling in info box
var userListData = [];
var eventDate = '';
var calendars = [];
var calendarsDisplayList = [];
var dynamicEvents = '';
var testCalendar = '/users/calendarevents/calendarevents/';
var selectedEvent = {};

//DOM ready========================================
$(document).ready(function(){



    dialog = $("#addevent").dialog({
    autoOpen: false,
    height: 300,
    width: 350,
    modal: true
    });//end dialog

    eventDialog = $("#editevent").dialog({
    autoOpen: false,
    height: 500,
    width: 650,
    modal: true
    });//end dialog

    editDialog = $("#editDialog").dialog({
    autoOpen: false,
    height: 500,
    width: 650,
    modal: true
    });//end dialog

	// Add Event button click
    $('#createevent').on('click', createEvent);
    //on click of
    //$('.editeventfield').on('click', editEvent);
    $('.editeventfield').on('click', function() {
  editEvent(this.id);

});



//Does this need to be here? *!*!*!!*!*!*!!**!!*!*!*!!

    $('#calendar').fullCalendar({
       events: dynamicEvents,
       editable: true,

       //day Click modal
       dayClick: function(date, jsEvent, view){
        dialog.dialog("open");
        eventDate = moment(date).format("YYYY-MM-DD");

        $('#start').val(eventDate);
       },//end dayclick

       eventClick: function(event, jsEvent, view){
            event.preventDefault();
            eventDialog.dialog("open");
            console.log(event.title, event.description, event.start);
            $('#title-anchor').text(event.title);
            $('#description-anchor').text(event.description);
            $('#start-anchor').text(event.start);
            $('#end-anchor').text(event.end);
            $('#tags-anchor').text(event.tags);
            $('#url-anchor').text(event.urlTrackingUrl);
            $('#drivesto-anchor').text(event.isDrivingTo);
            $('#notes-anchor').text(event.notes);

       }//end eventClick

    });//end fullCalendar

    $.getJSON('/calendars', function(data){

            $.each(data, function(){
            calendars.push(data);

        });


        //console.log('val of calendars[0]: ' + calendars[0]);
        var cals = calendars[0];

        for (var i = 0; i < cals.length; i++) {
            calendarsDisplayList.push(cals[i]);
            //console.log('in loop :' + calendarsDisplayList);
        };
        for(var i = 0; i < calendarsDisplayList.length; i++){

                 $('#calendar-dropdown').append($('<option>', {
                    value: calendarsDisplayList[i],
                    text: calendarsDisplayList[i]
                 }));

        };
    });

    $('#calendar-choice-submit').on('click', calendarChoiceSubmit);

});//end doc.ready

// Functions ========================================


function createEvent(event){
    event.preventDefault();

    var newEvent = {

    'title' : $('#title').val(),
    'description' : $('#description').val(),
    'start' : $('#start').val(),
     'end' : $('#end').val(),
     'tags' : $('#tags').val(),
     'drivesto' : $('#drivesto').val(),
     'notes' : $('#notes').val(),
     'url' : $('#url').val(),
     'calendar' : $('#calendar-dropdown').val()
    }
/*
*
*           SUPER DIRTY AJAX CALL WITHOUT ERROR CHECKING. FIX THIS!!!!!!!!!!!
*           Was writing to db but not getting back a response object.
*
*/

        $.ajax({
        type: 'POST',
        data: newEvent,
        url: '/users/addevent',
        dataType: 'JSON'
        })//.done(function(response) {

        // Check for successful (blank) response
        // if (response.msg === '') {
             console.log('let them eat cake');
        //     // Clear the form inputs
             $('#addevent input').val('');

        //     //Hide dialog
             dialog.dialog('close');
             $('#calendar').fullCalendar( 'refetchEvents' );


       //  }            else {

        //         // If something goes wrong, alert the error message that our service returned
           //      alert('Error: ' + response.msg);
          //   }
        //});
    };

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    // Would this work after first error is made?
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

function calendarChoiceSubmit(){

    event.preventDefault();

    var name = $('#calendar-dropdown').val()
    var dynamicEvents = '/users/calendarevents/' + name + '/';
    //console.log("events: " + dynamicEvents);
    $('#calendar').fullCalendar( 'destroy' )
    $('#calendar').fullCalendar({
        events: dynamicEvents,//'/users/calendarevents/calendarevents/'
               editable: true,

       //day Click modal
       dayClick: function(date, jsEvent, view){
        dialog.dialog("open");
        eventDate = moment(date).format("YYYY-MM-DD");

        $('#start').val(eventDate);
       },//end dayclick

       eventClick: function(event, jsEvent, view){
            selectedEvent = event;
            //console.log("the event: " + selectedEvent);
            eventDialog.dialog("open");
            //console.log(event.title, event.description, event.start);
            $('#title-anchor').text(event.title);
            $('#description-anchor').text(event.description);
            $('#start-anchor').text(event.start);
            $('#end-anchor').text(event.end);
            $('#tags-anchor').text(event.tags);
            $('#url-anchor').text(event.urlTrackingUrl);
            $('#drivesto-anchor').text(event.isDrivingTo);
            $('#notes-anchor').text(event.notes);


       }//end eventClick

    })




}

function editEvent(id){
    //you haven't passed the id yet, dingus
    event.preventDefault();
    editDialog.dialog("open");
    //take the value of the #id that was clicked and the unique identifyer of the object from the global var
    //Package that in an object you send to the route through ajax lson stringify data
    //Have the route access the unique id of the object and change the value of the field. How to identify the field?

    //Dirty String manipulation to get the identifier of the event param to change
    newParamId = id.replace('-anchor', '');
    //console.log('new id: '+ newParamId);
    $('#edit-event-submit').unbind('click').on('click', function(){
        editEventSubmit(selectedEvent, newParamId, id);
        //console.log('editEventSubmit called with params: selectedEvent: ' + selectedEvent + ' newParamId: ' + newParamId + ' id: ' + id);
    });
}

function editEventSubmit(event, newParamId, id){


        var eventData = $('#event-field').val()

        var eventParam = newParamId;


        var theData = {
            'event' : JSON.stringify(selectedEvent),
            'newData': eventData,
            'eventParam': eventParam
        }

        var stringifiedData = JSON.stringify(theData);



        $.ajax({
        type: 'PUT',
        data: theData,
        url: '/users/editevent',
        //contentType: 'application/json; charset=utf-8',
        dataType: 'JSON'
        })




}
