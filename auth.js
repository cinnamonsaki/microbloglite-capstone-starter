/* auth.js provides LOGIN-related functions */

"use strict";

const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNha2kwMSIsImlhdCI6MTcxOTQ5OTM1OCwiZXhwIjoxNzE5NTg1NzU4fQ.hWtpW_vDAD9rpS7X9wzDYM0Fl28bS9OqurVM7dDpdjY" ;
// Backup server (mirror):   "https://microbloglite.onrender.com"

// NOTE: API documentation is available at /docs 
// For example: http://microbloglite.us-east-2.elasticbeanstalk.com/docs


// You can use this function to get the login data of the logged-in
// user (if any). It returns either an object including the username
// and token, or an empty object if the visitor is not logged in.
function getLoginData () {
    const loginJSON = window.localStorage.getItem("login-data");
    return JSON.parse(loginJSON) || {};
}


// You can use this function to see whether the current visitor is
// logged in. It returns either `true` or `false`.
function isLoggedIn () {
    const loginData = getLoginData();
    return Boolean(localStorage.token);
}


// This function is already being used in the starter code for the
// landing page, in order to process a user's login. READ this code,
// and feel free to re-use parts of it for other `fetch()` requests
// you may need to write.
function login(loginData) {
    return fetch(apiBaseURL + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(loginData),
    }).then(response => response.json()).then(loginData => {
        if (loginData.hasOwnProperty("message")) {
            error.innerHTML = loginData.message;
            return;
        }
        error.innerHTML = "";
        // window.localStorage.setItem("login-data", JSON.stringify(loginData));
        window.localStorage.token = loginData.token; //simple string
        window.localStorage.username = loginData.username; //simple string
        window.location.assign("/posts");  // redirect
        return loginData;
    });
}


// This is the `logout()` function you will use for any logout button
// which you may include in various pages in your app. Again, READ this
// function and you will probably want to re-use parts of it for other
// `fetch()` requests you may need to write.
function logout () {
    const loginData = getLoginData();

    // GET /auth/logout
    const options = { 
        method: "GET",
        headers: { 
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(apiBaseURL + "/auth/logout", options)
        .then(response => response.json())
        .then(data => console.log(data))
        .finally(() => {
            window.localStorage.removeItem("login-data");  // remove login data from LocalStorage
            window.location.assign("/");  // redirect back to landing page
        });
}
