const video = document.getElementById("webcam");
const label = document.getElementById("label");

const labelOneBtn = document.querySelector("#labelOne");
const labelTwoBtn = document.querySelector("#labelTwo");
const predict = document.querySelector("#predict");
const trainbtn = document.querySelector("#train");

labelOneBtn.addEventListener("click", () => console.log("button 1"));
labelTwoBtn.addEventListener("click", () => console.log("button 2"));


trainbtn.addEventListener("click", () => console.log("train"));

const amountOfSteenimages = document.getElementById("amountOfSteenImages");
const amountOfSchaarimages = document.getElementById("amountOfSchaarImages");

const train = document.getElementById("train");
const save = document.getElementById("save");
const loss = document.getElementById("loss");



label.innerText = "Ready when you are!";
// Extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
  classifier.load('./my_model/model.json', customModelReady);
}

function customModelReady() {
  console.log('Custom Model is ready');
  label = 'model ready';
}

// Create a new classifier using those features and with a video element
const classifier = featureExtractor.classification(video, videoReady);

// Triggers when the video is ready
function videoReady() {
  console.log('The video is ready!');
}

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.log("Something went wrong!");
        });
}
// // Add a new image with a label
// classifier.addImage(document.getElementById('dogA'), 'dog');

// Function steen en schaar
labelOne.onclick = function() {
    console.log("steen")
    classifier.addImage(video, "steen");
    amountOfSteenimages.innerText = Number(amountOfSteenimages.innerText) + 1;
  };

labelTwo.onclick = function() {
    console.log("schaar")
    classifier.addImage(video, "schaar");
    amountOfSchaarimages.innerText = Number(amountOfSchaarimages.innerText) + 1;
  };

// Retrain the network
train.onclick = function() {
    classifier.train(function(lossValue) {
      if (lossValue) {
        totalLoss = lossValue;
        loss.innerHTML = `Loss: ${totalLoss}`;
      } else {
        loss.innerHTML = `Done Training! Final Loss: ${totalLoss}`;
      } 
    });
  };

  save.onclick = function() {
    classifier.save();
  };

  predict.onclick = function() {
    featureExtractor.classify(getVoorspelling);
  }
  
  function getVoorspelling(err, voorspellingen){
    if (err) {
      console.error(err);
    }
    if (voorspellingen && voorspellingen[0]){
      predict.innerText = voorspellingen[0].label;
      confidence.innerText = voorspellingen[0].confidence;
      classifier.classify(getVoorspelling);
      // speak("Ik voorspel dat het" + predict.innerHTML + "is")
    }
  }


  // let synth = window.speechSynthesis

// function speak(text) {
//     if (synth.speaking) {
//         console.log('still speaking...')
//         return
//     }
//     if (text !== '') {
//         let utterThis = new SpeechSynthesisUtterance(text)
//         synth.speak(utterThis)
//     }
// }

// labelOneBtn.addEventListener("click", () => {
//     speak(`Steen`)
//   })

// labelTwoBtn.addEventListener("click", () => {
//     speak(`Papier`)
//   })

// labelThreeBtn.addEventListener("click", () => {
//     speak(`Schaar`)
//   })
