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

// hard-coding api request vars
let cuisine = "mediterranean"
let diet = "vegetarian"

async function getRecipeInfo() {

    return {
        "cuisine": "cuisineSelect.value",
        "diet": "dietSelect.value"
    }

    // let res = await fetch(`${SPOONAPI}/complexSearch?apiKey=${API_KEY}&cuisine=${cuisineSelect.value}&diet=${dietSelect.value}&number=1`)
    // let body = await res.json()
    // let result = await body.results[0]
    // console.log(result)
    // let id = await result.id
    // console.log(id)
    // return id
    // id title image
    
}

async function getRecipeCard() {
    let id = getRecipeId()
    // let res = await fetch(`${SPOONAPI}/?apiKey=${KEY}&cuisine=${cuisine}&diet=${diet}&number=1`)
    let res = await fetch(`https://api.spoonacular.com/recipes/4632/card?apiKey=${API_KEY}`)
    let body = await res.json()
    // let result = await body.results[0]
    console.log(body)
}

// console.log(toCamelCase("Lacto-Vegetarian"))

// click event listener for button

// const recipeInfo = {}

document.querySelector('button').addEventListener('click', function(event) {
    event.preventDefault()
    console.log(getRecipeInfo())
})

// sample response from getRecipeInfo

// {id: 716268, title: 'African Chicken Peanut Stew', image: 'https://spoonacular.com/recipeImages/716268-312x231.jpg', imageType: 'jpg'}
// id: 716268
// image: "https://spoonacular.com/recipeImages/716268-312x231.jpg"
// imageType: "jpg"
// title: "African Chicken Peanut Stew"