import * as bootstrap from "bootstrap";

const nav = document.querySelector(".navbar");
const hadithSection = document.querySelector(".hadith");
const btnStart = document.querySelector(".btn-start");
const hadithText = document.querySelector(".hadith__text");
const btnNext = document.querySelector(".btn--next");
const btnPrev = document.querySelector(".btn--prev");
const hadithPage = document.querySelector(".hadith__page");
let hadithIndex = 0;

const navbarNav = document.querySelector(".navbar-nav");

const quranContainer = document.querySelector(".quran .container .row");

const popup = document.querySelector(".popup");
const popupAyat = document.querySelector(".popup__ayat");
const popupClose = document.querySelector(".popup__close");

const prayContainer = document.querySelector(".pray .container .row ");

const scrollTopBtn = document.querySelector(".scroll--btn");

const spinner = document.querySelector(".spinner");

// ! navbar background on SCOLL
window.addEventListener("scroll", () => {
  window.scrollY > 150
    ? nav.classList.add("active")
    : nav.classList.remove("active");

  window.scrollY > 500
    ? scrollTopBtn.classList.add("active")
    : scrollTopBtn.classList.remove("active");
});

// ! scroll to top
scrollTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ? scroll to hadith sec
btnStart.addEventListener("click", () => {
  hadithSection.scrollIntoView({
    behavior: "smooth",
  });
});

// ? scroll to sections
navbarNav.addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav-link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// ? fade animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav-link")) {
    const link = e.target;
    const siblings = link.closest(".navbar").querySelectorAll(".nav-link");
    const logo = link.closest(".navbar").querySelector(".navbar-brand");

    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// ? render spinner

const renderSpinner = function (parent) {
  const html = `
  <div class="lds-spinner">
   <div></div>
   <div></div>
   <div></div>
   <div></div>
   <div></div>
   <div></div>
   <div></div>
   <div></div>
   <div></div>
   <div></div>
   <div></div>
   <div></div>
  </div>
  `;

  parent.innerHTML = "";
  parent.insertAdjacentHTML("beforeend", html);
};

// ! fetch hadith API
const hadithApi = async function () {
  try {
    const res = await fetch(
      "https://api.hadith.sutanlab.id/books/muslim?range=1-300"
    );

    const data = await res.json();

    const hadiths = data.data.hadiths;

    hadithText.innerHTML = hadiths[hadithIndex].arab;

    const hadithChange = function () {
      hadithText.innerHTML = hadiths[hadithIndex].arab;
      hadithPage.innerHTML = `300 - ${hadithIndex + 1}`;
    };
    hadithChange();

    btnNext.addEventListener("click", () => {
      hadithIndex === 299 ? (hadithIndex = 0) : hadithIndex++;
      hadithChange();
    });

    btnPrev.addEventListener("click", () => {
      hadithIndex === 0 ? (hadithIndex = 299) : hadithIndex--;
      hadithChange();
    });
  } catch (error) {
    error = "only range between 1 and 300";
    hadithText.innerHTML = error;
  }
};

hadithApi();

// // ? fetch quran API

const quranApi = async function () {
  const res = await fetch("https://api.quran.sutanlab.id/surah");

  const data = await res.json();

  quranContainer.innerHTML = "";
  data.data.forEach((surah) => {
    const html = `
      <div class="col">
       <div class="quran__text">
          <h3 class="heading-secondary">${surah.name.long}</h3>
          <p class="text-primary text-primary--dark">${surah.name.transliteration.id}</p>
        </div>
       </div>
          `;
    quranContainer.insertAdjacentHTML("beforeend", html);
  });

  const surahContainer = quranContainer.querySelectorAll(".quran__text");

  surahContainer.forEach((title, index) => {
    title.addEventListener("click", function () {
      spinner.classList.add("active");
      fetch(`https://api.quran.sutanlab.id/surah/${index + 1}`)
        .then((res) => res.json())
        .then((data) => {
          popupAyat.innerHTML = "";
          const ayat = data.data.verses;
          ayat.forEach((aya) => {
            popup.classList.add("active");
            const html = `
          <p class="popup__text"> (${aya.number.inSurah}) - ${aya.text.arab} </p>
          `;

            spinner.classList.remove("active");
            popupAyat.insertAdjacentHTML("beforeend", html);
          });
        });
    });
  });
  popupClose.addEventListener("click", function () {
    popup.classList.remove("active");
  });
};

renderSpinner(quranContainer);
quranApi();

// ! fetch quran API

const prayApi = function () {
  fetch(
    "https://api.aladhan.com/v1/timingsByCity?city=cairo&country=egypt&method=8"
  )
    .then((res) => res.json())
    .then((data) => {
      const { timings } = data.data;

      prayContainer.innerHTML = "";
      for (let key in timings) {
        if (timings.hasOwnProperty(key)) {
          const html = `
              <div class="col">
              <div class="pray__box">
              <div class="pray__box--circle">
                    <svg>
                    <circle cx="100" cy="100" r="100"></circle>
                    </svg>
                    <div class="pray__box--time">${timings[key]}</div>
                    </div>
                    <p class="pray__box--text">${key}</p>
                    </div>
              </div>
              `;

          prayContainer.insertAdjacentHTML("beforeend", html);
        }
      }
    });
};

renderSpinner(prayContainer);
prayApi();
