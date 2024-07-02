/* Posts Page JavaScript */

"use strict";

      // Prevents page from reloading when submit
      document.getElementById('postForm').addEventListener('submit', function(e) {
        e.preventDefault();
    
        const postContent = document.getElementById('postContent').value;
    
        const postData = {
            text: postContent
        };
    
        //converts postData to JSON string
        const postStr = JSON.stringify(postData);
        
        //sends data to server
        fetch(apiBaseURL + '/api/posts/', {
            method: "POST",
            body: postStr,
            headers: {
               
                'Authorization': "Bearer " + localStorage.token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
          return response.json();
        }) 
        .then(data => {
            console.log('Post submitted successfully:', data);
        })
        .catch(error => {
            console.error('Error submitting post:', error);
          
        });
    });
    
        //loading posts
        function loadPosts(){
            let postTexts = document.getElementById("postText");
            let posts;
            const maxPosts = 30; // Set the maximum number of posts to display
        
            fetch(apiBaseURL + "/api/posts/", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': "Bearer " + localStorage.token
                }
            })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error('Network response was not ok');
                }
                return resp.json(); 
            })
            .then((data) => {
                posts = data;
        
                // Limit the number of posts displayed to maxPosts
                const limitedPosts = posts.slice(0, maxPosts);
        
                postTexts.innerHTML = limitedPosts.map(({username, text, createdAt}) => {
                    return `
                        <div class="user">Username: ${username}</div>
                        <div class="text">${text}</div>
                        <div class="date">Created At: ${createdAt}</div>
                        <hr/>
                    `;
                }).join('');
                
                console.log("Posts fetched:", limitedPosts);
            })
            .catch(error => console.error("Error loading posts:", error));
        }

        
    //     function loadPosts(){
    //         let postTexts = document.getElementById("postText");
    //         let posts;
    //     fetch(apiBaseURL + "/api/posts/", {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Authorization': "Bearer " + localStorage.token
    //         }
    //     })
    //     .then(resp => {
    //         if (!resp.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return resp.json(); 
    //     })
    //     .then((data) => {
     
    //          posts = data;
          
    //         postTexts.innerHTML = posts.map(({username, text, createdAt})=>{
    //             return `
              
    //                 <div class="user">Username: ${username}</div>
    //                 <div class="text">${text}</div>
    //                 <div class="date">Created At: ${createdAt}</div>
    //                 <hr/>
    //                 `;
    //         }).join('')
         
    //         console.log("Posts fetched:", posts);
    //     })
    //     .catch(error => console.error("Error loading posts:", error));
    // }
    
    // loads posts after certain amount of time
    // DEFAULT!! find another way
    
    //  function fetchMessages() {
    //         loadPosts();
    //         setTimeout(fetchMessages, 3000); // Fetch new messages every 3 seconds
    //     }
    
    //     fetchMessages();
    
    document.addEventListener('DOMContentLoaded', loadPosts);


    function logout() {
        const loginData = getLoginData();
        const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";  // Make sure this is defined

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

    document.getElementById("logoutButton").addEventListener("click", logout);
    