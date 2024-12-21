const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const userConatiner = document.querySelector('.Weather-Container');

const grantAccessContainer = document.querySelector('.grant-location-container');
const searchForm = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.loading-container');
const  userInfoContainer = document.querySelector('.user-info-container');

// initially variable need ??

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

// ek kaam aur pending hai...

function switchTab(newTab){
    if(newTab!=oldTab) {
       oldTab.classList.remove("current-tab");
       oldTab = newTab;
       oldTab.classList.add("current-tab");

       if(!searchForm.classList.contains("active")){
        // kya search form wala container is invisible if yes then make it visible
         userInfoContainer.classList.remove("active");
         grantAccessContainer.classList.remove("active");
         searchForm.classList.add("active");
       }
       
       else {
        // main phele search wale tab pr tha ab your weather tab visible karna hai
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        // ab mai your weather tab me aagaya hu, toh weather bhi display karna padega, so let's check lacal storage first
        // for coordiantes, if we haved saved them there.
        getfromSessionStorage();
       }
    }
}

userTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(userTab);
});

userTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(searchTab);
});

//  check if cordinates are already present in session storage
function getfromSessionStorage(){
      const localCoordinates = sessionStorage.getItem("user-coordinates");    
      if(!localCoordinates){
        //  agar local coordiantes nhi mile 
        grantAccessContainer.classList.add("active");
      }

      else{
          const coordiantes = JSON.parse(localCoordinates);
          fetchUserWeatherInfo(coordiantes);
      }
}

async function fetchUserWeatherInfo(coordiantes){
    const {lat,lon} = coordiantes;
    // make garantcontainer invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    //  API CALL
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        //  home work
    }
}

function renderWeatherInfo(weatherInfo){
    // firstly, we have to fetch the elements
    const cityName =   document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-contryIcon]");
    const desc  = document.querySelector("[data-weatherDesc]");
    const weatherIcon  = document.querySelector("[data-WeatherIcon]");
    const temp = document.querySelector("[data-Temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values from weatherInfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweatherma.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

     
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //  hW - show an alert for no geolocation support available
    }
}

function showPosition(position){
    const userCoordinates = {
        let: position.coords.latitude,
        lon: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates) );
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" , getLocation);

let searchInput = document.querySelector("[data-serachInput]");

searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName==="") return;
    else fetchUserWeatherInfo(cityName);
});

async function fetchUserWeatherInfo(city){
      loadingScreen.classList.add("active");
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");

      try{
            const response =  await fetch (
               `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );

            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
      }

      catch(err){

      }
}