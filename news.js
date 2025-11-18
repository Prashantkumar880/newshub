document.addEventListener('DOMContentLoaded', () => {
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

    const country = "in";
    const BASE_URL = "https://saurav.tech/NewsAPI";

    function pushNews(data = []) {
        newsArticles.innerHTML = ""; // Clear previous news
        if (!data.length) {
            newsArticles.innerHTML = `<p style="padding:1rem;">No articles found for this category.</p>`;
            return;
        }
        data.forEach((article_data) => {
            const article = template.content.cloneNode(true);

            const titleEl = article.querySelector(".title");
            const authorEl = article.querySelector(".author");
            const sourceEl = article.querySelector(".source");
            const imgEl = article.querySelector(".image");
            const dateEl = article.querySelector(".date");
            const descEl = article.querySelector(".description");

            titleEl.innerText = article_data.title || "No title";
            authorEl.innerText = article_data.author || "Unknown";
            sourceEl.innerText = (article_data.source && article_data.source.name) || "Unknown";
            imgEl.src = article_data.urlToImage || "https://via.placeholder.com/300x180?text=No+Image";
            imgEl.alt = article_data.title || "news image";
            dateEl.innerText = article_data.publishedAt ? new Date(article_data.publishedAt).toLocaleString() : "";
            descEl.innerText = article_data.description || "";

            newsArticles.appendChild(article);
        });
    }

    async function getNews(category) {
        const top_headlines_api = `${BASE_URL}/top-headlines/category/${category}/${country}.json`;
        console.log("Fetching:", top_headlines_api);
        try {
            const response = await fetch(top_headlines_api);
            if (!response.ok) {
                if (response.status === 404) {
                    console.error("404 Not Found:", top_headlines_api);
                    newsArticles.innerHTML = `<p style="padding:1rem;">API returned 404 (not found). Check the URL or try a different category.</p>`;
                } else {
                    console.error("HTTP error", response.status);
                    newsArticles.innerHTML = `<p style="padding:1rem;">Failed to load news (HTTP ${response.status}).</p>`;
                }
                return;
            }
            const json = await response.json();
            const data = json.articles || [];
            pushNews(data);
        } catch (error) {
            console.error("Error fetching news:", error);
            newsArticles.innerHTML = `<p style="padding:1rem;">Network or CORS error. See console for details.</p>`;
        } finally {
            console.log("Fetch completed.");
        }
    }

    // attach listener once
    categoryFilter.addEventListener("change", (e) => {
        const selectedCategory = e.target.value;
        getNews(selectedCategory);
    });

    // initial load
    getNews(categories[0]);
});
