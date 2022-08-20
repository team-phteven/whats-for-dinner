import { API_KEY } from './credentials.js'

// DOCUMENT SET UP:

// Array of available cuisines
const cuisines = [
    "Any Cuisine",
    "African",
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
    "Any Diet",
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
// Populates the <select> element with the <option>'s 
function populateSelectOptions(element, options) {
    options.forEach(option => {
        const newOption = document.createElement('option');
        newOption.value = option.toLowerCase();
        newOption.text = option;
        element.appendChild(newOption);}
    )
}

const cuisineSelect = document.getElementById('cuisine-select');
const dietSelect = document.getElementById('diet-select');
populateSelectOptions(cuisineSelect, cuisines);
populateSelectOptions(dietSelect, diets)

/* ------------------------------------------------ */

// HELPER FUNCTIONS:

/* ------------------------------------------------ */

// API:

const SPOONAPI = "https://api.spoonacular.com/recipes"

// define object to be assigned with data
let recipeInfo = {}

// make array of ingredient strings
function stringIngredients(ingredients){
    let strings = []
    for (let ing of ingredients){
        strings.push(`${(Math.round(ing["amount"]["metric"]["value"] * 4)/4)} ${ing["amount"]["metric"]["unit"]} ${ing["amount"]["metric"]["unit"] ? "of " : " " }${ing["name"]}`.toLowerCase())
    }
    return strings
}

// make array of steps
function stepStrings(stepsArray){
    let strings = []
    for (let item of stepsArray){
        strings.push(item["step"])
    }
    return strings
}

async function getRecipeInfo() {

    // first request to get id, title and image from random recipe given the parameters
    let res = await fetch(`${SPOONAPI}/complexSearch?apiKey=${API_KEY}&cuisine=${cuisineSelect.value !== "anyCuisine" ? cuisineSelect.value : ""}&diet=${dietSelect.value !== "anyDiet" ? dietSelect.value : ""}&number=1&sort=random&type=main course`)
    let body = await res.json()
    let alternative = false
    
    // conditional will make another request an alternative with same dietaries if no results are found
    if (body.totalResults === 0){
        alternative = true
        res = await fetch(`${SPOONAPI}/complexSearch?apiKey=${API_KEY}&number=1&sort=random&type=main course`)
        body = await res.json()
    }
    let result = await body.results[0]
    let id = await result.id
    let title = await result.title
    let image_url = await result.image

    // retrieving the recipe steps using another request with id as parameter
    let recipeResponse = await fetch(`${SPOONAPI}/${id}/analyzedInstructions?apiKey=${API_KEY}`)
    let recipeBody = await recipeResponse.json()
    let stepsArray = await recipeBody["0"]["steps"]
    let steps = stepStrings(stepsArray)

    // retrieving the recipe steps using another request with id as parameter
    let ingredientsResponse = await fetch(`${SPOONAPI}/${id}/ingredientWidget.json?apiKey=${API_KEY}`)
    let ingredientsBody = await ingredientsResponse.json()
    let ingredientsArray = await ingredientsBody["ingredients"]
    let ingredients = stringIngredients(ingredientsArray)

    //updating recipeInfo with new values // 'alternative' will be true if an alternative was fetched
    recipeInfo = {
        steps: steps,
        title: title,
        image_url: image_url,
        ingredients: ingredients,
        alternative: alternative
    }
}

/* ------------------------------------------------ */

// DOM MANIPULATION FUNCTIONS:


function fillRecipeIngredients() {
    const recipeBody = document.getElementById("recipe-body")
    recipeBody.innerHTML = '';
    recipeInfo.ingredients.forEach(ing => {
        const newIngredient = document.createElement('span');
        newIngredient.innerHTML = `<b>•</b> ${ing}`
        newIngredient.classList += "ingredient"
        recipeBody.appendChild(newIngredient)})
}

function fillRecipeSteps() {
    const recipeBody = document.getElementById("recipe-body")
    recipeBody.innerHTML = '';
    recipeInfo.steps.forEach((step, index) => {
        const newStep = document.createElement('span');
        newStep.innerHTML = `<b>${index + 1}.</b> ${step}`
        newStep.classList += "step"
        recipeBody.appendChild(newStep)})
}

function fillRecipeTitle() {
    const recipeTitle = document.getElementById("recipe-title");
    recipeTitle.innerText = recipeInfo.title;
}

function fillRecipeHeroImage() {
    const heroImage = document.getElementById("recipe-hero");
    heroImage.style.backgroundImage = `url('${recipeInfo.image_url}')`;
}

function toggleElementDisplay(elementId,display) {
    const element = document.getElementById(elementId)
    element.style.display = display;
}

//changes the big message when a new recipe is retrieved
function changeBigMessage() {
    // only run if the recipe is an alternative
    if (recipeInfo.alternative){
        // credit to Stephen for figuring out how to access the selection's text
        let sel = document.getElementById('diet-select');
        let text = sel.options[sel.selectedIndex].text;
        document.getElementById("big-message").innerHTML = `<h2>Couldn't find that, but how about this ${text} meal?</h2>`
    } else {
        document.getElementById("big-message").innerHTML = "<h2>Tonight we're having...</h2>"
    }
}

/* ------------------------------------------------ */

// EVENT LISTENERS:

// click event listener for button
// update the variable `recipe info` with data on click (is async)
// triggers dom manipulation functions, (show and hide spinner / recipe card, fill ingredients etc.)
document.querySelector('button').addEventListener('click', async function(event) {
    document.getElementById('recipe-switch').checked = false;
    toggleElementDisplay("big-message","none") 
    toggleElementDisplay("recipe-card","none")
    toggleElementDisplay("spinner","block")
    event.preventDefault();
    await getRecipeInfo();
    changeBigMessage();
    toggleElementDisplay("big-message","flex")
    toggleElementDisplay("spinner","none")
    toggleElementDisplay("recipe-card","block")
    fillRecipeIngredients();
    fillRecipeTitle();
    fillRecipeHeroImage();
})

// listen for change on the ingredients/step buttons (checkbox hack)
// if recipeBody contains steps will replace with ingredients & vice versa
document.getElementById('recipe-switch').addEventListener('change', function(event) {
    const recipeBody = document.getElementById('recipe-body');
    if (recipeBody.firstChild.classList.contains("ingredient")) {
        fillRecipeSteps();
    } else {
        fillRecipeIngredients();
    }
})

/* ------------------------------------------------ */