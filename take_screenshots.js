const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  // Ensure output directory exists
  const ssDir = path.join(__dirname, 'captures', 'screenshots');
  if (!fs.existsSync(ssDir)) {
    fs.mkdirSync(ssDir, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();
  const indexUrl = 'file://' + path.join(__dirname, 'index.html');
  console.log('Opening local application page: ' + indexUrl);

  // Helper to take a screenshot and log
  async function capture(name, delay = 500) {
    await new Promise(r => setTimeout(r, delay));
    const filepath = path.join(ssDir, name + '.png');
    await page.screenshot({ path: filepath });
    console.log(`Saved screenshot: ${name}.png`);
  }

  // Page 1: Home
  await page.goto(indexUrl);
  await capture('01_home_screen');

  // Navigate to Movie Details (Click on Spirit movie card)
  console.log('Navigating to Movie Details...');
  await page.waitForSelector('.movies-grid .movie-card:first-child');
  await page.click('.movies-grid .movie-card:first-child');
  await capture('02_movie_details');

  // Select a Showtime to navigate to Seat Selection
  console.log('Selecting District & Showtime...');
  // Step 1: Select District (first chip)
  await page.waitForSelector('.screen-selection-section .showtime-chip');
  await page.click('.screen-selection-section .showtime-chip');
  await new Promise(r => setTimeout(r, 400));

  // Step 2: Select Theatre
  await page.waitForSelector('.theatre-screen-card button');
  await page.click('.theatre-screen-card button');
  await new Promise(r => setTimeout(r, 400));

  // Step 3: Choose Screen Experience
  await page.waitForSelector('.screen-chip');
  await page.click('.screen-chip');
  await new Promise(r => setTimeout(r, 400));

  // Step 4: Pick a Screen Number card
  await page.waitForSelector('.screen-number-card');
  await page.click('.screen-number-card');
  await new Promise(r => setTimeout(r, 400));

  // Step 5: Pick a Showtime
  // Find all grids and click first chip in the last grid (showtime grid)
  await page.waitForSelector('.showtime-grid');
  const grids = await page.$$('.showtime-grid');
  if (grids.length > 0) {
    const lastGrid = grids[grids.length - 1];
    const button = await lastGrid.$('.showtime-chip');
    if (button) {
      await button.click();
    }
  }
  await capture('03_showtime_selected');

  // Step 6: Click Select Seats button
  console.log('Clicking Select Seats...');
  await page.waitForSelector('.btn-primary');
  await page.click('.btn-primary');

  // Proceed to Seat Selection
  console.log('Navigating to Seat Map...');
  await new Promise(r => setTimeout(r, 1200));
  await capture('04_seat_map_empty');

  // Toggle stepper & select recommended seats
  console.log('Syncing stepper & selecting recommended seats...');
  await page.waitForSelector('.best-seat-btn');
  await page.click('.best-seat-btn');
  await capture('05_seat_map_selected_recommended');

  // Proceed to Confirm page
  console.log('Navigating to Confirm page...');
  await page.waitForSelector('.booking-sidebar .btn-primary');
  await page.click('.booking-sidebar .btn-primary');
  await new Promise(r => setTimeout(r, 800));
  await capture('06_confirm_invoice');

  // Proceed to Payment Method Selection
  console.log('Navigating to Payment Selection...');
  await page.waitForSelector('.btn-pay');
  await page.click('.btn-pay');
  await new Promise(r => setTimeout(r, 800));
  await capture('07_payment_methods');

  // Select Card Payment to open Vue Card Form
  console.log('Opening Vue Card Form...');
  await page.waitForSelector('.payment-option-btn:first-child');
  await page.click('.payment-option-btn:first-child');
  await new Promise(r => setTimeout(r, 800));
  await capture('08_vue_card_form_empty');

  // Click on Visa chip preset to auto-fill valid credentials & pass checks
  console.log('Auto-filling via presets...');
  await page.waitForSelector('.demo-card-presets button');
  const buttons = await page.$$('.demo-card-presets button');
  if (buttons.length >= 1) {
    await buttons[0].click(); // Click Visa (100% Luhn valid)
  }
  await capture('09_vue_card_form_filled');

  // Click Save & Pay
  console.log('Submitting card details...');
  await page.waitForSelector('.btn-submit-card');
  await page.click('.btn-submit-card');
  await new Promise(r => setTimeout(r, 2000)); // wait for transition
  await capture('10_otp_verification');

  // Submit OTP
  console.log('Entering OTP...');
  await page.waitForSelector('.otp-input');
  await page.waitForSelector('.otp-demo');
  
  // Extract dynamic demo OTP text (e.g. "Demo OTP: 583920") and extract numbers
  const demoOtpText = await page.evaluate(() => {
    const el = document.querySelector('.otp-demo');
    return el ? el.textContent : '';
  });
  const otpMatch = demoOtpText.match(/\d+/);
  const actualOtp = otpMatch ? otpMatch[0] : '123456';
  console.log('Extracted actual OTP: ' + actualOtp);

  await page.type('.otp-input', actualOtp);
  await page.waitForSelector('.btn-verify');
  await page.click('.btn-verify');
  await new Promise(r => setTimeout(r, 1500));
  await capture('11_booking_success');

  // Click My Bookings
  console.log('Opening My Bookings...');
  await page.waitForSelector('.done-actions button');
  const myBookingsBtn = await page.$$('.done-actions button');
  if (myBookingsBtn.length > 0) {
    await myBookingsBtn[0].click();
  }
  await new Promise(r => setTimeout(r, 800));
  await capture('12_my_bookings_list');

  // Click on a booking card to open the 3D Ticket Pass Modal
  console.log('Opening 3D Ticket overlay...');
  await page.waitForSelector('.bookings-list .booking-card:first-child');
  await page.click('.bookings-list .booking-card:first-child');
  await new Promise(r => setTimeout(r, 800));
  await capture('13_ticket_3d_modal_unscanned');

  // Click QR code to scan/verify
  console.log('Verifying ticket...');
  await page.waitForSelector('.ticket-qr-container');
  await page.click('.ticket-qr-container');
  await new Promise(r => setTimeout(r, 500));
  await capture('14_ticket_3d_modal_scanned');

  // Close ticket modal
  await page.waitForSelector('.ticket-close-btn');
  await page.click('.ticket-close-btn');

  // Navigate to Python Audit page
  console.log('Navigating to Python Audit Page...');
  await page.goto(indexUrl + '#/python-audit');
  await new Promise(r => setTimeout(r, 800));
  await capture('15_python_audit_page');

  // Run bulk password audit
  console.log('Running bulk password audit...');
  await page.waitForSelector('.btn-audit');
  await page.click('.btn-audit');
  await new Promise(r => setTimeout(r, 800));
  await capture('16_python_audit_results');

  console.log('All screenshots captured successfully!');
  await browser.close();
})();
