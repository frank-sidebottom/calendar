var users = [];
var userDisplayList = [];
var collections = [];
var collectionsDisplayList = [];

//DOM ready========================================
$(document).ready(function(){

	 	$.getJSON('/users/userlist', function(data){

 		$.each(data, function(){
 			users.push(data);
 			

 	});
 		console.log(users);
 		var userDatum = users[0];
 		for (var i = 0; i < userDatum.length; i++) {
 			userDisplayList.push(userDatum[i]['username']);
 		};
 		console.log(userDisplayList);

		for(var i = 0; i < userDisplayList.length; i++){

		 	 $('#user-list').append($('<option>', {
		 	 	value: userDisplayList[i],
		 	 	text: userDisplayList[i]
		 	 }));

		};

 });

	 	 $.getJSON('/users/collectionslist', function(data){

	 	 	$.each(data, function(){
	 	 		collections.push(data);
	 			
	 	 	});
	 	 	
	 	
        	console.log(collections);
        	var datum = collections[0];
        	for (var i = 0; i < datum.length; i++) {
        		collectionsDisplayList.push(datum[i]['s']['name']);
        	};
        	console.log(collectionsDisplayList);
        


			for(var i = 0; i < collectionsDisplayList.length; i++){

				 	 $('#calendar-list').append($('<option>', {
				 	 	value: collectionsDisplayList[i],
				 	 	text: collectionsDisplayList[i]
				 	 }));

			};

	 	 });

	 	 
	 	 $('#calendar-submit').on('click', submitCalendar);
	 	 
	 	 

});

// Functions ========================================


function submitCalendar(){
	var selectedUser = $('#user-list').val();
	var selectedCalendars = $('#calendar-list').val();
	console.log("Selected User: " + selectedUser);
	console.log("Selected Calanedars: " + selectedCalendars);

	var userSelectedCalendars = {
		'userSelect': selectedUser,
		'calendarsSelect': selectedCalendars
	}

	//var userSelectedCalendars = JSON.stringify(JSONuserSelectedCalendars);


		//must call update method on route

	        $.ajax({
        type: 'PUT',
        data: JSON.stringify(userSelectedCalendars),
        url: '/users/updateUserCalendars',
        contentType: 'application/json; charset=utf-8',
        dataType: 'JSON'
        })
}