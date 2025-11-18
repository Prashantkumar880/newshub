const template = document.getElementById("article-template");
const categoryFilter = document.getElementById("category-filter");
const searchBar = document.getElementById("search-bar");
const newsArticles = document.getElementById("news-articles");

const categories = [
    "general",
    "business",
    "entertainment",
    "health",
    "science",
    "sports",
    "technology",
];

categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.append(option);
});

// const category = categoryFilter.value;
const country = "in";
// console.log("-> ", category);
fetch;

const BASE_URL = "https://saurav.tech/NewsAPI";

function pushNews(data = []) {
    newsArticles.innerHTML = ""; // Clear previous news
    console.log("Data Received : ", data);
    data.forEach((article_data) => {
        const article = template.content.cloneNode(true);
        article.querySelector(".title").innerText = article_data.title;
        article.querySelector(".author").innerText = article_data.author;
        article.querySelector(".source").innerText = article_data.source.name;
        article.querySelector(".image").src = article_data.urlToImage;
        article.querySelector(".image").alt = article_data.title;
        article.querySelector(".date").innerText = new Date(
            article_data.publishedAt
        ).toLocaleString();
        article.querySelector(".description").innerText = article_data.description;
        newsArticles.append(article);
    });
}

async function getNews(category) {
    try {
        const top_headlines_api = `${BASE_URL}/top-headlines/category/${category}/${country}.json`;
        const response = await fetch(top_headlines_api);
        const data = (await response.json()).articles;
        pushNews(data);
        categoryFilter.addEventListener("change", (e) => {
            const selectedCategory = e.target.value;
            console.log("Selected Category: ", selectedCategory);
            getNews(selectedCategory);
        });
        // document.getElementById("news-container").innerHTML = ""; // Clear previous news
    } catch (error) {
        console.error("Error fetching news:", error);
    } finally {
        console.log("Fetch completed.");
    }
}

getNews(categories[0]);


//npm run dev
//import tailwindcss from tailwindcss/vite