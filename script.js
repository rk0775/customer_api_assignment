//customer login logic
const doLogin = () => {
    var loginId=document.getElementById("loginId").value;
    var password=document.getElementById("password").value;

    var raw = JSON.stringify({
        "login_id": `${loginId}`,
        "password": `${password}`
    });

    var requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: raw,
        redirect: 'follow'
    };

    fetch("https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp", requestOptions)
        .then(response => response.json())
        .then((result) => {
            console.log(result)
            var token = result.access_token;
            sessionStorage.setItem("token", token);
            window.location.assign("customerList.html");
        })
        .catch((error) => {
            console.log('error', error)
            alert("something went wrong!!")
        });
}




//get all customer list
const getData = async () => {
    if (sessionStorage.getItem("token") === null) {
        window.location.assign("index.html");
    } else {
        var requestOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            },
        };

        fetch("https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list", requestOptions)
            .then(response => response.json())
            .then((result) => {
                console.log(result)
                hideloader();
                showDataInTable(result);
            })
            .catch(error => console.log('error', error));
    }
}




//show the customer data in table
function showDataInTable(data) {
    let tab =
        `<tr>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Address</th>
      <th>City</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Action</th>
     </tr>`;

    // Loop to access all rows
    for (let r of data) {
        tab += `<tr>
        <td>${r.first_name} </td>
        <td>${r.last_name}</td>
        <td>${r.address}</td>
        <td>${r.city}</td>   
        <td>${r.email}</td>  
        <td>${r.phone}</td>  
        <td class="d-flex"> 
            <span onClick="deleteTheCustomer('${r.uuid}')" class="text-danger mx-2" style="cursor:pointer" >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                </svg>
            </span>
            <span onClick="edit('${r.uuid}')" class="text-warning mx-2" style="cursor:pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                </svg>
            </span>
        </td>        
        </tr>`;
    }
    // Setting innerHTML as tab variable
    document.getElementById("customer").innerHTML = tab;
}



// Function to hide the loader
function hideloader() {
    document.getElementById('loading').style.display = 'none';
}



//delete the customer using uuid
function deleteTheCustomer(id) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=${id}`, requestOptions)
        .then(response => response.text())
        .then((result) => {
            if (result.trim() == "Successfully deleted") {
                alert("Customer details deleted successfully, refresh the page!");
            }
        })
        .catch((error) => {
            alert("Something went wrong!! " + error);
            console.log('error : ', error)
        });
}



//add new customer
const addNewCustomer= async()=> {
    var first_name = document.getElementById("first_name").value;
    var last_name = document.getElementById("last_name").value;
    var street = document.getElementById("street").value;
    var address = document.getElementById("address").value;
    var city = document.getElementById("city").value;
    var state = document.getElementById("state").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "JSESSIONID=156D326C7427079CB7D1F5BED35ACFE1");

    var raw = JSON.stringify({
        "first_name": `${first_name}`,
        "last_name": `${last_name}`,
        "street": `${street}`,
        "address": `${address}`,
        "city": `${city}`,
        "state": `${state}`,
        "email": `${email}`,
        "phone": `${phone}`
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    await fetch("https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create", requestOptions)
        .then(response => response.text())
        .then((result) => {
            if (result.trim() === "Successfully Created") {
                alert("new customer details saved successfully!");
            }
        })
        .catch((error) => {
            alert("Something went wrong!! " + error);
            console.log('error : ', error)
        });
}



//update the customer
const edit=(id)=> {
    window.location.assign(`addUpdateCustomer.html?uuid=${id}`);
}

const updateCustomer=(uuid)=> {
    var first_name = document.getElementById("first_name").value;
    var last_name = document.getElementById("last_name").value;
    var street = document.getElementById("street").value;
    var address = document.getElementById("address").value;
    var city = document.getElementById("city").value;
    var state = document.getElementById("state").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "JSESSIONID=156D326C7427079CB7D1F5BED35ACFE1");

    var raw = JSON.stringify({
        "first_name": `${first_name}`,
        "last_name": `${last_name}`,
        "street": `${street}`,
        "address": `${address}`,
        "city": `${city}`,
        "state": `${state}`,
        "email": `${email}`,
        "phone": `${phone}`
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=update&uuid=${uuid}`, requestOptions)
        .then(response => response.text())
        .then((result) => {
            console.log(result)
            if (result.trim() === "Successfully Updated") {
                alert("customer details updated successfully!");
            }
        })
        .catch((error) => {
            alert("Something went wrong!! " + error);
            console.log('error : ', error)
        });
}


