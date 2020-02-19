const form = document.getElementById('submit');
const searchInput = document.getElementById('search');
const searchBTN = document.querySelector('.searchBTN')
const results = document.getElementById('result-heading')
const drinks = document.getElementById('drinks')
const singleDrink = document.getElementById('single-drink')

// search meal and fetch from api 
function searchDrink(e) {
  e.preventDefault();

  // clear single drink
  singleDrink.innerHTML = '';

  // get search term
  const term = searchInput.value;
  
  // check for empty
  if(term.trim()){
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      results.innerHTML = `<h2>Search results for ${term}:</h2>`

      if(data.drinks === null) {
        results.innerHTML = `<p>There are no search results. Try again</p>`
      }else{
        drinks.innerHTML = data.drinks.map(drink => `
        <div class="drink">
          <img src="${drink.strDrinkThumb}">
          <div class="drink-info" data-drinkID="${drink.idDrink}"> 
            <h3>${drink.strDrink}</h3>
          </div>
        </div>
        `)
        .join('')
      }
    });
    searchInput.value = '';
  }else{
    alert('BAD!')
  }
}

// fetch drink by ID
function getDrinkByID(drinkID) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    const drink = data.drinks[0];

    addDrinkToDom(drink)
  })
}

// add drink to DOM
function addDrinkToDom(drink) {
  const ingredients = [];
  for(let i = 1; i <= 20; i++){
    if(drink[`strIngredient${i}`]) {
      ingredients.push(`${drink[`strIngredient${i}`]} - ${drink[`strMeasure${i}`]}`)
    }else{
      break;
    }

    singleDrink.innerHTML = `
    <div class="single-drink">
      <h1>${drink.strDrink}</h1>
      <img src="${drink.strDrinkThumb}"/>
      <div class="main">
        <h2>Ingredients</h2>
        <ul>
        ${ingredients.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </div>
    `
  }
}



searchBTN.addEventListener('click', searchDrink)

// get the ID!~
drinks.addEventListener('click', e => {
  const drinkInfo = e.path.find(item => {
    if(item.classList) {
      return item.classList.contains('drink-info');
    }else{
      return false
    }
  });
  // console.log(drinkInfo);
  if(drinkInfo) {
    const drinkID = drinkInfo.getAttribute('data-drinkid')
    // console.log(drinkID);
    getDrinkByID(drinkID)
  }
})