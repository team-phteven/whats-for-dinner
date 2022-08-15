import { API_KEY } from './credentials.js'

// Array of available cuisines

const cuisines = ["African",
    "American",
    "British",
    "Cajun",
    "Caribbean",
    "Chinese",
    "Eastern European",
    "European",
    "French",
    "German",
    "Greek",
    "Indian",
    "Irish",
    "Italian",
    "Japanese",
    "Jewish",
    "Korean",
    "Latin American",
    "Mediterranean",
    "Mexican",
    "Middle Eastern",
    "Nordic",
    "Southern",
    "Spanish",
    "Thai",
    "Vietnamese"];

// Array of available diets

const diets = [
    "Gluten Free",
    "Ketogenic",
    "Vegetarian",
    "Lacto-Vegetarian",
    "Ovo-Vegetarian",
    "Vegan",
    "Pescetarian",
    "Paleo",
    "Primal",
    "Low FODMAP",
    "Whole30"
]

// Takes an HTML <select> element and an array of option strings.
// Populates the <select> element with the <option>'s .

// function to convert string to camelCase
function toCamelCase(str) {
    let answer = ""
    answer += str[0].toLowerCase()
    for (let i =1; i < str.length; i++){
        if (str[i - 1] === "_"||str[i - 1] === "-"){
            answer += str[i].toUpperCase()
        } else if (str[i] !== "-" && str[i] !== "_" && str[i] !== " "){
            answer += str[i]
        }
    }
    return answer
}


function populateSelectOptions(element, options) {
    for (let option of options) {
        const newOption = document.createElement('option');
        newOption.value = toCamelCase(option);
        newOption.text = option;
        element.appendChild(newOption);
    }
}

const cuisineSelect = document.getElementById('cuisine-select');
const dietSelect = document.getElementById('diet-select');

populateSelectOptions(cuisineSelect, cuisines);
populateSelectOptions(dietSelect, diets)

// API stuff

// const KEY = "29b6cef4efe24ee2a38465bb1ece58f3"
const SPOONAPI = "https://api.spoonacular.com/recipes"

// define object to be assigned with data
let recipeInfo = {}

// hard coded mock object from API
// let ingredients = [
//         {
//             "amount": {
//                 "metric": {
//                     "unit": "g",
//                     "value": 222.0
//                 },
//                 "us": {
//                     "unit": "cups",
//                     "value": 1.5
//                 }
//             },
//             "image": "blueberries.jpg",
//             "name": "blueberries"
//         },
//         {
//             "amount": {
//                 "metric": {
//                     "unit": "",
//                     "value": 1.0
//                 },
//                 "us": {
//                     "unit": "",
//                     "value": 1.0
//                 }
//             },
//             "image": "egg-white.jpg",
//             "name": "egg white"
//         },
//         {
//             "amount": {
//                 "metric": {
//                     "unit": "Tbsps",
//                     "value": 2.0
//                 },
//                 "us": {
//                     "unit": "Tbsps",
//                     "value": 2.0
//                 }
//             },
//             "image": "flour.png",
//             "name": "flour"
//         }
//     ]

// function to make array of ingredient strings

function stringIngredients(ingredients){
    let strings = []
    for (let ing of ingredients){
        strings.push(`${ing["name"]} ${ing["amount"]["metric"]["value"]} ${ing["amount"]["metric"]["unit"]}`)
    }
    return strings
}

async function getRecipeInfo() {

    // first request to get id, title and image
    let res = await fetch(`${SPOONAPI}/complexSearch?apiKey=${API_KEY}&cuisine=${cuisineSelect.value}&diet=${dietSelect.value}&number=1`)
    let body = await res.json()
    let result = await body.results[0]
    let id = await result.id
    let title = await result.title
    let image_url = await result.image

    // retrieving the recipe steps using another request with id as parameter
    let recipeResponse = await fetch(`${SPOONAPI}/${id}/analyzedInstructions?apiKey=${API_KEY}`)
    let recipeBody = await recipeResponse.json()
    let steps = await recipeBody["0"]["steps"]

    // retrieving the recipe steps using another request with id as parameter
    let ingredientsResponse = await fetch(`${SPOONAPI}/${id}/ingredientWidget.json?apiKey=${API_KEY}`)
    let ingredientsBody = await ingredientsResponse.json()
    let ingredientsArray = await ingredientsBody["ingredients"]
    let ingredients = stringIngredients(ingredientsArray)
    console.log(ingredientsBody)
    // let ingredients = await recipeBody["0"]["steps"]

    //updating recipeInfo with new values
    recipeInfo = {
        steps: steps,
        title: title,
        image_url: image_url,
        ingredients: ingredients
    }
}


// click event listener for button
// the function will update the variable `recipe info` with data on click (is async)
document.querySelector('button').addEventListener('click', async function(event) {
    event.preventDefault()
    await getRecipeInfo()
    console.log("---------")
    console.log(recipeInfo)
    console.log(recipeInfo["ingredients"])
    fillRecipeIngredients()
    fillRecipeTitle()
})


function fillRecipeIngredients() {
    const ingredientList = document.getElementById("recipe-ingredients")
    ingredientList.innerHTML = '';
    recipeInfo.ingredients.forEach(ing => {
        const newIngredient = document.createElement('li');
        newIngredient.innerText = ing
        newIngredient.classList += "ingredient"
        ingredientList.appendChild(newIngredient)
    })
}

function fillRecipeTitle() {
    const recipeTitle = document.getElementById("recipe-title")
    recipeTitle.innerText = recipeInfo.title
}

function fillRecipeHeroImage() {
    const heroImage = document.getElementById("recipe-hero")
    heroImage.style.backgroundImage = `url()`
}