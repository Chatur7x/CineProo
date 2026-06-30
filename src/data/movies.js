var DISTRICTS = [
  "Visakhapatnam", "Guntur", "Vijayawada", "Tirupati",
  "Kurnool", "Rajahmundry", "Kakinada"
];

var ALL_THEATRES = {
  "Visakhapatnam": ["INOX RTC Complex", "PVR Central", "Cinepolis"],
  "Guntur": ["Srinivasa Theatre", "Venkateswara", "Bramarambha"],
  "Vijayawada": ["PVR PVP Square", "INOX Trendset", "Mallikarjuna"],
  "Tirupati": ["SV Cineplex", "Balaji Theatre", "Alankar"],
  "Kurnool": ["Raj Theatre", "Surya Mahal"],
  "Rajahmundry": ["INOX Rajahmundry", "Sangam Theatre"],
  "Kakinada": ["PVR Kakinada", "Srinivasa"]
};

var MOVIES = [
  { id: 1, title: "Spirit", genre: "Action", rating: 8.2, language: "Telugu", poster: "posters/SPIRIT1.jpg", description: "A former IPS officer lands in jail where a ruthless jailer tests his limits. A Sandeep Reddy Vanga film starring Prabhas.", showtimes: ["10:00 AM","1:00 PM","4:00 PM","7:00 PM","10:00 PM"], districts: ["Visakhapatnam", "Guntur", "Vijayawada", "Tirupati"], theatres: {"Visakhapatnam": ["INOX RTC Complex", "PVR Central"], "Guntur": ["Srinivasa Theatre", "Venkateswara"], "Vijayawada": ["PVR PVP Square"], "Tirupati": ["SV Cineplex"]}, ratingsByDistrict: {"Visakhapatnam": 8.5, "Guntur": 8.0, "Vijayawada": 8.3, "Tirupati": 8.7} },
  { id: 2, title: "Varanasi", genre: "Sci-Fi", rating: 8.6, language: "Telugu", poster: "posters/VARNASHI2.jpeg", description: "A Shiva devotee is sent on a mysterious mission to find an ancient cosmic artifact across continents. SS Rajamouli film starring Mahesh Babu.", showtimes: ["11:00 AM","2:00 PM","5:00 PM","8:00 PM"], districts: ["Visakhapatnam", "Vijayawada", "Rajahmundry", "Kakinada"], theatres: {"Visakhapatnam": ["INOX RTC Complex", "Cinepolis"], "Vijayawada": ["INOX Trendset", "Mallikarjuna"], "Rajahmundry": ["INOX Rajahmundry"], "Kakinada": ["PVR Kakinada"]}, ratingsByDistrict: {"Visakhapatnam": 8.8, "Vijayawada": 8.6, "Rajahmundry": 8.7, "Kakinada": 8.4} },
  { id: 3, title: "Peddi", genre: "Sports", rating: 8.4, language: "Telugu", poster: "https://upload.wikimedia.org/wikipedia/en/2/26/Peddi_Poster.jpg", description: "In 1980s rural Andhra Pradesh, a spirited villager unites his community through sports to defend their pride against a powerful rival.", showtimes: ["9:00 AM","12:00 PM","3:00 PM","6:00 PM","9:00 PM"], districts: ["Guntur", "Kurnool", "Rajahmundry", "Kakinada"], theatres: {"Guntur": ["Srinivasa Theatre", "Bramarambha"], "Kurnool": ["Raj Theatre"], "Rajahmundry": ["Sangam Theatre"], "Kakinada": ["Srinivasa"]}, ratingsByDistrict: {"Guntur": 8.6, "Kurnool": 8.2, "Rajahmundry": 8.5, "Kakinada": 8.3} },
  { id: 4, title: "Kantara", genre: "Thriller", rating: 8.8, language: "Kannada", poster: "https://upload.wikimedia.org/wikipedia/en/8/84/Kantara_poster.jpeg", description: "A clash between a tribal man and a landlord escalates into a battle of faith, nature, and ancient traditions in coastal Karnataka.", showtimes: ["10:30 AM","1:30 PM","4:30 PM","7:30 PM"], districts: ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur"], theatres: {"Visakhapatnam": ["PVR Central", "Cinepolis"], "Vijayawada": ["PVR PVP Square"], "Tirupati": ["Balaji Theatre"], "Guntur": ["Venkateswara"]}, ratingsByDistrict: {"Visakhapatnam": 8.9, "Vijayawada": 8.7, "Tirupati": 9.0, "Guntur": 8.5} },
  { id: 5, title: "RRR", genre: "Action", rating: 8.9, language: "Telugu", poster: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg", description: "A fearless revolutionary and a reckless Indian policeman form an unlikely friendship in pre-independent India.", showtimes: ["10:00 AM","12:30 PM","3:00 PM","5:30 PM","8:00 PM"], districts: ["Visakhapatnam", "Guntur", "Vijayawada", "Tirupati", "Kurnool", "Rajahmundry", "Kakinada"], theatres: {"Visakhapatnam": ["INOX RTC Complex", "PVR Central", "Cinepolis"], "Guntur": ["Srinivasa Theatre", "Venkateswara", "Bramarambha"], "Vijayawada": ["PVR PVP Square", "INOX Trendset", "Mallikarjuna"], "Tirupati": ["SV Cineplex", "Balaji Theatre", "Alankar"], "Kurnool": ["Raj Theatre", "Surya Mahal"], "Rajahmundry": ["INOX Rajahmundry", "Sangam Theatre"], "Kakinada": ["PVR Kakinada", "Srinivasa"]}, ratingsByDistrict: {"Visakhapatnam": 9.0, "Guntur": 8.9, "Vijayawada": 9.1, "Tirupati": 8.8, "Kurnool": 8.7, "Rajahmundry": 8.9, "Kakinada": 8.6} },
  { id: 6, title: "Pushpa 2", genre: "Action", rating: 8.1, language: "Telugu", poster: "https://upload.wikimedia.org/wikipedia/en/1/11/Pushpa_2-_The_Rule.jpg", description: "Pushpa faces new challenges as he rises in the red sandalwood smuggling syndicate while battling enemies and personal demons.", showtimes: ["11:30 AM","2:30 PM","5:30 PM","8:30 PM"], districts: ["Guntur", "Kurnool", "Rajahmundry", "Tirupati"], theatres: {"Guntur": ["Srinivasa Theatre", "Bramarambha"], "Kurnool": ["Surya Mahal"], "Rajahmundry": ["Sangam Theatre"], "Tirupati": ["Alankar"]}, ratingsByDistrict: {"Guntur": 8.3, "Kurnool": 7.9, "Rajahmundry": 8.1, "Tirupati": 8.0} },
  { id: 7, title: "Animal", genre: "Crime", rating: 7.8, language: "Hindi", poster: "https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg", description: "A wealthy businessman's son returns to take revenge on those who threatened his family, exploring the dark side of toxic masculinity.", showtimes: ["10:00 AM","1:00 PM","4:00 PM","7:00 PM"], districts: ["Visakhapatnam", "Vijayawada", "Tirupati"], theatres: {"Visakhapatnam": ["PVR Central"], "Vijayawada": ["INOX Trendset"], "Tirupati": ["SV Cineplex"]}, ratingsByDistrict: {"Visakhapatnam": 7.9, "Vijayawada": 7.7, "Tirupati": 7.8} },
  { id: 8, title: "Jailer", genre: "Comedy", rating: 8.0, language: "Tamil", poster: "https://upload.wikimedia.org/wikipedia/en/c/cb/Jailer_2023_Tamil_film_poster.jpg", description: "A retired jailer sets out to rescue his cop son from a ruthless gangster, uncovering a web of crime and corruption.", showtimes: ["9:30 AM","12:30 PM","3:30 PM","6:30 PM","9:30 PM"], districts: ["Visakhapatnam", "Guntur", "Tirupati"], theatres: {"Visakhapatnam": ["Cinepolis"], "Guntur": ["Venkateswara"], "Tirupati": ["Balaji Theatre"]}, ratingsByDistrict: {"Visakhapatnam": 8.1, "Guntur": 7.9, "Tirupati": 8.0} },
  { id: 9, title: "Salaar", genre: "Action", rating: 7.9, language: "Telugu", poster: "https://upload.wikimedia.org/wikipedia/en/a/a6/Salaar_Part_1_%E2%80%93_Ceasefire.jpg", description: "A gang leader makes a promise to a dying friend and faces off against tyrants to protect the powerless in a violent land.", showtimes: ["10:00 AM","1:00 PM","4:00 PM","7:00 PM","10:00 PM"], districts: ["Visakhapatnam", "Guntur", "Kurnool", "Rajahmundry"], theatres: {"Visakhapatnam": ["INOX RTC Complex"], "Guntur": ["Srinivasa Theatre"], "Kurnool": ["Raj Theatre"], "Rajahmundry": ["INOX Rajahmundry"]}, ratingsByDistrict: {"Visakhapatnam": 8.0, "Guntur": 7.8, "Kurnool": 7.7, "Rajahmundry": 7.9} },
  { id: 10, title: "Leo", genre: "Thriller", rating: 8.3, language: "Tamil", poster: "https://upload.wikimedia.org/wikipedia/en/7/75/Leo_%282023_Indian_film%29.jpg", description: "A mild-mannered cafe owner's past catches up when his family is threatened, forcing him to confront his violent former life.", showtimes: ["11:00 AM","2:00 PM","5:00 PM","8:00 PM"], districts: ["Visakhapatnam", "Vijayawada", "Kakinada"], theatres: {"Visakhapatnam": ["PVR Central", "Cinepolis"], "Vijayawada": ["PVR PVP Square"], "Kakinada": ["PVR Kakinada"]}, ratingsByDistrict: {"Visakhapatnam": 8.4, "Vijayawada": 8.2, "Kakinada": 8.3} }
];

var PRICE_PER_SEAT = 400;
var TAX_PER_SEAT = 46.81;

function generateSeats() {
  var rows = ["A", "B", "C", "D", "E", "F", "G"];
  var seats = [];
  var booked = new Set(Array.from({ length: 15 }, function () { return Math.floor(Math.random() * 84); }));
  rows.forEach(function (row, ri) {
    for (var n = 1; n <= 12; n++) {
      seats.push({ id: row + n, row: row, number: n, status: booked.has(ri * 12 + n - 1) ? "booked" : "available" });
    }
  });
  return seats;
}

var SCREEN_TYPES = [
  { id: 'imax', name: 'IMAX', icon: 'IMAX', priceMultiplier: 2.5, color: '#0A84FF' },
  { id: 'dolby', name: 'Dolby Cinema', icon: 'DOLBY', priceMultiplier: 2.2, color: '#BF5AF2' },
  { id: 'epiq', name: 'EPIQ', icon: 'EPIQ', priceMultiplier: 2.0, color: '#FF375F' },
  { id: '4dx', name: '4DX', icon: '4DX', priceMultiplier: 2.3, color: '#64D2FF' },
  { id: 'screenx', name: 'ScreenX', icon: 'SCX', priceMultiplier: 1.8, color: '#FF6482' },
  { id: 'vip', name: 'VIP', icon: 'VIP', priceMultiplier: 3.0, color: '#FFD60A' },
  { id: 'recliner', name: 'Recliner', icon: 'REC', priceMultiplier: 1.6, color: '#30D158' },
  { id: 'silver', name: 'Silver Screen', icon: 'STD', priceMultiplier: 1.0, color: '#98989D' },
  { id: 'gold', name: 'Gold Class', icon: 'GOLD', priceMultiplier: 1.4, color: '#FF9F0A' }
];

function getTheatreScreens(theatreName) {
  var hash = 0;
  for (var i = 0; i < theatreName.length; i++) {
    hash = ((hash << 5) - hash) + theatreName.charCodeAt(i);
    hash = hash & hash;
  }
  hash = Math.abs(hash);
  // Always include silver as base
  var screens = [SCREEN_TYPES[7]]; // Silver Screen
  // Add 1-3 premium screens based on hash
  var premiumTypes = SCREEN_TYPES.filter(function(s) { return s.id !== 'silver'; });
  var count = 1 + (hash % 3); // 1 to 3 premium screens
  for (var j = 0; j < count; j++) {
    var idx = (hash + j * 7) % premiumTypes.length;
    // Avoid duplicates
    var screen = premiumTypes[idx];
    var alreadyAdded = false;
    for (var k = 0; k < screens.length; k++) {
      if (screens[k].id === screen.id) { alreadyAdded = true; break; }
    }
    if (!alreadyAdded) screens.push(screen);
  }
  return screens;
}

function getScreenPrice(screenType) {
  return Math.round(PRICE_PER_SEAT * screenType.priceMultiplier);
}

function getScreenTax(screenType) {
  return Math.round(TAX_PER_SEAT * screenType.priceMultiplier * 100) / 100;
}
