window.addEventListener("load", () => {

document.getElementById('fillApplication').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("Sending message to content script");
      chrome.tabs.sendMessage(tabs[0].id, { action: 'extractInfo' }, async (response) => {
          if (chrome.runtime.lastError) {
              console.error("Error sending message:", chrome.runtime.lastError);
              return;
          }
          if (response) {
              console.log("Response received:", response);

              chrome.scripting.executeScript({
                  target: { tabId: tabs[0].id },
                  func: clickNextButton
              }, async () => {
                  console.log("Next button clicked, waiting for page to load");

                  setTimeout(async () => {
                      // Fetch cover letter
                      const coverLetterPrompt = `My name is '${response.name}'. The company name is '${response.companyName}',\n\nCompany information is '${response.positionName}', Required skills are '${response.skillsRequired}' and responsibilities: '${response.responsibilities}'`;
                      console.log("Generated cover letter prompt:", coverLetterPrompt);

                      try {
                          console.log("Fetching cover letter from server");
                          const coverLetter = await fetchCoverLetter(coverLetterPrompt);
                          console.log("Fetched cover letter:", coverLetter);

                          chrome.scripting.executeScript({
                              target: { tabId: tabs[0].id },
                              func: fillCoverLetter,
                              args: [coverLetter]
                          }, async () => {
                              console.log("Cover letter filled, proceeding to fill assessment question");

                              setTimeout(async () => {
                                  chrome.scripting.executeScript({
                                      target: { tabId: tabs[0].id },
                                      func: fillAssessmentQuestion1,
                                      args: ["this is answer"]
                                  });
                              }, 2000); // Adjust delay as necessary
                          });
                      } catch (error) {
                          console.error("Error fetching cover letter:", error);
                      }
                  }, 1000); // Adjust delay as necessary
              });
          } else {
              console.log("No response received");
          }
      });
  });
});

async function fetchCoverLetter(prompt) {
  console.log("Fetching cover letter");
  try {
    const response = await fetch('http://localhost:3002/coverletter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt })
    });

    if (response.status == 400) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    console.log(data);
    return data.coverLetter;
  } catch (error) {
    console.error("Error fetching cover letter:", error);
    throw error; // Rethrow to handle it in the calling function
  }
}

function clickNextButton() {
  console.log("Clicking next button");
  const nextButton = document.querySelector('#continue_button');
  if (nextButton) {
    nextButton.click();
  } else {
    console.error("Next button not found");
  }
}

function fillCoverLetter(coverLetter) {
  console.log("Filling cover letter");
  // document.querySelectorAll('.form-group.additional_question .textarea.form-control.valid')[0].value = "no no";
  const editorDiv = document.querySelector('.ql-editor');
  // const assessment = document.querySelectorAll('.form-group.additional_question .textarea.form-control.valid')[0]
  if (editorDiv) {
    const pElement = editorDiv.querySelector('p');
    if (pElement) {
        pElement.innerText = coverLetter;
    } else {
        const newP = document.createElement('p');
        newP.innerText = coverLetter;
        editorDiv.appendChild(newP);
    }
  } else {
    console.error("Editor div not found");
  }
  // if(assessment){
    
  // }
  // else{
    console.log("not happening")
  // }
}

function fillAssessmentQuestion1(answer) {
  console.log("Filling assessment question 1");
  const questionElement = document.querySelectorAll(".assessment_question label")[1];
  if (questionElement) {
    const answerField = document.querySelector('.textarea.form-control.valid').value;
    if (answerField) {
      document.querySelector('.textarea.form-control.valid').value = answer;
    } else {
      console.error("Answer field not found");
    }
  } else {
    console.error("Question element not found");
  }
}

})