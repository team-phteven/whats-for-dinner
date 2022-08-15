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

    //updating recipeInfo with new values
    recipeInfo = await {
        steps: steps,
        title: title,
        image_url: image_url
    }
}


// click event listener for button
// the function will update the variable `recipe info` with data on click (is async)
document.querySelector('button').addEventListener('click', async function(event) {
    event.preventDefault()
    await getRecipeInfo()
    console.log(recipeInfo)
    console.log(recipeInfo["steps"])
})
