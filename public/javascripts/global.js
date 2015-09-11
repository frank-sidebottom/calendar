//Userlist data array for filling in info box
var userListData = [];
var eventDate = '';
var calendars = [];
var calendarsDisplayList = [];

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


	// Add Event button click
    $('#createevent').on('click', createEvent);


    $('#calendar').fullCalendar({
       //events: '/users/calendarevents',
       editable: true,

       //day Click modal
       dayClick: function(date, jsEvent, view){
        dialog.dialog("open");
        eventDate = moment(date).format("YYYY-MM-DD");

        $('#start').val(eventDate);
       },//end dayclick 

       eventClick: function(event, jsEvent, view){
            eventDialog.dialog("open");
            console.log(event.title, event.description, event.start);
            $('#eventtitle').text(event.title);
            $('#eventdescription').text(event.description);
            $('#eventstart').text(event.start);
            $('#eventend').text(event.end);
            $('#eventtags').text(event.tags);
            $('#eventurl').text(event.urlTrackingUrl);
            $('#eventdrivesto').text(event.isDrivingTo);
            $('#eventnotes').text(event.notes);

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
            console.log('in loop :' + calendarsDisplayList);
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
     'url' : $('#url').val()
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

    name = $('#calendar-dropdown').val()

    $('#calendar').fullCalendar({
        events: '/users/calendarevents'
    })

}



