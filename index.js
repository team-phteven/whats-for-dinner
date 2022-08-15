// import { API_KEY } from './credentials.js'
// console.log(API_KEY)

const KEY = "29b6cef4efe24ee2a38465bb1ece58f3"
const SPOONAPI = "https://api.spoonacular.com/recipes"


// https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&number=2

// hard-coding api request vars
let cuisine = "mediterranean"
let diet = "vegetarian"

async function getRecipeId() {
    let res = await fetch(`${SPOONAPI}/complexSearch?apiKey=${KEY}&cuisine=${cuisine}&diet=${diet}&number=1`)
    let body = await res.json()
    let result = await body.results[0]
    let id = await result.id
    console.log(id)
    return id
}

async function getRecipeCard() {
    let id = getRecipeId()
    // let res = await fetch(`${SPOONAPI}/?apiKey=${KEY}&cuisine=${cuisine}&diet=${diet}&number=1`)
    let res = await fetch(`https://api.spoonacular.com/recipes/4632/card?apiKey=${KEY}`)
    let body = await res.json()
    // let result = await body.results[0]
    console.log(body)
}



getRecipeCard()