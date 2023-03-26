import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

const csvFile = "./data/mushrooms.csv"
const trainingLabel = "class"
const ignoredColumns = []

let amountCorrect = 0
let total = 0  
let poisonous = 0
let notPoisonous = 0
let wrongPoisonous = 0
let wrongNotPoisonous = 0
let decisionTree

// inladen csv data
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => trainModel(results.data) // train het model met deze data
    })
}

function matrix(poisonous,notPoisonous,wrongPoisonous,wrongNotPoisonous){
    document.getElementById("poisonous").innerHTML = poisonous
    document.getElementById("notPoisonous").innerHTML = notPoisonous
    document.getElementById("wrongPoisonous").innerHTML = wrongPoisonous
    document.getElementById("wrongNotPoisonous").innerHTML = wrongNotPoisonous
}

function predicted(testData){
    let amountCorrect = 0
    let total = testData.length

    for (const testShroom of testData) {
        // maak een kopie van de testdata, daaruit verwijder je het label
    let shroomWithoutLabel = Object.assign({}, testShroom)
    delete shroomWithoutLabel.class
    //console.log(shroomWithoutLabel)
    // predict en vergelijk met originele testdata
    let prediction = decisionTree.predict(shroomWithoutLabel)
    //console.log(prediction)
    
    // if(prediction == testShroom.class) {
    // amountCorrect++
    // }

      // Confusion Matrix
    if(prediction == testShroom.class) {
        amountCorrect++

        if(prediction == "e"){
            notPoisonous++
        }

        if(prediction == "p"){
            poisonous++
        }
    } 

    if(prediction == "e" && testShroom.class == "p"){
        //console.log("predicted wrong, it is poisonous")
        wrongNotPoisonous++
    }

    if(prediction == "p" && testShroom.class == "e"){
        //console.log("predicted poisonous, but it isn't")
        wrongPoisonous++
    }
}
matrix(poisonous,notPoisonous,wrongPoisonous,wrongNotPoisonous)

let accuracy = amountCorrect / total
document.getElementById("accuracy").innerHTML = "It's "+ accuracy *100 + "% accurate!"
console.log("It's: "+accuracy +"% accurate!")
}
//
// MACHINE LEARNING - Bouw de Decision Tree
//
function trainModel(data) {
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)
    
    // console.log("Traindata: "+trainData)
    // console.log("Testdata: "+testData)
    
    //console.log(data)

    // let decisionTree = new DecisionTree({
    //     ignoredAttributes: ignoredColumns,
    //     trainingSet: data,
    //     categoryAttr: trainingLabel
    // })

        decisionTree = new DecisionTree({

        ignoredAttributes: ignoredColumns,    
        trainingSet: trainData,    
        categoryAttr: trainingLabel,    
        maxTreeDepth: 20
        
        })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())

    // let amountCorrect = 0
    // let total = testData.length

    // for (const testShroom of testData) {
    //     // maak een kopie van de testdata, daaruit verwijder je het label
    // let shroomWithoutLabel = Object.assign({}, testShroom)
    // delete shroomWithoutLabel.class
    // //console.log(shroomWithoutLabel)
    // // predict en vergelijk met originele testdata
    // let prediction = decisionTree.predict(shroomWithoutLabel)
    // //console.log(prediction)
    
    // if(prediction == testShroom.class) {
    // amountCorrect++
    // }
        predicted(testData)
    }

    // // Name,Hairlength,Weight,Age > Gender 
    // let character = {
    //     Name:"Bob",
    //     Hairlength: 7,
    //     Weight: "166",
    //     Age: 30,
    // }

    // //"Toothed","Hair","Breathes","Legs" > "Species"
    // let animal = {
    //     Toothed: 0,
    //     Hair: 0,
    //     Weight: 0,
    //     Legs: 0,
    // }

    //  //"cap-shape,cap-surface,cap-color,bruises,odor,gill-attachment,gill-spacing,gill-size,gill-color,stalk-shape,stalk-root,stalk-surface-above-ring,stalk-surface-below-ring,stalk-color-above-ring,stalk-color-below-ring,veil-type,veil-color,ring-number,ring-type,spore-print-color,population,habitat > class"
    //  let shroom = {
    //     cap_shape: "b",
    //     cap_surface: "f",
    //     cap_color: "n",
    //     bruises: "t",
    //     odor: "a",
    //     gill_attachment: "a",
    //     gill_spacing: "c",
    //     gill_size: "b",
    //     gill_color: "k",
    //     stalk_shape: "e",
    //     stalk_root: "b",
    //     stalk_surface_above_ring: "f",
    //     stalk_surface_below_ring: "f",
    //     stalk_color_above_ring: "n",
    //     stalk_color_below_ring: "n",
    //     veil_type: "p",
    //     veil_color: "n",
    //     ring_number: "n",
    //     ring_type: "c",
    //     spore_print_color: "k",
    //     population: "a",
    //     habitat: "g",
    // }
    

    //let prediction = decisionTree.predict(character)
    // let prediction = decisionTree.predict(shroom)
    //console.log(`${character.Name} is ${prediction}`)
    // console.log(`Prediction is ${prediction}`)


loadData()