// Preset filenames for upload
var fileNameMap = new Map([
    [1 , "1. FIAC.pdf"], 
    [2 , "2. Commercial Documents (§6 and 7).pdf"],
    [3, "3. Business Profiles (§8 and 9).pdf"], 
    [4, "4. Affiliated Enterprises (§10, 11, and 12).pdf"], 
    [5, "5. Proof of Financial Responsibility (§13).pdf"], 
    [6, "6. Financial Statement (§13 d) i.).pdf"], 
    [7, "7. Business Proposal (§14).pdf"], 
    [8, "8. Applicant Attachment (§15).pdf"] 
]);

// Upload error & progress notifications
function UIfeedBack(name, list) {
    console.log(name + " Create Error");
    document.getElementById("loading-list").style.display = "none";
    document.getElementById(list + "-list").style.display = "block";
}

// Enterprise Folder Creation
function entFolderCreate() {
    
    var bizName = document.getElementById("biz-name-input").value.trim();
    var currYear = new Date().getFullYear(); 
    var fileName = " - " + currYear + ": " + bizName; // User Input
    
    var uploadUrl = 'https://api.box.com/2.0/folders';
    var uploadHeader = {
        'Authorization': 'Bearer njmU875NmYxt0w1edQzFcGUcM4v300yf'
    };

    $.ajax({       
        url: uploadUrl,
        headers: uploadHeader,
        type:'POST',
        data: JSON.stringify({ name: fileName, parent: { id: '83025545413' } }),
        // Prevent JQuery from appending as querystring:
        cache: false,
        contentType: 'json',
        processData: false,
        success: function(data){ 
            appFolderCreate(data["id"]);
        },
        error: function(data){
            UIfeedBack("Enterprise Folder", "name"); 
        }
    });
}

function appFolderCreate(folderId) {
    
    var fileName = "Application";
    var uploadUrl = 'https://api.box.com/2.0/folders';
    var uploadHeader = {
        'Authorization': 'Bearer njmU875NmYxt0w1edQzFcGUcM4v300yf'
    };

    $.ajax({       
        url: uploadUrl,
        headers: uploadHeader,
        type:'POST',
        data: JSON.stringify({ name: fileName, parent: { id: folderId } }),
        // Prevent JQuery from appending as querystring:
        cache: false,
        contentType: 'json',
        processData: false,
        success: function(data){ 
            uploadFiles(data["id"], folderId);
        },
        error: function(data){
            UIfeedBack("App Folder", "error"); 
        }
    });

}

function uploadFiles(appFolderID, entFolderID) {

    var apiCalls = [] 

    for (var i = 1; i <= 8; i++) { 
        var file = $("#fiac-select" + i.toString(10))[0]; 

        // Skip blank file uploads
        if (file.files.length == 0) {
            continue;
        } else if (i == 6) {
            apiCalls.push( privFolderCreate(entFolderID, file.files[0]) );
        }
        else {
            apiCalls.push( fileUpload(file.files[0], appFolderID, i) ); 
        }
    };

    // Display appropriate prompt 
    //      WHEN async calls done
    $.when.apply($, apiCalls)
    .then(
        function () {
            var errorPresent = $("#fail-list").is(":visible") || $("#error-list").is(":visible") || $("#name-list").is(":visible")
            if ( !errorPresent ) {
                UIfeedBack("SUCCESS: There is no","success");
            }
        }
    );
    
    // Promise.all([
    //     fileUpload(file.files[0], appFolderID, i).then(data => {
    //             console.log("Upload Success: " + i);
    //             document.getElementById("file_" + i.toString(10)).style.display = "block";})
    //         .catch(data => {
    //             UIfeedBack("File " + i, "fail");})
    //     ]).then(values => { 
    //     UIfeedBack("SUCCESS: There is no","success");
    // });

    // var file1 = $("#fiac-select1")[0].files[0]; 
    // var file2 = $("#fiac-select2")[0].files[0]; 
    // var file3 = $("#fiac-select3")[0].files[0]; 
    // var file4 = $("#fiac-select4")[0].files[0]; 
    // var file5 = $("#fiac-select5")[0].files[0]; 
    // var file6 = $("#fiac-select6")[0].files[0]; 
    // var file7 = $("#fiac-select7")[0].files[0]; 
    // var file8 = $("#fiac-select8")[0].files[0]; 

    // $.when(
    //     fileUpload(file1, appFolderID, i),
    //     fileUpload(file2, appFolderID, i),
    //     fileUpload(file3, appFolderID, i),
    //     fileUpload(file4, appFolderID, i),
    //     fileUpload(file5, appFolderID, i),
    //     fileUpload(file6, appFolderID, i),
    //     fileUpload(file7, appFolderID, i),
    //     fileUpload(file8, appFolderID, i)
    // ).then(
    //     function(){
    //         UIfeedBack("SUCCESS: There is no","success");
    //     }, function(){
    //         console.log("FILE UPLOAD FAILED");
    //     } 
    // );
}

function privFolderCreate(folderId, file) {
    //When private folder uploaded, upload private file
    privFolderUpload(folderId, file)
        .then(data => {
            return fileUpload(file, data["id"], 6);
        })
        .catch(data => {
            UIfeedBack("Private Folder", "error");
            return fileUpload(file, data["id"], 6);  
        });
}

function privFolderUpload(folderId, file) {
    return new Promise((resolve, reject) => {
    
    var fileName = "Private Documents";
    var uploadUrl = 'https://api.box.com/2.0/folders';
    var uploadHeader = {
        'Authorization': 'Bearer njmU875NmYxt0w1edQzFcGUcM4v300yf'
    };

    $.ajax({       
        url: uploadUrl,
        headers: uploadHeader,
        type:'POST',
        data: JSON.stringify({ name: fileName, parent: { id: folderId } }),
        // Prevent JQuery from appending as querystring:
        cache: false,
        contentType: 'json',
        processData: false,
        success: function(data){ 
            resolve(data);
            // return fileUpload(file, data["id"], 6);
        },
        error: function(data){
            reject(data); 
            // UIfeedBack("Private Folder", "error");
            // return Promise.resolve(1); 
        }
    });
    })
}

function fileUpload(file, parentID, i) {

    var fileName = fileNameMap.get(i);
    var formData = new FormData();
    formData.append(fileName, file, fileName); // Selected File
    formData.append('parent_id', parentID); // Parent

    // API 
    var uploadUrl = 'https://upload.box.com/api/2.0/files/content'; 
    var uploadHeader = {
        'Authorization': 'Bearer njmU875NmYxt0w1edQzFcGUcM4v300yf'
    };

    return $.ajax({
        url: uploadUrl,
        headers: uploadHeader,
        type:'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        // Feedback: 
        success: function(data) { 
            console.log("Upload Success: " + i);
            document.getElementById("file_" + i.toString(10)).style.display = "block";
        },
        error: function(data){
            UIfeedBack("File " + i, "fail");  
        }
    });
}

// Master Script Start
$(document).ready(function (e) {

    // Enable Refresh Prompt
    window.onbeforeunload = function() {
        return true;
    };

    // Validity
    $(".custom-file-input").each( function() {
        $(this)[0].setAttribute("accept", ".pdf,application/pdf");
    });

    $('.custom-file-input').on('change', function(){
        // Add fileName to file label
        var fileDir = $(this).val().split("\\");
        var fileName = fileDir[fileDir.length-1]; 
        $(this).next('.custom-file-label').html(fileName);
    }); 

    $('#biz-name-input')[0].oninvalid = function () {
        this.setCustomValidity('Enter a name without using the special characters /, \\, and .');
    };
    $('#biz-name-input')[0].oninput= function () {
        this.setCustomValidity(""); 
    };

    // Other Listeners
    $('#modal-close').on('click', function(){
        document.getElementById("loading-list").style.display = "block";
        document.getElementById("name-list").style.display = "none";
        document.getElementById("loading-modal").style.display = "none";
    });

    // Form Submision
    $('#fiac-upload-form').on('submit',(function(e) {
        // Prevent default form submission
        e.preventDefault();
        document.getElementById("loading-modal").style.display = "block"; 
        document.getElementById("name-list").style.display = "none"; 
        document.getElementById("fail-list").style.display = "none"; 
        document.getElementById("error-list").style.display = "none"; 
        document.getElementById("success-list").style.display = "none"; 
        document.getElementById("file_1").style.display = "none"; 
        document.getElementById("file_2").style.display = "none"; 
        document.getElementById("file_3").style.display = "none"; 
        document.getElementById("file_4").style.display = "none"; 
        document.getElementById("file_5").style.display = "none"; 
        document.getElementById("file_6").style.display = "none"; 
        document.getElementById("file_7").style.display = "none"; 
        document.getElementById("file_8").style.display = "none"; 

        // Create Enterprise Folder, Nested Doc Folder
        entFolderCreate();
    }));

});
