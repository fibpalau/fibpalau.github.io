
// FIAC Script Start
$(document).ready(function (e) {

	var uploadButton = document.getElementById('fiac-upload-button');
	var fileSelect = document.getElementById('fiac-select');

    $('#fiac-upload-form').on('submit',(function(e) {
		
        e.preventDefault(); // Prevent default form submission
        uploadButton.innerHTML = 'Uploading...'; // UI Feedback 
        var file = fileSelect.files;
        
        var formData = new FormData();
        formData.append('parent_id', '80802264662'); // Parent
        formData.append('FIAC.pdf', file); // Selected File


        console.log("FORMDATA:");
        console.log(formData);

		var uploadUrl = 'https://upload.box.com/api/2.0/files/content';
		var uploadHeader = {
		    'Authorization': 'Bearer ekvdWNS6XzZmi4nYFaAuI8nvRWVpa1kB'
		};

        $.ajax({       
            url: uploadUrl,
            headers: uploadHeader,
            type:'POST',
            data: formData,
            // Prevent JQuery from appending as querystring:
    		cache: false,
    		contentType: false,
    		processData: false,
    		// Feedback: 
            complete: function(data){
            	console.log("Response:", data.responseText);
            },
            success: function(data){
                console.log("Upload Success:");
                console.log(data);
            },
            error: function(data, err){
                console.log("Upload Error:");
                console.log(data);
            }
        });


  		//.complete(function(data){
  		//     	Confirmation??
		//     console.log(data.responseText);
		// });
    
    }));

    // Additional Scripts:
  
});




// $(document).ready(function() {

// 	var testVar = 'SUCCESS!';

//     $("#fiac-login").click(function(){
        
//     	// Put all vars here

//     	$.ajax({
//     		type: 'GET',
//     		url: 'https://account.box.com/api/oauth2/authorize?response_type=code&client_id=zyfn8698mc7oh8b6mbuv5vaojghigo3d&redirect_uri=https://fibpalau.github.io/upload.html&state=authenticated',
//     		success: function(data) {
//     			alert(testVar);
//     			alert(data);
//     		}
//     	});
//     }); 
// });











// // Requires JQuery and CORS enabled for the Origin you're testing from.

// // Manual JQuery Import:

//     // var script= document.createElement('script');
//     // script.type= 'text/javascript';
//     // script.src= '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min.js';
//     // document.head.appendChild(script);

// // Set up the multipart form using HTML5 FormData object
// // https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/FormData
// var form = new FormData();

// // The content of the file
// var fileBody = '<p>hey!<p>';

// // JS file-like object
// var blob = new Blob([fileBody], { type: 'text/xml'});

// // Add the file to the form
// form.append('file.html', blob);

// // Add the destination folder for the upload to the form
// form.append('parent_id', '0');


// $.ajax({
//     url: uploadUrl,
//     headers: headers,
//     type: 'POST',
//     // This prevents JQuery from trying to append the form as a querystring
//     processData: false,
//     contentType: false,
//     data: form
// }).complete(function ( data ) {
//     console.log(data.responseText); // Confirmation 
// });


