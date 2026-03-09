let allIssuesData = [];

const allIssues=()=>{
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues") //promise of response
    .then(res=>res.json()) //promise of json
    .then((json) =>{
            allIssuesData = json.data;
            updateCounts(); 
            displayIssues(allIssuesData);
            updateIssueCount(allIssuesData.length);
            setActiveButton('all');
    } );
}

const filterIssues = (status) =>{
       let filtered = [];

    if(status=== "all"){
        displayIssues(allIssuesData);
    return;
    }
    else {
        filtered = allIssuesData.filter(issue => issue.status === status);
    }
    displayIssues(filtered);
    updateMainNumber(filtered.length);
    setActiveButton(status);   

  
}

const searchIssues = (text) => {
  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)
    .then(res => res.json())
    .then(data => {
      displayIssues(data.data); // show searched issues
    });
};

document
  .getElementById("searchInput")
  .addEventListener("keyup", function () {

    const searchText = this.value;

    if (searchText === "") {
      displayIssues(allIssuesData); 
    } else {
      searchIssues(searchText);
    }
});



const loadIssueDetail =async(id) =>{
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
    console.log(url)
    const res =await fetch(url);
    const details = await res.json();
    displayIssueDetails(details.data)

}

const displayIssueDetails=(Issue)=>{
    const detailsBox =document.getElementById("details-container");
    detailsBox.innerHTML= `
    <div id="details-container" class="space-y-3">
    <div class="">
            <h2 class="text-2xl font-bold">${Issue.title}</h2>
          </div>
          <div class="flex space-x-2">
            <p class="bg-green-700 text-white px-2 py-1 rounded-xl">Opened</p>
            <p>Opened by ${Issue.author}</p>
            <p>22/02/2026</p>
          </div>
          <div class="flex gap-3 ">
                ${Issue.labels.map(label => {
                     let color = "";

                         if (label === "bug") {
                              color = "bg-red-200 text-red-700";
                         } 
                        else if (label === "help wanted") {
                              color = "bg-yellow-200 text-yellow-800";
                         } 
                         else if (label === "enhancement") {
                              color = "bg-green-200 text-green-800";
                         }
                        
                         else {
                        color = "bg-gray-200 text-gray-700";
                         }

                        return `<button class="px-3 py-1 rounded-3xl ${color}">${label}</button>`;
                         }).join("")}
                    
                </div>
          <div>
            <p class="text-{#64748B}">${Issue.description}</p>
          </div>
          <div class="flex justify-between">
             <div>
                <p class="text-{#64748B}">Assignee:</p>
                <p class="font-bold">${Issue.assignee}</p>
             </div>
             <div >
                <p>Priority:</p>
                 <p class="bg-red-700 text-white px-2 py-1 rounded-3xl">HIGH</p>
             </div>
             
          </div>
              
              
              
          </div>
          `
    document.getElementById("my_modal_2").showModal();
}

const displayIssues=(Issues)=>{
    
    const card= document.getElementById("issue-box");
    card.innerHTML=" ";
         
   
      for(let Issue of Issues){
        console.log(Issue);

        let borderColor = "";

    if (Issue.status === "open") {
      borderColor = "border-t-4 border-green-500";
    } 
    else if (Issue.status === "closed") {
      borderColor = "border-t-4 border-purple-500";
    }


        const IssueDiv=document.createElement("div");
        
        IssueDiv.innerHTML= `
                <div onclick="loadIssueDetail(${Issue.id})"  class=" space-y-3 shadow-xl p-4 rounded-3xl ${borderColor}">
                <div class="flex justify-between ">
                    <img src="${Issue.status.toLowerCase() === 'open' ? "/assets/Open-Status.png" : "/assets/Closed-Status.png"}" alt="">
                    
                    <p class="bg-red-200 text-red-700 px-6 py-1 rounded-3xl">${Issue.priority}</p>
                </div>
                <h2 class="text-xl font-semibold">${Issue.title}</h2>
                <p class="text-[#64748B]">${Issue.description}</p>
                <div class="flex justify-between">
                ${Issue.labels.map(label => {
                     let color = "";

                         if (label === "bug") {
                              color = "bg-red-200 text-red-700";
                         } 
                        else if (label === "help wanted") {
                              color = "bg-yellow-200 text-yellow-800";
                         } 
                         else if (label === "enhancement") {
                              color = "bg-green-200 text-green-800";
                         }
                        
                         else {
                        color = "bg-gray-200 text-gray-700";
                         }

                        return `<button class="px-3 py-1 rounded-3xl ${color}">${label}</button>`;
                         }).join("")}
                    
                </div>

                <p class="text-[#64748B]">${Issue.assignee}</p>
                <p class="text-[#64748B]"> ${Issue.updatedAt}</p>

            </div>
        `

        card.append(IssueDiv);
      }
    
}

const updateMainNumber = (count) => {
    const issueCountSpan = document.querySelector("h2 span");
    issueCountSpan.textContent = count;
}

const updateCounts = () => {
    const openCount = allIssuesData.filter(issue => issue.status === "open").length;
    const closedCount = allIssuesData.filter(issue => issue.status === "closed").length;

    const openDiv = document.querySelector("div.flex.gap-2 > div:nth-child(1)");
    const closedDiv = document.querySelector("div.flex.gap-2 > div:nth-child(2)");

    if(openDiv) openDiv.textContent = `Open: ${openCount}`;
    if(closedDiv) closedDiv.textContent = `Closed: ${closedCount}`;

    // Main number shows total by default
    updateMainNumber(allIssuesData.length);
}


const setActiveButton = (status) => {
    document.querySelectorAll("section:first-of-type button").forEach(btn => btn.classList.remove("btn-active"));
    const activeBtn = document.querySelector(`section:first-of-type button[onclick*='${status}']`);
    if(activeBtn) activeBtn.classList.add("btn-active");
}

// search button
allIssues();