function getAllCustomers()
{
    var objRequest = new XMLHttpRequest(); //Create AJAX request object

    //Create URL and Query string
    var url = "http://bus-pluto.ad.uab.edu/jsonwebservice/service1.svc/getAllCustomers";
    //url += document.getElementById("custid").value;

    //Checks that the object has returned data
    objRequest.onreadystatechange = function()
    {
	if (objRequest.readyState == 4 && objRequest.status == 200)
	{
	    var output = JSON.parse(objRequest.responseText);
	    GenerateOutput(output);
	}
    }

    //Initiate the server request
    objRequest.open("GET", url, true);
    objRequest.send();
    
    return false;
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

function loadCustomerOrderHistory(cid)
{        
    var objRequest = new XMLHttpRequest(); //Create AJAX request object
    var url = "http://bus-pluto.ad.uab.edu/jsonwebservice/service1.svc/getCustomerOrderHistory/" + cid;
    objRequest.onreadystatechange = function()
    {
        if (objRequest.readyState == 4 && objRequest.status == 200)
	{
	    var output = JSON.parse(objRequest.responseText);
	    outputCustomerOrderHistory(output);
	}
    }
    
    //Initiate the server request
    objRequest.open("GET", url, true);
    objRequest.send();
}

function outputCustomerOrderHistory(result)
{
    var count = 0;
    var displaytext = "";
    
    displaytext = "<table border='1'><tr><th>Product Name</th><th>Quantity Ordered</th></tr>";
    
    //Loop to extract data from the response object
    for (count = 0; count < result.length; count++)
    {
	displaytext += "<tr><td>" + result[count].ProductName + "</td>" +
	    "<td>" + result[count].Total + "</td></tr>";				
    }
    
    displaytext = displaytext +  "</table>";
    
    document.getElementById("sectionThree").innerHTML = displaytext;
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
	getAllCustomers();
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
