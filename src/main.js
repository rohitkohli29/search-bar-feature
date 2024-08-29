import "./style.css";
import { getProduct } from "./utils/fetchProducts";
import Fuzzy from "fuse.js";

document.addEventListener("DOMContentLoaded", async function () {
  const cardContainer = document.getElementById("card_container");
  const searchBar = document.getElementById("search-bar");

  async function displayProducts(productsToDisplay, query) {
    cardContainer.innerHTML = "";

    if (productsToDisplay.length == 0) {
      cardContainer.innerHTML = `<h1>No Such Products for <span class="underline text-red-400">${query}</span></h1>`;
      return;
    }

    productsToDisplay.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className =
        "bg-white p-4 sm:w-auto w-full border border-gray-200 rounded-lg shadow-lg max-w-xs";

      productCard.innerHTML = `
            <img src="${product.image_url}" alt="${product.description}" class="w-full h-48 object-cover rounded-t-lg mb-4">
            <p class="text-base  mb-2">${product.description}</p>
            <h3 class="text-sm text-gray-600 font-semibold mb-2">${product.category}</h3>
            <span class="text-xl font-bold">$${product.price}</span>
        `;

      cardContainer.appendChild(productCard);
    });
  }

  try {
    cardContainer.innerHTML = "<h1>Loading...</h1>";
    const products = await getProduct("products");
    cardContainer.innerHTML = "";
    displayProducts(products);

    searchBar.addEventListener("input", (e) => {
      if (e.target.value.length < 3 && e.target.value.length != 0) return;

      const query = e.target.value.toLowerCase();

      const searcher = new Fuzzy(products, {
        isCaseSensitive: false,
        threshold: 0.3,
        distance: 100,
        keys: ["description", "category"],
      });

      let filteredProducts = searcher.search(query).map(result => result.item);
      
      if(filteredProducts.length == 0 && e.target.value == ""){
          filteredProducts = products;
      }

      displayProducts(filteredProducts, e.target.value);
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
});
