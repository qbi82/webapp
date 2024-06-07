document.addEventListener('DOMContentLoaded', function () {
    // Load games dynamically
    loadGames();

    // Load cart items
    loadCartItems();
    updateCartCount();

    // Load reviews
    loadReviews();

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

    // Handle clear cart button in dropdown
    document.getElementById('clear-cart-dropdown')?.addEventListener('click', function () {
        clearCart();
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
                <p class="card-text">${game.description.substring(0, 100)}...</p>
                <button class="btn btn-primary view-details" data-id="${game.id}">View Details</button>
                <div class="form-group mt-2">
                  <label for="edition-${game.id}">Choose Edition:</label>
                  <select class="form-control edition-select" id="edition-${game.id}">
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                  </select>
                </div>
                <button class="btn btn-primary add-to-cart" data-id="${game.id}">Add to Cart</button>
              </div>
            </div>
          </div>
        `;
                gameList.innerHTML += gameCard;
            });

            // Add event listeners to "View Details" buttons
            document.querySelectorAll('.view-details').forEach(button => {
                button.addEventListener('click', function () {
                    const gameId = this.getAttribute('data-id');
                    showGameDetails(gameId);
                });
            });

            // Add event listeners to "Add to Cart" buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function () {
                    const gameId = this.getAttribute('data-id');
                    const edition = document.getElementById(`edition-${gameId}`).value;
                    addToCart(gameId, edition);
                });
            });
        })
        .catch(error => console.error('Error fetching games:', error));
}

// Function to show game details in modal
function showGameDetails(gameId) {
    fetch('data/games.json')
        .then(response => response.json())
        .then(games => {
            const game = games.find(g => g.id == gameId);
            const modalBody = document.querySelector('#gameDetailsModal .modal-body');
            modalBody.innerHTML = `
        <img src="${game.image}" class="img-fluid mb-3" alt="${game.title}">
        <h5>${game.title}</h5>
        <p>${game.description}</p>
      `;
            $('#gameDetailsModal').modal('show');
        })
        .catch(error => console.error('Error fetching game details:', error));
}

// Function to load cart items from localStorage
// Function to load cart items from localStorage
function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items-dropdown');
    cartContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p>No items in cart.</p>';
    } else {
        cartItems.forEach(item => {
            const cartItem = `
        <div class="cart-item">
          <p>${item.title} - ${item.edition}</p>
          <button class="btn btn-danger btn-sm remove-from-cart" data-id="${item.id}">Remove</button>
          <select class="form-control form-control-sm edit-cart-item" data-id="${item.id}">
            <option value="Standard" ${item.edition === 'Standard' ? 'selected' : ''}>Standard</option>
            <option value="Deluxe" ${item.edition === 'Deluxe' ? 'selected' : ''}>Deluxe</option>
          </select>
        </div>
      `;
            cartContainer.innerHTML += cartItem;
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function () {
                const gameId = this.getAttribute('data-id');
                removeFromCart(gameId);
            });
        });

        // Add event listeners to edition select elements
        document.querySelectorAll('.edit-cart-item').forEach(select => {
            select.addEventListener('click', function (event) {
                event.preventDefault(); // Prevent the default behavior of the click event
                event.stopPropagation(); // Stop the event from propagating to the document
            });
            select.addEventListener('change', function (event) {
                const gameId = this.getAttribute('data-id');
                const newEdition = this.value;
                updateCartEdition(gameId, newEdition);
            });
        });
    }
}




// Function to add an item to the cart
function addToCart(gameId, edition) {
    fetch('data/games.json')
        .then(response => response.json())
        .then(games => {
            const game = games.find(g => g.id == gameId);
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            cartItems.push({ id: game.id, title: game.title, edition });
            localStorage.setItem('cart', JSON.stringify(cartItems));
            loadCartItems();
            updateCartCount();
            alert(`${game.title} (${edition} Edition) added to cart`);
        })
        .catch(error => console.error('Error adding to cart:', error));
}

// Function to update the edition of a cart item
function updateCartEdition(gameId, newEdition) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.map(item => item.id == gameId ? { ...item, edition: newEdition } : item);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    loadCartItems();
}

// Function to remove an item from the cart
function removeFromCart(gameId) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.id != gameId);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    loadCartItems();
    updateCartCount();
}

// Function to clear the cart
function clearCart() {
    localStorage.removeItem('cart');
    loadCartItems();
    updateCartCount();
}

// Function to update cart count
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').innerText = cartItems.length;
}

// Function to save review to localStorage
function saveReview() {
    const reviewData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        ownsGame: document.getElementById('ownsGame').checked,
        game: document.getElementById('game').value,
        hoursPlayed: document.getElementById('hoursPlayed').value,
        rating: document.getElementById('rating').value,
        review: document.getElementById('review').value,
    };

    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(reviewData);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    alert('Review submitted successfully');
    document.getElementById('review-form').reset();
    loadReviews();
}

// Function to load reviews from localStorage
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const reviewsList = document.getElementById('reviews-list');
    if (reviewsList) {
        reviewsList.innerHTML = '';
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p>No reviews available.</p>';
        } else {
            reviews.forEach((review, index) => {
                const reviewItem = `
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">${review.username}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${review.game} - ${review.rating}/5</h6>
              <p class="card-text">${review.review}</p>
              <p class="card-text"><small class="text-muted">Hours Played: ${review.hoursPlayed}</small></p>
              <button class="btn btn-danger btn-sm remove-review" data-index="${index}">Remove</button>
            </div>
          </div>
        `;
                reviewsList.innerHTML += reviewItem;
            });

            // Add event listeners to remove review buttons
            document.querySelectorAll('.remove-review').forEach(button => {
                button.addEventListener('click', function () {
                    const reviewIndex = this.getAttribute('data-index');
                    removeReview(reviewIndex);
                });
            });
        }
    }
}

// Function to remove a review from localStorage
function removeReview(reviewIndex) {
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.splice(reviewIndex, 1);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    loadReviews();
}


// Function to load selected games for checkout
function loadSelectedGamesForCheckout() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const selectedGamesContainer = document.getElementById('selected-games');
    selectedGamesContainer.innerHTML = '';

    if (cartItems.length === 0) {
        selectedGamesContainer.innerHTML = '<p>No games selected.</p>';
    } else {
        cartItems.forEach(item => {
            const selectedGame = `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">Edition: ${item.edition}</p>
                    </div>
                </div>
            `;
            selectedGamesContainer.innerHTML += selectedGame;
        });
    }
}

// Call the function to load selected games when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    loadSelectedGamesForCheckout();
});
