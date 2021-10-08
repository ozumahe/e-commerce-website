// slider
const slider = document.getElementById("slide");
const img = document.getElementById("img");
let i = 0;
function sliderFunction() {
  i++;
  if (i > 3) {
    i = 1;
  }
  img.src = `images/img${i}.jpg`;
}
setInterval(sliderFunction, 5000);
// end of slider.....

//element getters
function __Id(id) {
  return document.getElementById(id);
}
const goodsContainer = __Id("goods-container");
const popUp = __Id("pop-up");
const popUpContainer = __Id("pop-up-container");

// Api fetcher
async function mainFetcher() {
  const rep = await fetch("https://fakestoreapi.com/products");
  const repsData = await rep.json();
  loadGoods(repsData);
  console.log(repsData);
}
mainFetcher();
// preloader for the Goods
const template = document.querySelector("template");
for (let i = 0; i < 10; i++) {
  //Clone the Template
  goodsContainer.append(template.content.cloneNode(true));
}

//saerch .....//////
const searchBtn = __Id("search-btn");
let input = __Id("input");

searchBtn.addEventListener("click", () => {
  let inputValue = input.value;
  getItem(inputValue);
  input.value = "";
});

// cartgory button....
const categoryContainer = __Id("category");

async function cartgory() {
  const res = await fetch("http://fakestoreapi.com/products");
  const results = await res.json();

  const category = results.reduce(
    function (value, item) {
      if (!value.includes(item.category)) {
        value.push(item.category);
      }
      return value;
    },
    ["all"]
  );

  const categoryBtns = category
    .map((result) => {
      return `
        <button class="category-button" data-id=${result}>${result}</button>
    `;
    })
    .join("");
  categoryContainer.innerHTML = categoryBtns;
  const filterBtn = document.querySelectorAll(".category-button");

  filterBtn.forEach(function (btn) {
    btn.addEventListener("click", (e) => {
      console.log(e.currentTarget.dataset.id);
      if (e.currentTarget.dataset.id == "all") {
        mainFetcher();
      } else {
        getItem(e.currentTarget.dataset.id);
      }
    });
  });
}
cartgory();

// end cartgory button....

async function getItem(item) {
  const res = await fetch(`http://fakestoreapi.com/products/category/${item}`);
  const result = await res.json();
  console.log(result);
  loadGoods(result);
}
//saerch .....//////

function loadGoods(data) {
  // Clear
  goodsContainer.innerHTML = "";
  data.forEach((data) => {
    const goods = document.createElement("div");
    goods.classList.add("goods");

    // calculate rate
    const goodsRating = data.rating.rate;
    const nomRate = 5;
    const calculateRate = (goodsRating / nomRate) * 100;
    // end calculate rate

    goods.id = data.id;
    goods.innerHTML = `
      <div id=${data.id}>
           <img src=${data.image} alt="img" />
        <p class="title">${data.title}</p>
        <div class="info">
          <h5 class="price">$${data.price}</h5>
          <div class="outer-star">
            <i class="fa fa-star" aria-hidden="true"></i>
            <i class="fa fa-star" aria-hidden="true"></i>
            <i class="fa fa-star" aria-hidden="true"></i>
            <i class="fa fa-star" aria-hidden="true"></i>
            <i class="fa fa-star" aria-hidden="true"></i>
            <div class="inner-star" id="inner-star" style="width:${calculateRate}%;">
              <i class="fa fa-star" aria-hidden="true"></i>
              <i class="fa fa-star" aria-hidden="true"></i>
              <i class="fa fa-star" aria-hidden="true"></i>
              <i class="fa fa-star" aria-hidden="true"></i>
              <i class="fa fa-star" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        </div>
        `;
    const title = document.querySelectorAll(".title");
    for (let i = 0; i < title.length; i++) {
      if (title[i].innerHTML.length > 15) {
        title[i].innerHTML = title[i].innerHTML.slice(0, 25) + "...";
      }
    }

    // console.log(calculateRate);

    goodsContainer.appendChild(goods);
    goods.addEventListener("click", () => {
      showGoodsDetails(data, calculateRate);
    });
  });
}
function showGoodsDetails(data, calculateRate) {
  console.log(data);
  popUpContainer.innerHTML = "";
  const showDetailsContainer = document.createElement("div");
  showDetailsContainer.innerHTML = `
        <div class="show-details">
          <div class="img-container">
            <img src=${data.image} alt="img1" />
          </div>
          <div class="details-container">
            <p class="details-name">
              ${data.title}
            </p>
            <div class="outer-star star">
              <i class="fa fa-star" aria-hidden="true"></i>
              <i class="fa fa-star" aria-hidden="true"></i>
              <i class="fa fa-star" aria-hidden="true"></i>
              <i class="fa fa-star" aria-hidden="true"></i>
              <i class="fa fa-star" aria-hidden="true"></i>
              <div class="inner-star" style="width:${calculateRate}%;>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
              </div>
            </div>
            <h2 class="details-price">$${data.price}</h2>
            <p class="details">
              ${data.description}
            </p>
            <button>Add to cart</button>
          </div>
        </div>
        
    `;
  popUpContainer.appendChild(showDetailsContainer);
  popUp.classList.add("hide");
}
const closePopup = document.getElementById("close-popup");
closePopup.addEventListener("click", () => {
  popUp.classList.remove("hide");
});

window.addEventListener("scroll", () => {
  const winHeight = window.pageYOffset;
  const search = document.querySelector(".search");
  const searchHeight = search.getBoundingClientRect().height;

  if (winHeight > searchHeight) {
    search.classList.add("fixed");
  } else {
    search.classList.remove("fixed");
  }
});
