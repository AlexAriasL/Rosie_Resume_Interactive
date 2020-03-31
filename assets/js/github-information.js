function userInformationHTML(user) {
    return `
    <h2>${user.name}
    <span class="small-name"> 
    (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
    </span>
    </h2>
    <div class="gh-content"> 
    <div class="gh-avatar">
    <a href="${user.html_url}" target="_blank">
    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
    </a>
     </div>
     <p>Followers: ${user.followers} - Following: ${user.following} <br> Repos: ${user.public_repos}
     </p>
    </div>`;
}

    function repoInformationHTML(repos) {
        if (repos.length == 0) {
            return `<div class="clearfix repo-list">No repos!<div>`;
        }

        var listItemsHTML = repos.map(function(repo) {
            return `<li>
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            </li>`;
            
        });
        return `<div class="clearfix repo-list">
        <p>
        <strong>Repo list:</strong>
         </p>
         <ul> 
         ${listItemsHTML.join("\n")}
         </ul>

        </div>`;
    }


    function fetchGitHubInformation(event) {
        $("#gh-user-data").html("");
        $("#gh-repo-data").html("");
        var username = $("#gh-username").val();
        if (!username) {
            $("#gh-user-data").html("<h2>Please enter a GitHub username</h2>");
            return;
        }
        $("#gh-user-data").html(
            `<div id="loader">
   <img src="assets/css/catloader.gif" alt="loading..."/> 
    </div>`);

    


        /*jQuery Promise: 
          In a promise like the one below, one event (then) only takes place if another event (when) 
          has taken place before. 
          In simpler terms, when one thing (when) is done, then do another thing (then).
          In the below case, when we get a response from the GitHub API, then we run function that 
          displays the GitHub user data in the div with ID gh-user-data. 
          If they user name we type in cannot be found (404), the promise cannot be fulfiled and so we add the errorResponse function. 
          If errorResponse is triggered, the div gh-user-data will display the message is the first set of h2. 
          If the error is other than 404, then we'll log the error to the console and set the gh-user-data div to the error response 
          that came back from JSON.   
          */


        $.when(
            $.getJSON(`https://api.github.com/users/${username}`),
            $.getJSON(`https://api.github.com/users/${username}/repos`)
        ).then(
            function (firstResponse, secondResponse) {
                var userData = firstResponse[0];
                var repoData = secondResponse[0];
                $("#gh-user-data").html(userInformationHTML(userData));
                $("#gh-repo-data").html(repoInformationHTML(repoData));
           
            }, function (errorResponse) {

                if (errorResponse.status === 404) {
                    $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`)
                } else if(errorResponse.status === 403){
                      var resetTime= new Date(errorResponse.getResponseHeader('x-RateLimit-Reset')* 1000);
                      $("#gh-user-data").html(`<h4>Too many requests. Please wait unitl ${resetTime.toLocaleTimeString()}</h4>`);              
                } else {
                    console.log(errorResponse);
                    $("#gh-user-data").html(
                        `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
                }

            });

    }

$(document).ready(fetchGitHubInformation); 