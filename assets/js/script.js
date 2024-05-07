'use strict';



/**
 * navbar toggle
 */

const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");

const navElems = [overlay, navOpenBtn, navCloseBtn];

for (let i = 0; i < navElems.length; i++) {
  navElems[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
}



/**
 * header & go top btn active on page scroll
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 80) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }
});

$(document).ready(function () {
  $('.buyBtn').click(function () {
    $.LoadingOverlay("show");
    var amount = $(this).attr('data-value');
    const parameters = new URLSearchParams();

    parameters.append('grant_type', 'client_credentials');
    parameters.append('client_id', '2s4vqe17en72k8mgbsm7ausfiu');
    parameters.append('client_secret', '15rsdh1b72av4mfb0pesjhgs5fe0c87u3as2t6f33u3uilvjs89s');

    fetch('https://bene-collect.auth.eu-west-2.amazoncognito.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: parameters
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(data => {
      console.log(data);
      if (data.access_token != "" && data.access_token != null && data.access_token != undefined) {
        payment(data.access_token, amount);
      }
    }).catch(error => {
      console.error('Error:', error);
      $.LoadingOverlay("hide");
    });
  });
});

function payment(accessToken, amount) {
  if (accessToken != "" && amount != "") {
    var currentDate = new Date();
    var currentTimestamp = new Date().getTime();

    // Extract year, month, and day
    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
    var day = currentDate.getDate().toString().padStart(2, '0');

    // Format the date as YYYY-MM-DD
    var formattedDate = year + '-' + month + '-' + day;

    const jsonData = {
      "requestorTransactionId": currentTimestamp,
      "debtorName": "benepay",
      "debtorEmailId": "contact@benepay.io",
      "debtorMobileNumber": "8989898989",
      "collectionReferenceNumber": "API PAYMENT",
      "reasonForCollection": null,
      "initialDueAmount": amount,
      "initialDueDate": formattedDate,
      "charges": null,
      "reasonForCharges": "",
      "finalDueAmount": amount,
      "finalDueDate": formattedDate,
      "collectionAmountCurrency": "INR",
      "additionalComments": "API PAYMENT",
      "merchantLogoUrl": ""
    };

    const options = {
      method: 'POST',
      headers: {
        "x-api-key": "m0OKyFypSF9Ndc8dLN8CW5QsKBWY0JoE7cYQNndb",
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(jsonData)
    };

    console.log("Payload", options);
    fetch('https://uat-api-collect-payment.benepay.io/v1/realTimeRequestToPay', options)
      .then(response => {
        $.LoadingOverlay("hide");
        return response.json();
      })
      .then(data => {
        $.LoadingOverlay("hide");
        console.log("result", data);
        if (data.message != "") {
          window.location.href = data.message;
        }
      })
      .catch(error => {
        $.LoadingOverlay("hide");
        console.error('Fetch error:', error);
      });
  }
}