document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById("menuIcon");
  const navLinks = document.querySelector(".nav-links");
  const navIcon = menuIcon ? menuIcon.querySelector("i") : null;
  const buttons = document.querySelectorAll("button:not(.menu-icon):not(.close-modal):not(.add-to-cart-btn):not(.video-btn)");
  const links = document.querySelectorAll(".nav-links a");
  const contactForm = document.querySelector(".contact form");
  const animatedElements = document.querySelectorAll(".fade-up");
  const cartCount = document.getElementById("cartCount");

  // Product modal elements
  const modal = document.getElementById("productModal");
  const productCloseModal = document.querySelector(".product-close");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalPrice = document.getElementById("modalPrice");
  const addToCartBtn = document.getElementById("addToCartBtn");

  // Video modal elements
  const videoBtn = document.querySelector(".video-btn");
  const videoModal = document.getElementById("videoModal");
  const heroVideo = document.getElementById("heroVideo");
  const videoCloseModal = document.querySelector(".video-close");
  const closeModalButtons = document.querySelectorAll(".close-modal");

  // Collection items
  const collectionItems = document.querySelectorAll(".collection-item");

  function getCartItems() {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  }

  function saveCartItems(items) {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }

  function updateCartCount() {
    if (!cartCount) return;
    const count = getCartItems().reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
  }

  function addProductToCart(product) {
    const items = getCartItems();
    const existing = items.find((item) => item.name === product.name);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }

    saveCartItems(items);
    updateCartCount();
  }

  function renderCartPage() {
    const cartContainer = document.querySelector(".cart-items");
    const cartTotalEl = document.getElementById("cartTotal");
    const cartEmpty = document.querySelector(".cart-empty");
    const cartSummary = document.querySelector(".cart-summary");

    if (!cartContainer || !cartTotalEl || !cartEmpty || !cartSummary) return;

    const items = getCartItems();
    cartContainer.innerHTML = "";

    if (items.length === 0) {
      cartEmpty.style.display = "block";
      cartSummary.style.display = "none";
      return;
    }

    cartEmpty.style.display = "none";
    cartSummary.style.display = "flex";

    let total = 0;
    items.forEach((item, index) => {
      const itemTotal = parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity;
      total += itemTotal;

      const itemCard = document.createElement("div");
      itemCard.className = "cart-item";
      itemCard.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p class="price">${item.price}</p>
          <p>Quantity: ${item.quantity}</p>
        </div>
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;

      cartContainer.appendChild(itemCard);
    });

    cartTotalEl.textContent = `$${total.toFixed(2)}`;

    cartContainer.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        const items = getCartItems();
        items.splice(index, 1);
        saveCartItems(items);
        updateCartCount();
        renderCartPage();
      });
    });
  }

  updateCartCount();

  if (menuIcon && navLinks && navIcon) {
    menuIcon.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      navIcon.classList.toggle("fa-bars");
      navIcon.classList.toggle("fa-xmark");
    });
  }

  // BUTTON CLICK HANDLERS
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonText = button.innerText.toLowerCase();

      if (buttonText.includes("buy now") || buttonText.includes("get started") ||
          buttonText.includes("order now")) {
        window.location.href = "products.html";
      } else {
        console.log(`${button.innerText} clicked`);
      }
    });
  });

  if (videoBtn) {
    videoBtn.addEventListener("click", () => {
      if (videoModal && heroVideo) {
        videoModal.style.display = "block";
        heroVideo.currentTime = 0;
        heroVideo.play();
        document.body.style.overflow = "hidden";
      }
    });
  }

  // COLLECTION ITEM CLICK HANDLERS
  if (collectionItems) {
    collectionItems.forEach((item) => {
      item.addEventListener("click", () => {
        const img = item.querySelector("img");
        const name = item.dataset.name;
        const description = item.dataset.description;
        const price = item.dataset.price;

        if (modal && modalImage && modalTitle && modalDescription && modalPrice) {
          modalImage.src = img.src;
          modalImage.alt = img.alt;
          modalTitle.textContent = name;
          modalDescription.textContent = description;
          modalPrice.textContent = price;

          modal.style.display = "block";
          document.body.style.overflow = "hidden";
        }
      });
    });
  }

  // MODAL CLOSE HANDLERS
  if (closeModalButtons.length > 0) {
    closeModalButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (modal) {
          modal.style.display = "none";
        }
        if (videoModal) {
          videoModal.style.display = "none";
        }
        if (heroVideo) {
          heroVideo.pause();
        }
        document.body.style.overflow = "auto";
      });
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }

  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) {
        videoModal.style.display = "none";
        document.body.style.overflow = "auto";
      }
      if (heroVideo) {
        heroVideo.pause();
      }
    });
  }

  // ADD TO CART FUNCTIONALITY
  if (addToCartBtn) {
    addToCartBtn.onclick = () => {
      if (!modal || !modalTitle || !modalDescription || !modalPrice || !modalImage) return;

      const product = {
        name: modalTitle.textContent,
        description: modalDescription.textContent,
        price: modalPrice.textContent,
        image: modalImage.src,
      };

      addProductToCart(product);
      alert(`${product.name} added to cart!`);

      // Close modal after adding to cart
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    };
  }

  if (window.location.pathname.endsWith("cart.html") || window.location.pathname.endsWith("/cart.html")) {
    renderCartPage();
  }

  // SMOOTH SCROLL
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (href.startsWith("#")) {
        e.preventDefault();
        const section = document.querySelector(href);

        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }

        if (navLinks && navIcon) {
          navLinks.classList.remove("active");
          navIcon.classList.add("fa-bars");
          navIcon.classList.remove("fa-xmark");
        }
      }
      // If href includes index.html, let it navigate normally
    });
  });

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thanks for your message! We will reply soon.");
      contactForm.reset();
    });
  }

  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver(
      (entries, observe) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observe.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    animatedElements.forEach((element) => {
      element.classList.add("visible");
    });
  }
});
