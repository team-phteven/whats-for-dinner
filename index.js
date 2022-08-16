import { API_KEY } from './credentials.js'

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

// function to make array of ingredient strings
function stringIngredients(ingredients){
    let strings = []
    for (let ing of ingredients){
        strings.push(`${ing["name"]} - ${ing["amount"]["metric"]["value"]} ${ing["amount"]["metric"]["unit"]}`)
    }
    return strings
}

// function to make array of steps
function stepStrings(stepsArray){
    let strings = []
    for (let item of stepsArray){
        strings.push(item["step"])
    }
    return strings
}

async function getRecipeInfo() {

    // first request to get id, title and image from random recipe given the parameters
    let res = await fetch(`${SPOONAPI}/complexSearch?apiKey=${API_KEY}&cuisine=${cuisineSelect.value !== "anyCuisine" ? cuisineSelect.value : ""}&diet=${dietSelect.value !== "anyDiet" ? dietSelect.value : ""}&number=1&sort=random`)
    let body = await res.json()
    let alternative = false
    
    // conditional will make another request an alternative with same dietaries if no results are found
    if (body.totalResults === 0){
        alternative = true
        res = await fetch(`${SPOONAPI}/complexSearch?apiKey=${API_KEY}&diet=${dietSelect.value}&number=1&sort=random`)
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


// click event listener for button
// the function will update the variable `recipe info` with data on click (is async)
document.querySelector('button').addEventListener('click', async function(event) {
    toggleElementDisplay("recipe-card","none")
    toggleElementDisplay("spinner","block")
    event.preventDefault();
    await getRecipeInfo();
    toggleElementDisplay("spinner","none")
    toggleElementDisplay("recipe-card","block")
    fillRecipeIngredients();
    fillRecipeTitle();
    fillRecipeHeroImage();
    console.log(recipeInfo.steps)
})

document.getElementById('recipe-switch').addEventListener('change', function(event) {
    const recipeBody = document.getElementById('recipe-body');
    console.log("working")
    if (recipeBody.firstChild.id === "ingredient") {
        fillRecipeSteps();
    } else {
        fillRecipeIngredients();
    }
})

// mock recipe object
let recipe = {
    "steps": ['Season and Boil the Chicken for 10 minutes with sa…toes Both chopped and Blended, ginger and garlic.', 'Add your seasoning, curry, thyme, parsley, salt and pepper to the pot.', 'Pour in your stock, chicken and potatoes to cook f…r sauce gets too thick, add a little water to it.', 'Serve with white rice or more sweet potatoes.You could also garnish the dish with Bell peppers.   '],
    title: "African Chicken Peanut Stew",
    image_url: "https://spoonacular.com/recipeImages/716268-312x231.jpg",
    ingredients: ["bell peppers 1 serving", "cooking oil 2.5 ", "curry paste 1 tsp", "ginger 1", "thyme 1 pinch", "tomato 1.5", "bell peppers 1 serving", "cooking oil 2.5 ", "curry paste 1 tsp", "ginger 1", "thyme 1 pinch", "tomato 1.5", "curry paste 1 tsp", "ginger 1", "thyme 1 pinch"]
}

function fillRecipeIngredients() {
    const recipeBody = document.getElementById("recipe-body")
    recipeBody.innerHTML = '';
    recipeInfo.ingredients.forEach(ing => {
        const newIngredient = document.createElement('li');
        newIngredient.innerText = ing
        newIngredient.classList += "ingredient"
        recipeBody.appendChild(newIngredient)})
}

function fillRecipeSteps() {
    const recipeBody = document.getElementById("recipe-body")
    recipeBody.innerHTML = '';
    recipeInfo.steps.forEach(step => {
        const newStep = document.createElement('li');
        newStep.innerText = ing
        newStep.classList += "step"
        recipeBody.appendChild(newIngredient)})
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
