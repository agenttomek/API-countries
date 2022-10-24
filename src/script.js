const countryContainer = document.querySelector(".search__country__container");
const inputSearch = document.querySelector(".search__input--text");
const inputSelect = document.querySelector(".search__input--select");
const btnDarkMode = document.querySelector(".header__dark-box");
const header = document.querySelector(".header__box");
const content = document.querySelector(".content");
const searchContainer = document.querySelector(".search__content");
const inputsContainer = document.querySelector(".search__box");
const modalContainer = document.querySelector(".country__modal");

const fetchingAPI = async function (api) {
  try {
    const fetching = await fetch(api);
    data = await fetching.json();
    data.forEach(function (element, i) {
      element.id = i;
    });
    renderCountry(data);
    searchForCountry(data);
    searchRegion(data);
    getDataCountry(data);
  } catch (error) {
    noResults("Could'nt download data.");
  }
};
fetchingAPI("https://restcountries.com/v3.1/all");

const renderCountry = function (data) {
  data.forEach((country) => {
    const html = `<div class="search__country" data-country="${country.id}">
            <div class="search__country__img-box">
              <img
                src="${country.flags.png}"
                alt="country flag"
                class="search__country__img"
              />
            </div>
            <div class="search__country__text-box">
              <h2 class="search__country__heading">${country.name.common}</h2>
              <ul class="search__country__list">
                <li class="search__country__item">
                  <span class="search__country__span">Population:</span> ${country.population.toLocaleString()}
                </li>
                <li class="search__country__item">
                  <span class="search__country__span">Region:</span> ${
                    country.region
                  }
                </li>
                <li class="search__country__item">
                  <span class="search__country__span">Capital:</span> ${
                    country.capital ? country.capital[0] : "Unknown"
                  }
                </li>
              </ul>
            </div>
          </div>`;
    countryContainer.insertAdjacentHTML("beforeend", html);
  });
};

const noResults = function (message) {
  const errorMessage = document.createElement("p");
  errorMessage.className = "error__message";
  errorMessage.textContent = message;
  countryContainer.appendChild(errorMessage);
};

const searchRegion = function (data) {
  inputSelect.addEventListener("change", function () {
    let inputValue = inputSelect.value;
    countryContainer.innerHTML = "";
    inputSearch.value = "";

    const filter = data.filter((el) => el.region === inputValue);

    renderCountry(filter);

    if (header.classList.contains("active__text-color")) renderDarkDom();
  });
};

const searchForCountry = function (data) {
  inputSearch.addEventListener("input", function () {
    let inputValue = inputSearch.value;
    let selectValue = inputSelect.value;
    countryContainer.innerHTML = "";
    const filter = data.filter((el) =>
      el.name.common.toLowerCase().includes(inputValue) &&
      selectValue !== "Filter by region"
        ? el.region === selectValue
        : el.name.common.toLowerCase().includes(inputValue)
    );
    filter.length === 0
      ? noResults("There is no such a country.")
      : renderCountry(filter);
    checkDomDarkMode();
  });
};

const switchToDarkMode = function () {
  content.classList.toggle("active__page-bg");
  document.querySelectorAll(".search__country").forEach((el) => {
    el.classList.toggle("active__country-bg");
  });
  inputSearch.style.backgroundColor = "white";
  header.classList.toggle("active__text-color");
  document
    .querySelector(".header__dark-icon")
    .classList.toggle("active__icon-filter");
  if (document.querySelector(".error__message")) {
    document
      .querySelector(".error__message")
      .classList.toggle("active__text-color");
  }
  if (document.querySelector(".country__modal__text-box")) {
    document
      .querySelector(".country__modal__text-box")
      .classList.toggle("active__text-color");
  }
};

const renderDarkDom = function () {
  if (document.querySelector(".country__modal__text-box")) {
    document
      .querySelector(".country__modal__text-box")
      .classList.add("active__text-color");
  }
  document.querySelectorAll(".search__country").forEach((el) => {
    el.classList.add("active__country-bg");
  });
  if (document.querySelector(".error__message")) {
    document
      .querySelector(".error__message")
      .classList.add("active__text-color");
  }
};

btnDarkMode.addEventListener("click", function () {
  switchToDarkMode();
});

const getDataCountry = function (data) {
  countryContainer.addEventListener("click", function (e) {
    const clicked = e.target.closest(".search__country");
    if (!clicked || undefined) return;
    countryContainer.style.display = "none";
    inputsContainer.style.display = "none";
    checkDomDarkMode();
    const filter = [];
    data.filter((el) =>
      el.id === +clicked.dataset.country ? filter.push(el) : ""
    );
    renderCountryData(filter[0]);
  });
};

const renderCountryData = function (data) {
  const native = Object.keys(data.name.nativeName).slice(0, 1).join("");
  const curr = Object.keys(data.currencies).slice(0, 1).join("");

  const html = `<div class="country__modal__content container">
  <button class="country__modal__btn">&larr; Back</button>
  <div class="country__modal">
    <div class="country__modal__img-box">
      <img src="${
        data.flags.png
      }" alt="flag" class="country__modal__img" loading="lazy"/>
    </div>
    <div class="country__modal__text-box">
      <h2 class="country__modal__heading">${data.name.common}</h2>
      <div class="country__modal__list-box">
        <ul class="country__modal__list">
          <li class="country__modal__list__item">
            <strong>Native Name: </strong>${
              data.name.nativeName[native].official
            }
          </li>
          <li class="country__modal__list__item">
            <strong>Population: </strong>${data.population.toLocaleString()}
          </li>
          <li class="country__modal__list__item">
            <strong>Region: </strong>${data.region}
          </li>
          <li class="country__modal__list__item">
            <strong>Sub Region: </strong>${data.subregion}
          </li>
          <li class="country__modal__list__item">
            <strong>Capital: </strong>${data.capital}
          </li>
        </ul>
        <ul class="country__modal__list">
          <li class="country__modal__list__item">
            <strong>Top Level Domain: </strong>${data.tld[0]}
          </li>
          <li class="country__modal__list__item">
            <strong>Currencies: </strong>${data.currencies[curr].name}
          </li>
          <li class="country__modal__list__item">
            <strong>Languages: </strong>${Object.values(data.languages).join(
              " "
            )}
          </li>
        </ul>
      </div>
      <div class="country__modal__borders__box">
      <p class="country__modal__borders__text">Border Countries:</p>
      <ul class="country__modal__borders">
        
        
      </ul>
      </div>
    </div>
  </div>
  </div>`;
  modalContainer.insertAdjacentHTML("beforeend", html);
  checkDomDarkMode();
  if (data.borders) {
    data.borders.forEach((el) => {
      const border = document.createElement("li");
      console.log(border);
      border.textContent = el;
      border.className = "country__modal__border";
      document.querySelector(".country__modal__borders").appendChild(border);
    });
  } else {
    const border = document.createElement("li");
    console.log(border);
    border.textContent = "No border countires.";
    border.className = "country__modal__noBorder";
    document.querySelector(".country__modal__borders").appendChild(border);
  }
  document
    .querySelector(".country__modal__btn")
    .addEventListener("click", function () {
      countryContainer.style.display = "grid";
      inputsContainer.style.display = "flex";
      modalContainer.innerHTML = "";
    });
};

const checkDomDarkMode = function () {
  if (header.classList.contains("active__text-color")) renderDarkDom();
};
