const mainSection = document.getElementById("data-list-wrapper");
const cartItems = {};

// Fetch and render cards
function detafrtch() {
  // Use static db.json for both local and production
  fetch('./db.json')
    .then((res) => res.json())
    .then((data) => renderCard(data.products))
    .catch((err) => console.log(err));
}
detafrtch();

function renderCard(deta) {
  let newdeta = deta.map((el) =>
    card(el.id, el.title, el.image, el.priceLabel, el.category || "", el.price || "", el.rating || 0, el.ratingCount || 0)
  ).join("");
  mainSection.innerHTML = newdeta;
}

function card(id, title, image, priceLabel, category, price, rating, ratingCount) {
  return `
    <div class="card" data-id="${id}">
        <div class="card-img">
            <img src="${image || 'https://via.placeholder.com/300x100'}" alt="Product">
        </div>
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-founder">${priceLabel}</p>
            <p class="card-category">${category}</p>
            <p class="card-price">${price ? `$${price}` : ""}</p>
            <div class="stars">
              ${getStars(rating)} 
              <span class="rating-number">${rating.toFixed(1)}</span> 
              <span class="rating-count">(${ratingCount})</span>
            </div>
            <div class="edit-btn mt-2">
              <button class="btn btn-sm " onclick='addToCart(${JSON.stringify({ id, title, image, priceLabel, category, price, rating, ratingCount })})'>
                ADD TO CART <i class="ri-shopping-cart-2-line"></i>
              </button>
            </div>
        </div>
    </div>`;
}

function getStars(rating) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  let starsHtml = '';
  for (let i = 0; i < fullStars; i++) starsHtml += '★';
  for (let i = 0; i < emptyStars; i++) starsHtml += '☆';
  return starsHtml;
}

// Scroll functionality
const track = document.getElementById("data-list-wrapper");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const scrollStep = 150;

rightBtn.addEventListener("click", () => {
  track.scrollBy({ left: scrollStep, behavior: "smooth" });
});

leftBtn.addEventListener("click", () => {
  track.scrollBy({ left: -scrollStep, behavior: "smooth" });
});

function addToCart(product) {
  const { id, priceLabel } = product;

  const price = product.price || parseFloat(priceLabel?.replace(/[^0-9.]/g, "") || 0);

  if (cartItems[id]) {
    cartItems[id].quantity += 1;
  } else {
    cartItems[id] = { ...product, price, quantity: 1 };
  }

  renderCart();
}

function renderCart() {
  const cartContainer = document.getElementById("cart-detail");
  cartContainer.innerHTML = "";

  let total = 0;
  let itemCount = 0;

  Object.values(cartItems).forEach(item => {
    const { id, title, image, price, quantity } = item;
    const itemTotal = price * quantity;
    total += itemTotal;
    itemCount += quantity;

    const cartHTML = `
        <div class="cart-card" data-id="${id}">
          <img src="${image}" alt="Product">
          <div class="cart-details">
            <p class="cart-title">${title}</p>
            <div class="quantity-controls">
              <button class="btn btn-sm btn-outline-light" onclick="updateQuantity(${id}, -1)">-</button>
              <span>${quantity}</span>
              <button class="btn btn-sm btn-outline-light" onclick="updateQuantity(${id}, 1)">+</button>
            </div>
            <p>$${itemTotal.toFixed(2)}</p>
          </div>
          <span class="delete-btn" onclick="removeItem(${id})">🗑️</span>
        </div>
      `;
    cartContainer.insertAdjacentHTML("beforeend", cartHTML);
  });

  if (itemCount > 0) {
    cartContainer.insertAdjacentHTML("beforeend", `
        <div class="subtotal-section">
          <span>SUBTOTAL (${itemCount} items)</span>
          <span>$${total.toFixed(2)}</span>
        </div>
        <button class="btn  mt-2" id="buttonch">CHECKOUT</button>
      `);
  }

  const offcanvas = bootstrap.Offcanvas.getOrCreateInstance('#offcanvasRight');
  offcanvas.show();
}

function updateQuantity(id, delta) {
  if (!cartItems[id]) return;
  cartItems[id].quantity += delta;
  if (cartItems[id].quantity <= 0) delete cartItems[id];
  renderCart();
}

function removeItem(id) {
  delete cartItems[id];
  renderCart();
}





const slides = document.querySelectorAll('.slide');
const pagination = document.getElementById('pagination');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
  pagination.textContent = `${index + 1}/${slides.length}`;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}



let scrollCount = 0;
const maxScrolls = 5;

$('.filtering').slick({
  slidesToShow: 5,
  slidesToScroll: 5,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: true,
  dots: false
});

$('.filtering').on('afterChange', function (event, slick, currentSlide) {
  scrollCount++;
  if (scrollCount >= maxScrolls) {
    $('.filtering').slick('slickPause');
  }
});

var filtered = false;

$('.js-filter').on('click', function () {
  if (filtered === false) {
    $('.filtering').slick('slickFilter', ':even');
    $(this).text('Unfilter Slides');
    filtered = true;
  } else {
    $('.filtering').slick('slickUnfilter');
    $(this).text('Filter Slides');
    filtered = false;
  }
});






// shop flavors


const toggles = document.querySelectorAll('.dropdown-toggle');
const dropdowns = document.querySelectorAll('.dropdown-menu');
const resetLinks = document.querySelectorAll('.reset');

toggles.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    dropdowns.forEach((d, j) => {
      if (i === j) {
        d.style.display = d.style.display === 'block' ? 'none' : 'block';
      } else {
        d.style.display = 'none';
      }
    });
  });
});

resetLinks.forEach((link, i) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const checkboxes = dropdowns[i].querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    dropdowns[i].querySelector('.dropdown-header span').textContent = '0 selected';
  });
});

dropdowns.forEach(menu => {
  const checkboxes = menu.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const count = Array.from(checkboxes).filter(cb => cb.checked).length;
      menu.querySelector('.dropdown-header span').textContent = `${count} selected`;
    });
  });
});

// Close dropdowns if clicked outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown-container')) {
    dropdowns.forEach(d => d.style.display = 'none');
  }
});

