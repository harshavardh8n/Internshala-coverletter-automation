chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractInfo') {
      const companyName = document.querySelector('#easy_apply_company').innerText;
    const name = document.getElementById('profile_name').innerText;
    const position = document.getElementById('easy_apply_profile').innerText;
    var positionName = "";
      var spacecount = 0;
    for(let i=0;i<position.length;i++){
      if(spacecount==2){
        positionName +=position[i];
      }
      else{
        if(position[i]==' '){
          spacecount++;
        }
      }

      
    }

   
    console.log(name);
    const responsibilities = document.getElementsByClassName('text-container')[0].innerText;
      const skills = Array.from(document.getElementsByClassName("round_tabs_container")[0].getElementsByClassName("round_tabs")).map(skill => skill.innerText);
    //   console.log(skills[0]);
    //   console.log("coming here atleast");
    var skillsRequired = "";
    for(let i=0;i<skills.length;i++){
    skillsRequired=skillsRequired+`${skills[i]}, `;
    }
    console.log({ companyName, skillsRequired ,name,responsibilities,positionName})
      sendResponse({ companyName, skillsRequired ,name,responsibilities,positionName});
    }
  });
  