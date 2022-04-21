




////////////////////////////////////////////////////////////////////////////////////////////
function handleButtonClick2(){
	/*
          $.ajax({
            url: "/read",
            type: "GET",
            data: {identifier:$("#identifier").val()},
            success: function(data){
                if (data.error)
                  alert("bad");
                else
                $("#name").val(data.name);
                $("#grade").val(data.grade);
                $("#driving").prop("checked",data.doesDrive);
                $("#color").val(data.color)
                $("#numRating").val(parseInt(data.range))
                $("#rating").val(parseInt(data.range))
                //$("#numRating").val(2)
              } ,    
            dataType: "json"
          });  
          */
  return false;
}


$(document).ready(function(){

/*
  $("#createButton").click(handleButtonClick);
  $("#readButton").click(handleButtonClick2);
  $("#updateButton").click(handleButtonClick3);
  $("#deleteButton").click(handleButtonClick4);
  */
  handleButtonClick2()
  //alert("hello2")

}); 