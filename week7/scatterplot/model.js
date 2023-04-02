const options = { task: 'regression', debug: true }
const nn = ml5.neuralNetwork(options)

const modelInfo = {
    model: './model/model.json',
    metadata: './model/model_meta.json',
    weights: './model/model.weights.bin',
  };

  nn.load(modelInfo, modelLoaded);

  function modelLoaded(){
    console.log("Model succesfully loaded")

    let predictButton = document.getElementById("predict")
    predictButton.onclick = function() {predictGallon()};
}

async function predictGallon(){

    let predictions = []

    let HP = { horsepower: parseFloat(document.getElementById("horsepower-input").value) }
    console.log(HP)

    let prediction = await nn.predict(HP)

    // console.log(prediction)
    prediction.push({
        horsepower: HP.horsepower,
        mpg: prediction[0].mpg
    })

    console.log(prediction)

    // 
    let h3 = document.createElement("h3")
    h3.innerHTML = "Car with a horsepower of "+ prediction[1].horsepower + " pk then your Mpg is "+ Math.round(prediction[1].mpg)+ " Miles per Gallon."
    document.body.appendChild(h3)
}