<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Rhockstar Nation</title>
<link rel="stylesheet" href="style.css">
</head>

<body>

<!-- NAVBAR -->
<header class="navbar">
  <div class="logo">
    <img src="images/logo.jpg" alt="Logo">
    <h2>Rhockstar Nation</h2>
  </div>

  <nav>
    <a href="index.html">Home</a>
    <a href="services.html">Services</a>
    <a href="news.html">News</a>
  </nav>
</header>

<!-- HERO -->
<section class="hero">
  <div class="overlay">
    <h1>Build. Grow. Dominate.</h1>
    <p>Web Development • Design • Marketing • Business Systems</p>
  </div>
</section>

<!-- ABOUT -->
<section class="section">
  <h2>About Us</h2>
  <p>
    Rhockstar Nation is a digital solutions company helping businesses grow online through websites, design, marketing and automation systems.
  </p>
</section>

<!-- WHY CHOOSE US -->
<section class="section dark">
  <h2>Why Choose Us</h2>

  <div class="grid">
    <div class="card">Professional Quality</div>
    <div class="card">Fast Delivery</div>
    <div class="card">Affordable Pricing</div>
    <div class="card">Secure Systems</div>
  </div>
</section>

<!-- QUICK SERVICES (OPTIONAL DISPLAY ONLY) -->
<section class="section">
  <h2>Our Services</h2>

  <div class="service-grid">

    <a href="services.html" class="service-card">
      <div class="overlay">View All Services</div>
    </a>

  </div>
</section>

<!-- ORDER FORM -->
<section class="section dark">
  <h2>Place Order</h2>

  <form id="orderForm" class="card">

    <input type="text" id="name" placeholder="Full Name" required>

    <input type="tel" id="phone" placeholder="Phone Number" required>

    <!-- MASTER SERVICE SELECT -->
    <select id="service" required>
      <option value="">Select Service</option>

      <optgroup label="💻 Web Development">
        <option value="Starter Website" data-price="150000">Starter Website — ₦150,000</option>
        <option value="Business Website" data-price="300000">Business Website — ₦300,000</option>
        <option value="E-Commerce Website" data-price="450000">E-Commerce Website — ₦450,000</option>
        <option value="Premium Website" data-price="500000">Premium Website — ₦500,000</option>
        <option value="Custom SaaS Platform" data-price="1000000">Custom SaaS — ₦1,000,000+</option>
      </optgroup>

      <optgroup label="📢 Marketing">
        <option value="WhatsApp Ad 24H" data-price="5000">WhatsApp Ad (24H) — ₦5,000</option>
        <option value="WhatsApp Ad 3D" data-price="12000">WhatsApp Ad (3 Days) — ₦12,000</option>
        <option value="WhatsApp Ad 1W" data-price="25000">WhatsApp Ad (1 Week) — ₦25,000</option>
        <option value="WhatsApp Ad 1M" data-price="90000">WhatsApp Ad (1 Month) — ₦90,000</option>
      </optgroup>

      <optgroup label="🎨 Graphics Design">
        <option value="Logo Design" data-price="10000">Logo Design — ₦10,000</option>
        <option value="Flyer Design" data-price="10000">Flyer Design — ₦10,000</option>
        <option value="Social Media Design" data-price="15000">Social Media — ₦15,000</option>
        <option value="Business Card Design" data-price="15000">Business Card — ₦15,000</option>
        <option value="Banner Design" data-price="20000">Banner — ₦20,000</option>
        <option value="Brochure Design" data-price="25000">Brochure — ₦25,000</option>
        <option value="Document Design" data-price="30000">Document — ₦30,000</option>
        <option value="Certificate Design" data-price="40000">Certificate — ₦40,000</option>
      </optgroup>

      <optgroup label="🏢 Business Systems">
        <option value="Order System" data-price="100000">Order System — ₦100,000</option>
        <option value="Inventory System" data-price="500000">Inventory — ₦500,000</option>
        <option value="School Portal" data-price="500000">School Portal — ₦500,000</option>
        <option value="Church System" data-price="400000">Church — ₦400,000+</option>
        <option value="Hospital System" data-price="700000">Hospital — ₦700,000+</option>
        <option value="Hotel System" data-price="600000">Hotel — ₦600,000+</option>
        <option value="CRM System" data-price="500000">CRM — ₦500,000+</option>
        <option value="Enterprise System" data-price="1000000">Enterprise — ₦1,000,000+</option>
      </optgroup>

    </select>

    <textarea id="details" rows="5" placeholder="Project Details"></textarea>

    <button class="btn" type="submit">Submit Order</button>

  </form>
</section>

<!-- FOOTER -->
<footer class="section">
  <h3>Rhockstar Nation</h3>
  <p>Web • Marketing • Design • Systems</p>
  <p>© 2026 Rhockstar Nation</p>
</footer>

<!-- WHATSAPP -->
<a href="https://wa.me/2348074647269" class="whatsapp">💬</a>

<!-- ORDER MODAL -->
<div id="orderModal" class="modal">

  <div class="modal-content">

    <h2>Confirm Order</h2>

    <input id="m_service" disabled>
    <input id="m_price" disabled>

    <input id="m_name" placeholder="Full Name">
    <input id="m_phone" placeholder="Phone Number">

    <textarea id="m_details" placeholder="Project Details"></textarea>

    <button onclick="submitOrder()">Submit Order</button>
    <button onclick="closeModal()">Close</button>

  </div>

</div>

<script src="app.js"></script>
</body>
</html>
