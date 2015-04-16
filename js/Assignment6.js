function createCustomer()
{
    var objRequest = new XMLHttpRequest();
    var url = "http://bus-pluto.ad.uab.edu/jsonwebservice/service1.svc/CreateCustomer";
    //Collect Customer data from web page
    var customerID= document.getElementById("customerID").value;
    var customerName = document.getElementById("customerName").value;
    var customerCity = document.getElementById("customerCity").value;
    
    //Create the parameter string
    var newCustomer = '{"CustomerID":"' + customerID.toUpperCase() + '","CompanyName":"' + customerName + '","City":"' + customerCity +'"}';    
    try
    {
	//Checking for AJAx operation return
	objRequest.onreadystatechange = function()
	{
	   if (objRequest.readyState == 4 && objRequest.status == 200)
	    {
		var result = JSON.parse(objRequest.responseText);
		operationCustomerUpdate(result);
	    }
	}
    
	
	//Start AJAX request
	objRequest.open("POST", url, true);
	objRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	objRequest.send(newCustomer);	
    }
    catch(err)
    {
	alert(err.message);
    }
    
    return false;
}

function operationCustomerUpdate(output)
{
    if (output.WasSuccessful == 1)
    {
	alert('The operation was successful!');        
    }
    else
    {	
        alert("The operation was not successful!" + "\r\n" + output.Exception);
    }
}

function updateShippingAddress()
{    
    var objRequest = new XMLHttpRequest();
    var url = "http://bus-pluto.ad.uab.edu/jsonwebservice/service1.svc/updateOrderAddress";
    //Collect Customer data from web page
    var orderID= document.getElementById("orderID").value;
    var shipAddress = document.getElementById("shipAddress").value;
    var shipCity = document.getElementById("shipCity").value;
    var shipName = document.getElementById("shipName").value;
    var shipPostcode = document.getElementById("shipPostcode").value;
    
    //Create the parameter string
    var newCustomer = '{"OrderID":"' + orderID +
			'","ShipAddress":"' + shipAddress +			
			'","ShipCity":"' + shipCity +
			'","ShipName":"' + shipName +
			'","ShipPostcode":"' + shipPostcode +'"}';

    //Checking for AJAx operation return
    objRequest.onreadystatechange = function()
    {
        if (objRequest.readyState == 4 && objRequest.status == 200)
	{
	    //alert(http.responseText);
	    var result = JSON.parse(objRequest.responseText);
	    OperationResultUpdate(result);
	}
    }
    
    //Start AJAX request
    objRequest.open("POST", url, true);
    objRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    objRequest.send(newCustomer);
    
    return false;
}

function OperationResultUpdate(output)
{
    var msg = "";
    
    switch(output) {
    case 1:
        msg = 'Operation completed successfully.';
        break;
    case 0:
        msg = 'Operation failed with an unspecified error.';
        break;
    case -2:
        msg = 'Operation failed because the data string supplied could not be deserialized into the service object.';
        break;
    case -3:
        msg = 'Operation failed because a record with the supplied Order ID could not be found.';
        break;
    }
    
    alert(msg);	    
}

function GenerateOutput(result)
{
    var count = 0;
    var displaytext = "";

    displaytext = "<table border='1'><tr><th>Company Name</th><th>City</th><th>Customer ID</th><th>Details</th></tr>";
    
    //Loop to extract data from the response object
    for (count = 0; count < result.GetAllCustomersResult.length; count++)
    {
	var custID = result.GetAllCustomersResult[count].CustomerID;
	
	if(custID.trim() != '')
	{
	    displaytext += "<tr><td>" + result.GetAllCustomersResult[count].CompanyName + "</td>" +
		"<td>" + result.GetAllCustomersResult[count].City + "</td>" +
		"<td>" + custID + "</td>" +		
		"<td><input type='radio' onClick=\"loadCustomerDetails('" + custID + "')\" name='customerList' value='" + custID + "'></td>";
	
	    displaytext = "<tr>" + displaytext + "</tr>";	    
	}
    }
    
    displaytext = displaytext +  "</table>";
    
    document.getElementById("sectionOne").innerHTML = displaytext;
}

function loadCustomerDetails(cid)
{
    if(cid == '')
    {
	cidIn = document.getElementById('customerIDIn');
	cid = cidIn.value;	
    }
    loadOrdersForCustomer(cid);
    loadCustomerOrderHistory(cid);    
}

function deleteCustomer()
{    
    var customerID= document.getElementById("customerIDToDelete").value;
    var resp = confirm("Are you sure you want to delete customer: " + customerID.toUpperCase());
    if(resp==false)
    {
	return false;
    }
    var objRequest = new XMLHttpRequest(); //Create AJAX request object
    var url = "http://bus-pluto.ad.uab.edu/jsonwebservice/service1.svc/deleteCustomer/" + customerID.toUpperCase();
    objRequest.onreadystatechange = function()
    {
        if (objRequest.readyState == 4 && objRequest.status == 200)
	{
	    var output = JSON.parse(objRequest.responseText);
	    outputDeleteCustomer(output);	    
	}
    }
    
    //Initiate the server request
    objRequest.open("GET", url, true);
    objRequest.send();
    
    return false;
}

function outputDeleteCustomer(output)
{
    if (output.DeleteCustomerResult.WasSuccessful == 1)
    {	
	alert('The operation was successful!');
    }
    else
    {	
        alert("The operation failed." + "\r\n" + output.DeleteCustomerResult.Exception);
    }
}


function loadOrdersForCustomer(cid)
{        
    var objRequest = new XMLHttpRequest(); //Create AJAX request object
    var url = "http://bus-pluto.ad.uab.edu/jsonwebservice/service1.svc/getOrdersForCustomer/" + cid;
    objRequest.onreadystatechange = function()
    {
        if (objRequest.readyState == 4 && objRequest.status == 200)
	{
	    var output = JSON.parse(objRequest.responseText);
	    outputOrdersForCustomer(output);
	}
    }
    
    //Initiate the server request
    objRequest.open("GET", url, true);
    objRequest.send();
}

function outputOrdersForCustomer(result)
{
    var count = 0;
    var displaytext = "";
    var dt = "";
    
    displaytext = "<table border='1'><tr><th>Order Date</th><th>Order ID</th><th>Shipping Address</th><th>City</th><th>Zip</th><th>Ship Date</th></tr>";
    
    //Loop to extract data from the response object
    for (count = 0; count < result.GetOrdersForCustomerResult.length; count++)
    {
	dt = result.GetOrdersForCustomerResult[count].ShippedDate;
	
	displaytext += "<tr><td>" + result.GetOrdersForCustomerResult[count].OrderDate + "</td>" +
	    "<td>" + result.GetOrdersForCustomerResult[count].OrderID + "</td>" +
	    "<td>" + result.GetOrdersForCustomerResult[count].ShipAddress + "</td>" +
	    "<td>" + result.GetOrdersForCustomerResult[count].ShipCity + "</td>" +
	    "<td>" + result.GetOrdersForCustomerResult[count].ShipPostcode + "</td>" +
	    "<td>" + dt + "</td></tr>";				

    }
    
    displaytext = displaytext +  "</table>";
    
    document.getElementById("sectionTwo").innerHTML = displaytext;
}

function showSection()
{
    var selection=document.getElementById('sectionMenu');
    var section1=document.getElementById('sectionOne');
    var section2=document.getElementById('sectionTwo');
    var section3=document.getElementById('sectionThree');
    
    if(selection.value == 'sectionOne')
    {
	section2.style.visibility='hidden';
	section3.style.visibility='hidden';
        section1.style.visibility='visible';	
    }
    else if(selection.value == 'sectionTwo')
    {
	section1.style.visibility='hidden';        
	section3.style.visibility='hidden';
	section2.style.visibility='visible';        
    }
    else if(selection.value == 'sectionThree')
    {
        section1.style.visibility='hidden';
        section2.style.visibility='hidden';
	section3.style.visibility='visible';
    }
    else
    {
	section1.style.visibility='hidden';
        section2.style.visibility='hidden';
        section3.style.visibility='hidden';        
    }
    
    return false;
}
