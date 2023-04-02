import { VegaScatterplot } from "./libraries/vegascatterplot.js"

let nn
let plot
let cars

let trainButton = document.getElementById("train_model")
trainButton.onclick = function() {init()};

let saveButton = document.getElementById("save_model")
saveButton.onclick = function() {saveModel()};
saveButton.style.display = "none"

function loadData() {
    Papa.parse("./data/cars.csv", {
        download: true,
        header: true, // true maakt objecten, false maakt arrays
        dynamicTyping: true,
        complete: (results) => {
            drawScatterPlot(results.data)} 
    })
}

//
// teken de scatterplot voor de fake data/Cars data
//
async function drawScatterPlot(data) {
    cars = data
    plot = new VegaScatterplot()
    await plot.initialise("horsepower", "mpg", 600, 400, cars)
    createNeuralNetwork()
}

//
// maak en train het neural network
//
async function createNeuralNetwork() {
    // maak neural network
    const options = { 
        task: 'regression', 
        debug: true 
    }
    nn = ml5.neuralNetwork(options)

    // shuffle de data
    cars.sort(() => (Math.random() - 0.5))
    // voeg data toe aan neural network met addData
    for (let row of cars) {
        nn.addData({ horsepower: row.horsepower }, { mpg: row.mpg })
    }

    // train neural network
    nn.normalizeData()
    nn.train({ epochs: 10 }, () => finishedTraining()) 
}
async function finishedTraining(){
    console.log("Finished training!")
    trainingFinished()
    saveButton.style.display = "block"
    }
//
// predictions
//
async function trainingFinished() {
    // doe een enkele voorspelling om te zien of alles werkt
    // let testCar = { horsepower: 220 }
    // const results = await nn.predict(testCar)
    // console.log(results)

    // const prediction = results[0].value
    // console.log(`Deze auto zal een verbruik hebben van: ${prediction}`)


    // maak een voorspelling voor elk punt op de X as
    
    let predictions = []
    for (let i = 0; i < 400; i++) {
        let testCar = { horsepower: i }
        
        let prediction = await nn.predict(testCar)
        predictions.push({mpg:prediction[0].mpg,horsepower: i})
        console.log("Alle predictions:", predictions)
    }
    await plot.addPoints(predictions)

    // stuur nu de hele predictions array naar de scatterplot met "plot.addPoints"
    // ...
}


// // start de applicatie
async function saveModel(){
    console.log("model saved!")
    nn.save()
}

function init(){
    trainButton.style.display = "none"
    loadData()
}