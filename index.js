document.addEventListener("DOMContentLoaded",function(){
    const searchButton=document.getElementById("search-btn"); 
    const usernameInput=document.getElementById("user-input"); 
    const statsContainer=document.querySelector(".stats-container"); 
    const easyProgressCircle=document.querySelector(".easy-progress"); 
    const mediumProgressCircle=document.querySelector(".medium-progress"); 
    const hardProgressCircle=document.querySelector(".hard-progress"); 
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");    
    function validateUsername(username){
        if(username.trim()===""){
            alert("Username should not be empty");
            return false;
        }
        const regex=/^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching=regex.test(username);
        if(!isMatching){
            alert("Invaild Username: ",username);
        }
        return isMatching;

    }
    async function fetchUserDetails(username) {

           
            try{
                searchButton.textContent="Searching..."
                searchButton.disabled=true
                const targetUrl = 'https://leetcode.com/graphql/';
                const proxyUrl = 'https://cors-anywhere.herokuapp.com/' 
                const myHeaders = new Headers();
                    myHeaders.append("content-type", "application/json");
        
                    const graphql = JSON.stringify({
                        query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                        variables: { "username": `${username}` }
                    })
                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: graphql,
                    };
        
            const response = await fetch(proxyUrl+targetUrl, requestOptions);
            
            if(!response.ok){
                throw new Error("Username to fetch the User details")
            }
            const paresddata=await response.json();
            console.log("Logging data:",paresddata);
            displayUserData(paresddata);
            statsContainer.style.display="Block"
        }catch(error){
            console.log(error);
             statsContainer.style.display="none"
            alert("No Data Found");
            
        }
        finally{
            searchButton.textContent="Search"
            searchButton.disabled=false;
        }
        
    }
    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }
    function displayUserData(paresddata){
        const totalQues=paresddata.data.allQuestionsCount[0].count;
        const totalEasyQues=paresddata.data.allQuestionsCount[1].count;
        const totalMediumQues=paresddata.data.allQuestionsCount[2].count;
        const totalHardQues=paresddata.data.allQuestionsCount[3].count;

        const solvedTotalQues=paresddata.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues=paresddata.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues=paresddata.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues=paresddata.data.matchedUser.submitStats.acSubmissionNum[3].count;
        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

        const cardData=[
            {label: "Overall Sumbmissions",value:paresddata.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
            {label: "Overall Easy Sumbmissions",value:paresddata.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
            {label: "Overall Medium Sumbmissions",value:paresddata.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
            {label: "Overall Hard Sumbmissions",value:paresddata.data.matchedUser.submitStats.totalSubmissionNum[3].submissions},
        ];
        console.log("card ka data:",cardData);
        cardStatsContainer.innerHTML=cardData.map(
            data=>
            `
                 <div class="card">
                 <h3>${data.label}</h3>
                 <p>${data.value}</p>
                 </div>
            `
        ).join("")

    }
    searchButton.addEventListener("click",function(){
        const username=usernameInput.value;
        console.log("loggin username:",username);
        if(validateUsername(username)){
            fetchUserDetails(username)
        }
        
    })
})