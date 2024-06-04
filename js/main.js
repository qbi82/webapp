document.addEventListener('DOMContentLoaded', function () {
    // Load games dynamically
    loadGames();

    // Handle review form submission
    document.getElementById('review-form')?.addEventListener('submit', function (event) {
        event.preventDefault();
        saveReview();
    });

    // Handle contact form submission
    document.getElementById('contact-form')?.addEventListener('submit', function (event) {
        event.preventDefault();
        alert('Message sent successfully!');
    });
});

// Function to load games dynamically
function loadGames() {
    fetch('data/games.json')
        .then(response => response.json())
        .then(games => {
            const gameList = document.getElementById('game-list');
            games.forEach(game => {
                const gameCard = `
          <div class="col-md-4">
            <div class="card">
              <img src="${game.image}" class="card-img-top" alt="${game.title}">
              <div class="card-body">
                <h5 class="card-title">${game.title}</h5>
                <p class="card-text">${game.description}</p>
                <a href="game-details.html?id=${game.id}" class="btn btn-primary">View Details</a>
              </div>
            </div>
          </div>
        `;
                gameList.innerHTML += gameCard;
            });
        })
        .catch(error => console.error('Error fetching games:', error));
}

// Function to save review to localStorage
function saveReview() {
    const reviewData = {
        username: document.getElementById('username').value,
        game: document.getElementById('game').value,
        rating: document.getElementById('rating').value,
        review: document.getElementById('review').value,
    };

    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(reviewData);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    alert('Review submitted successfully');
    document.getElementById('review-form').reset();
}
