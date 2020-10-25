const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const drinkEl = document.getElementById("drinks");
const cocktailEl = document.getElementById("cocktails");
const cocktailsEl = document.getElementById("recipe-container");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
getCocktailHandler();
getRandomCocktail();

async function getCocktailHandler() {
    const searchName = searchTerm.value;

    if (searchName.trim()) {
        const res = await fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchName}`,
        );

        const data = await res.json();
        console.log(data);
        showSearchResults(searchName, data);
    }
}
async function getRandomCocktail() {

    searchTerm.value = "";
    const res = await fetch(
        "https://www.thecocktaildb.com/api/json/v1/1/random.php",
    );
    const data = await res.json();
    const randomCocktail = data.drinks[0];
    addCocktailsToDOM(randomCocktail, true);

}
async function getCocktailsById(drinkID) {
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`)
    const data = await res.json();
    console.log(data);
    const drinkData = data.idDrink[0];
    return drinkData;
}
function showSuccess() {
    cocktailEl.classList.add("success");
}

function showSearchResults(searchItem, data) {
    cocktailEl.innerHTML = `<h2 class="success-header">Cocktail Recipes for "${(searchItem).toUpperCase()}"</h2>`;
    if (data.drinks === null) {
        cocktailEl.classList.remove("success");
        cocktailEl.classList.add("error");
        drinkEl.innerHTML = `
        <p class="description-error">We're sorry but there are no recipes for "${searchItem}"!</p>`;
    }  
    else {
        showSuccess();

        drinkEl.innerHTML= data.drinks
            .map(
                (drink) =>
                {
                    const ingredients = [];
                    for (let i = 1; i <= 15; i++) {
                        if (drink[`strIngredient${i}`]) {
                            ingredients.push(
                                `${drink[`strIngredient${i}`]} - ${drink[`strMeasure${i}`]}`,
                            );           
                        } else {
                            break;
                        }
                    }

                    return `<div class="main__container" >
                        <div class="left img">
                            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                        </div>

                        <div class="right information">
                        <div class ="result__container">
                            <h2 class="cocktail-title">${drink.strDrink}</h2>
                            <button class="fav__btn">
                            <i class="fas fa-heart"></i>
                            </button>
                        </div>
                            <p class="description">
                            ${drink.strInstructions}
                            </p>
                            <div class="prep__container">
                                <div class="prep">Glass<span>${drink.strGlass}</span></div>
                                <div class="prep">Style<span>${drink.strCategory}</span></div>
                                <div class="prep">Alcoholic<span>${drink.strAlcoholic}</span></div>
                            </div>

                                <div class="cocktail__ingredients" id="cocktail-ingredients">
                                <ul>${ingredients.map((ing) => `<li>${ing}</li>`).join("")}</ul>
                                </div>
                            </div>          
                    </div>
                
                    `
                }  
            )
            .join("");
drinkEl.append(drinkData)
    }
    
    searchTerm.value = "";

}


function addCocktailsToDOM(drinkData, randomCocktail = false) {
    drinkEl.innerHTML = "";
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
        if (drinkData[`strIngredient${i}`]) {
            ingredients.push(
                `${drinkData[`strIngredient${i}`]} - ${drinkData[`strMeasure${i}`]}`,
            );           
        } else {
            break;
        }
    }
    drinkEl.innerHTML = `
    <div class="main__container">${randomCocktail ? `
    <div class="left img">
        <img src="${drinkData.strDrinkThumb}" alt="${drinkData.strDrink}">
    </div>
    <div class="right information">
                    <h2 class="cocktail-title">${drinkData.strDrink}</h2>

                    <p class="description">
                    ${drinkData.strInstructions}
                    </p>
                    <div class="prep__container">
                        <div class="prep">Glass<span>${drinkData.strGlass}</span></div>
                        <div class="prep">Style<span>${drinkData.strCategory}</span></div>
                        <div class="prep">Alcoholic<span>${drinkData.strAlcoholic}</span></div>
                    </div>
                    <div class="cocktail__ingredients"> 

                    <ul>${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
                    </ul>
                    </div>
                
            </div>`:""}
            </div>

    `;
    searchTerm.value = "";
}

function addCocktailsLS(drinkId){
const drinkIds = getCocktailsLS();
localStorage.setItem("drinkIds", JSON.stringify([...drinkIds, drinkId]))
console.log(drinkIds);
}


function removeCocktailsLS (drinkId){
    const drinkIds = getCocktailsLS();

    localStorage.setItem(
        "drinkIds", 
        JSON.stringify(drinkIds.filter((id) => id !== drinkId)),
        
    );
}
function getCocktailsLS (){
    const drinkIds = JSON.parse(localStorage.getItem('drinkIds'));

    return drinkIds === null ? [] : drinkIds;
}


submit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const search = searchTerm.value;
    const meals = await getCocktailHandler(search);
  
    if (meals) {
      meals.forEach((drink) => {
        showSearchResults(drink);
      });
    }

});
random.addEventListener("click", ()=>{
    cocktailEl.classList.remove("success");
    cocktailEl.classList.remove("error");
    cocktailEl.innerHTML = ``;
    getRandomCocktail();
});