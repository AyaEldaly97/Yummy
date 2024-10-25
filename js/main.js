let rowData= document.getElementById("rowData")
let searchContainer = document.getElementById("searchContainer")

$(document).ready(()=>{
    searchByName("").then(()=>{
        $(".loading-screen").fadeOut(1000)
        $("body").css("overflow","visible")
    })
})


// ^ Side Nav functions
function openSideNav(){
    $(".side-nav").animate({left:0}, 500)
    $(".side-nav i.open-close-icon").removeClass("fa-align-justify").addClass("fa-x")
    
    for (let i=0;  i<$(".links li").length; i++){
        $(".links li").eq(i).animate({top:0} , (i+5)*100)
    }
}

function closeSideNav(){
    let boxWidth = $(".side-nav .nav-tab").outerWidth()
    $(".side-nav").animate({left:-boxWidth}, 500)
    $(".side-nav i.open-close-icon").removeClass("fa-x").addClass("fa-align-justify")
    $(".links li").animate({top:300} , 500)
}
closeSideNav()

$(".side-nav i.open-close-icon").on("click" , function(){
    if($(".side-nav").css("left") == "0px"){
        closeSideNav()
    }else{
        openSideNav()
    }
})






// ^ Search and main display
function showSearch(){
    searchContainer.innerHTML = `<div class="row py-5">
            <div class="col-md-6">
                <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input onkeyup="searchByFletter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
            </div>
        </div>`

    rowData.innerHTML=``
    
}

        // & Search By Name
async function searchByName(term){
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json()
    
    if(response.meals){ //! check if there's a meal with this name
        displayMeals(response.meals.slice(0,20))
    } else{
        displayMeals([])
    }
    $(".inner-loading-screen").fadeOut(300)
}

        // & Search By First Letter
async function searchByFletter(term) {
    $(".inner-loading-screen").fadeIn(300)
    if(term === ""){
        term = "a"
    }

    if (term.length > 1) { //! to Ensure that only 1 letter is allowed
        term = term.slice(0, 1);
    }

    if (term) { //! Fetch data only if a valid single letter is entered
        let response = await fetch(`https://themealdb.com/api/json/v1/1/search.php?f=${term}`);
        response = await response.json();

        if (response.meals) { //! If there are results, display them. Otherwise display an empty result.
            displayMeals(response.meals.slice(0,20));
        } else {
            displayMeals([]);
        }
    }
    $(".inner-loading-screen").fadeOut(300)
}

function displayMeals(arr){
    let mealsHtml = ``

    for(let i = 0 ; i < arr.length ; i++){
        mealsHtml += `<div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="cursor-pointer meal rounded-2 position-relative overflow-hidden">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="">
                    <div class="meal-layer position-absolute d-flex align-items-center justify-content-center text-black">
                        <h3 class="text-center">${arr[i].strMeal}</h3>
                    </div>
                </div>
            </div>`
    }

    rowData.innerHTML = mealsHtml

}


function hideSearchInputs(){
    searchContainer.innerHTML=``
}







// ^ Get Categories

async function getCategories(){
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()
    displayCategories(response.categories.slice(0,20))
    hideSearchInputs()
    $(".inner-loading-screen").fadeOut(300)
}


function displayCategories(arr){
    let categoriesHtml = ``

    for(let i = 0 ; i < arr.length ; i++){
        categoriesHtml += `<div class="col-md-3">
                <div onclick="getCategoryMeal('${arr[i].strCategory}')" class="cursor-pointer meal rounded-2 position-relative overflow-hidden">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="">
                    <div class="meal-layer position-absolute d-flex flex-column justify-content-center text-center text-black">
                        <h3 class="text-center fs-5">${arr[i].strCategory}</h3>
                        <p class="fs-6">${arr[i].strCategoryDescription.split(" ").slice(0,10).join(" ")}</p>
                    </div>
                </div>
            </div>`
    }

    rowData.innerHTML = categoriesHtml

}

    // * Get category meals
async function getCategoryMeal(category) {
    let response = await fetch(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()
    
    displayMeals(response.meals.slice(0,20))
    
}







// ^ Get Area

async function getArea(){
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://themealdb.com/api/json/v1/1/list.php?a=list`)
    response = await response.json()

    displayAreas(response.meals.slice(0,20))
    hideSearchInputs()
    $(".inner-loading-screen").fadeOut(300)
}

function displayAreas(arr){
    let areasHtml = ``

    for(let i = 0 ; i < arr.length ; i++){
        areasHtml += `
            <div class="col-md-3">
                <div onclick="getAreaMeal('${arr[i].strArea}')" class="cursor-pointer bg-warning p-3 d-flex flex-column justify-content-center text-center gap-2 rounded-2 text-black">
                        <i class="fa-solid fa-house-laptop"></i>
                        <h3 class="text-center fs-5">${arr[i].strArea}</h3>
                </div>
            </div>`
    }

    rowData.innerHTML = areasHtml

}

    // * Get area meals
async function getAreaMeal(area) {
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()
    
    displayMeals(response.meals.slice(0,20))
    $(".inner-loading-screen").fadeOut(300)
    
}










// ^ Get Ingredients
async function getIngredients(){
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://themealdb.com/api/json/v1/1/list.php?i=list`)
    response = await response.json()

    displayIngredients(response.meals.slice(0,20))
    hideSearchInputs()
    $(".inner-loading-screen").fadeOut(300)
}

function displayIngredients(arr){
    let ingredientsHtml = ``

    for(let i = 0 ; i < arr.length ; i++){
        ingredientsHtml += `
            <div class="col-md-3">
                <div onclick="getIngredientMeal('${arr[i].strIngredient}')" class="cursor-pointer bg-warning p-3 d-flex flex-column justify-content-center text-center gap-2 rounded-2 text-black">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3 class="text-center fs-4">${arr[i].strIngredient}</h3>
                        <p class="text-center fs-6">${arr[i].strDescription.split(" ").slice(0,15).join(" ")}</p>
                </div>
            </div>`
    }

    rowData.innerHTML = ingredientsHtml

}

    // * Get Ingredient meals
async function getIngredientMeal(ingredient) {
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    response = await response.json()
    
    displayMeals(response.meals.slice(0,20))
    $(".inner-loading-screen").fadeOut(300)
}










// ^ Get Each Meal Details
async function getMealDetails(mealNum) {
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch (`https://themealdb.com/api/json/v1/1/lookup.php?i=${mealNum}`)
    response = await response.json()
    
    displayMealDetails(response.meals[0])
    hideSearchInputs()
    $(".inner-loading-screen").fadeOut(300)

}

function displayMealDetails(meal){
    closeSideNav()
    hideSearchInputs()
    let ingredientsHtml = ``
    for (let i=1; i<=20 ; i++ ){
        if(meal[`strIngredient${i}`]){
            ingredientsHtml += `<li class="alert alert-info m-2 p-2">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
            
        }
    }


    let tags = []; // ! Incase tags is null or undefined when the meal has no tags
    if (meal.strTags) {
        tags = meal.strTags.split(","); // ! splitting the tag string as it's seperated in the API with ,
    }


    let tagsHtml = ``
    for(let i=0 ; i<tags.length ; i++){
        tagsHtml += `<li class="alert alert-danger m-2 p-2">${tags[i]}</li>`
    }

    let mealDetailsHtml = `
            <div class="col-md-4">
          <img
            class="w-100 rounded-3"
            src="${meal.strMealThumb}"
            alt=""
          />
          <h2 class="my-3">${meal.strMeal}</h2>
        </div>
        <div class="col-md-8">
          <h2>Instructions</h2>
          <p>${meal.strInstructions}</p>
          <h3><span class="fw-bolder">Area: </span>${meal.strArea}</h3>
          <h3><span class="fw-bolder">Category: </span>${meal.strCategory}</h3>
          <h3>Recipes:</h3>
          <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${ingredientsHtml}
          </ul>
          <h3>Tags:</h3>
          <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tagsHtml}
          </ul>

          <div class="pt-4">
              <a target="_blank" href="${meal.strSource}" class="btn btn-success m-2 p-2">Source</a>
              <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger m-2 p-2">Youtube</a>
          </div>
        </div>`

        rowData.innerHTML = mealDetailsHtml
}









// ^ Contact Us
function showContactUs(){
    let contactUsHtml = `
            <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center">
                <div class="row g-4 py-5">
                    <div class="col-md-6">
                        <input autocomplete="off" type="text" class="form-control contactInput" placeholder="Enter Your Name" id="nameInput">
                        <p class="alert alert-danger w-100 mt-2 d-none">Special Characters and numbers are not allowed</p>
                    </div>
                    <div class="col-md-6">
                        <input autocomplete="off" type="email" class="form-control contactInput" placeholder="Enter Your Email" id="emailInput">
                        <p class="alert alert-danger w-100 mt-2 d-none">Email not valid *example@yyy.zzz</p>
                    </div>
                    <div class="col-md-6">
                        <input autocomplete="off" type="tel" class="form-control contactInput" placeholder="Enter Your Phone" id="phoneInput">
                        <p class="alert alert-danger w-100 mt-2 d-none">Enter valid Phone Number</p>
                    </div>
                    <div class="col-md-6">
                        <input autocomplete="off" type="number" class="form-control contactInput" placeholder="Enter Your Age" id="ageInput">
                        <p class="alert alert-danger w-100 mt-2 d-none">Enter valid Age</p>
                    </div>
                    <div class="col-md-6">
                        <input autocomplete="off" type="password" class="form-control contactInput" placeholder="Enter Your Password" id="passInput">
                        <p class="alert alert-danger w-100 mt-2 d-none">Enter valid password *Minimum eight characters, at least one letter and one number*</p>
                    </div>
                    <div class="col-md-6">
                        <input autocomplete="off" type="password" class="form-control contactInput" placeholder="Re-Enter Your Password" id="repassInput">
                        <p class="alert alert-danger w-100 mt-2 d-none">Passwords are not matching</p>
                    </div>
                </div>
                <button id="submitBtn" disabled class="btn btn-outline-danger px-3 mt-2">Submit</button>
            </div>
        </div>`
    rowData.innerHTML = contactUsHtml


    let nameInputFocus = false
    $("#nameInput").on("focus", ()=>{nameInputFocus = true})

    let emailInputFocus = false
    $("#emailInput").on("focus", ()=>{emailInputFocus = true})

    let phoneInputFocus = false
    $("#phoneInput").on("focus", ()=>{phoneInputFocus = true})

    let ageInputFocus = false
    $("#ageInput").on("focus", ()=>{ageInputFocus = true})
    
    let passwordInputFocus = false
    $("#passInput").on("focus", ()=>{passwordInputFocus = true})

    let repasswordInputFocus = false
    $("#repassInput").on("focus", ()=>{repasswordInputFocus = true})

    $(".contactInput").on("keyup", function validation(){
        if (nameInputFocus){
            if (nameValidation() == false){
                $("#nameInput").next().removeClass("d-none")
                $("#nameInput").addClass("is-invalid")
                $("#nameInput").removeClass("is-valid")
            } else {
                $("#nameInput").next().addClass("d-none")
                $("#nameInput").addClass("is-valid")
                $("#nameInput").removeClass("is-invalid")
            }
        }

        if (emailInputFocus){
            if (emailValidation() == false){
                $("#emailInput").next().removeClass("d-none")
                $("#emailInput").addClass("is-invalid")
                $("#emailInput").removeClass("is-valid")
            } else {
                $("#emailInput").next().addClass("d-none")
                $("#emailInput").addClass("is-valid")
                $("#emailInput").removeClass("is-invalid")
            }
        }

        if (phoneInputFocus){
            if (phoneValidation() == false){
                $("#phoneInput").next().removeClass("d-none")
                $("#phoneInput").addClass("is-invalid")
                $("#phoneInput").removeClass("is-valid")
            } else {
                $("#phoneInput").next().addClass("d-none")
                $("#phoneInput").addClass("is-valid")
                $("#phoneInput").removeClass("is-invalid")
            }
        }

        if (ageInputFocus){
            if (ageValidation() == false){
                $("#ageInput").next().removeClass("d-none")
                $("#ageInput").addClass("is-invalid")
                $("#ageInput").removeClass("is-valid")
            } else {
                $("#ageInput").next().addClass("d-none")
                $("#ageInput").addClass("is-valid")
                $("#ageInput").removeClass("is-invalid")
            }
        }

        if (passwordInputFocus){
            if (passwordValidation() == false){
                $("#passInput").next().removeClass("d-none")
                $("#passInput").addClass("is-invalid")
                $("#passInput").removeClass("is-valid")
            } else {
                $("#passInput").next().addClass("d-none")
                $("#passInput").addClass("is-valid")
                $("#passInput").removeClass("is-invalid")
            }
        }

        if (repasswordInputFocus){
            if (repasswordValidation() == false){
                $("#repassInput").next().removeClass("d-none")
                $("#repassInput").addClass("is-invalid")
                $("#repassInput").removeClass("is-valid")
            } else {
                $("#repassInput").next().addClass("d-none")
                $("#repassInput").addClass("is-valid")
                $("#repassInput").removeClass("is-invalid")
            }
        }

        if(
            nameValidation() &&
            emailValidation() &&
            phoneValidation() &&
            ageValidation() &&
            passwordValidation() &&
            repasswordValidation()
        ){
            $("#submitBtn").attr("disabled", false)
        } else {
            $("#submitBtn").attr("disabled", true)
        }
    })
}


function nameValidation(){
    return (/^[a-zA-Z]+$/.test($("#nameInput").val()))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($("#emailInput").val()))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test($("#phoneInput").val()))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|100)$/.test($("#ageInput").val()))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test($("#passInput").val()))
} 

function repasswordValidation() {
    return $("#repassInput").val() == $("#passInput").val()
}





// * Event Listeners

if ($(".nav-list li:nth-child(1)")){
    $(".nav-list li:nth-child(1)").on("click", function(){showSearch(); closeSideNav()})
}

if ($(".nav-list li:nth-child(2)")){
    $(".nav-list li:nth-child(2)").on("click", function(){getCategories(); closeSideNav()})
}

if ($(".nav-list li:nth-child(3)")){
    $(".nav-list li:nth-child(3)").on("click", function(){getArea(); closeSideNav()})
}

if ($(".nav-list li:nth-child(4)")){
    $(".nav-list li:nth-child(4)").on("click", function(){getIngredients(); closeSideNav()})
}

if ($(".nav-list li:nth-child(5)")){
    $(".nav-list li:nth-child(5)").on("click", function(){showContactUs(); closeSideNav()})
}
