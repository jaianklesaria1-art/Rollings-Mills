/* =========================================================
   SITE DATA: edit this file to update beers, food and events.
   Everything on the page is generated from these lists.
   ========================================================= */

const CONTACT = {
  phone: "+91 74004 07711",
  whatsapp: "917400407711", // country code + number, no "+" or spaces
  instagram: "https://www.instagram.com/rollingmillsbrewery",
  orderOnline: "https://airmenus.in/rollingmills/order",
};

// Taproom opening hours (24h, Mumbai time). Same every day.
const HOURS = { open: "10:00", close: "22:30" };

/* ---------- BEERS ----------
   colors: [can label, spray accent, label text]
   hl:     highlight colour used on the site
   type:   used by the tap-list filter (IPA, Lager, Dark, Wheat)
   image:  optional, e.g. "assets/cans/lazy.png" to use a real photo instead of the drawn can */
const BEERS = [
  { id: "lazy", name: "Lazy", style: "New England IPA", type: "IPA", abv: "6.0%",
    notes: "Juicy and hazy, dry-hopped with Citra, Simcoe, Azacca and El Dorado.",
    colors: ["#e4ff1a", "#ff2e88", "#121212"], hl: "#e4ff1a" },
  { id: "kura", name: "Kura Kura", style: "Japanese Rice Lager", type: "Lager",
    notes: "Super clean and crisp. Brewed with Japanese rice and Japanese hops.",
    colors: ["#f4f1e8", "#ff2036", "#121212"], hl: "#ff4d5e" },
  { id: "shocktown", name: "Shocktown", style: "American IPA", type: "IPA",
    notes: "Big pine, bright citrus and a bitter bite that wakes you up.",
    colors: ["#29e3ff", "#ffc21a", "#121212"], hl: "#29e3ff" },
  { id: "pastry", name: "Pastry Stout", style: "Pastry Stout", type: "Dark",
    notes: "Super indulgent, with big notes of chocolate, vanilla and coffee. Dessert in a glass.",
    colors: ["#3b2418", "#ffb347", "#f4f1e8"], hl: "#ffb347" },
  { id: "whitenoise", name: "White Noise", style: "Witbier", type: "Wheat",
    notes: "Soft wheat, orange peel and coriander. Turn the volume down.",
    colors: ["#ffffff", "#8b5cf6", "#121212"], hl: "#c4b5fd" },
  { id: "bandido", name: "El Bandido", style: "Mexican Lager", type: "Lager",
    notes: "Light, crisp and made for squeezing a lime into.",
    colors: ["#16a34a", "#fde047", "#f4f1e8"], hl: "#4ade80" },
  { id: "guns", name: "Guns For Hands", style: "American IPA", type: "IPA",
    notes: "Resinous, dank and loud. Hops first, questions later.",
    colors: ["#ff2e88", "#121212", "#121212"], hl: "#ff2e88" },
  { id: "slippery", name: "Slippery When Wet", style: "Dunkelweizen", type: "Wheat",
    notes: "Dark wheat beer with banana, clove and a little toasty bread.",
    colors: ["#5b3a29", "#29e3ff", "#f4f1e8"], hl: "#7dd3fc" },
  { id: "time", name: "Time Theorists", style: "Belgian Dubbel", type: "Dark",
    notes: "Dark fruit, caramel and a warm Belgian yeast kick.",
    colors: ["#1e1b4b", "#ffc21a", "#f4f1e8"], hl: "#ffc21a" },
];

// How many beers appear in the big sideways "beer wall" (the rest show in the tap list)
const WALL_COUNT = 7;

/* ---------- FOOD (SAMPLE: replace with the real menu) ----------
   veg: true = vegetarian (green dot), false = non-veg (red dot)
   pair: id of the beer it goes with */
const FOOD = [
  { cat: "Bar Bites", name: "Ghee Roast Wings", desc: "Crispy wings tossed in fiery Mangalorean ghee roast masala.", veg: false, pair: "lazy" },
  { cat: "Bar Bites", name: "Beer-Batter Fish Fingers", desc: "Basa in a Witbier batter, tartare and lime on the side.", veg: false, pair: "whitenoise" },
  { cat: "Bar Bites", name: "Chilli Cheese Toast", desc: "Bombay-style, loaded with green chilli and too much cheese.", veg: true, pair: "shocktown" },
  { cat: "Bar Bites", name: "Kurkure Bhindi Fries", desc: "Crunchy okra fries with chaat masala and mint mayo.", veg: true, pair: "kura" },
  { cat: "Big Plates", name: "Double Smash Burger", desc: "Two smashed patties, cheese, pickles and our house sauce.", veg: false, pair: "guns" },
  { cat: "Big Plates", name: "Pao Bhaji Sliders", desc: "Butter-toasted pao, spicy bhaji and a pickled onion crunch.", veg: true, pair: "bandido" },
  { cat: "Big Plates", name: "Paneer Tikka Pizza", desc: "Thin crust, tandoori paneer, peppers and onions.", veg: true, pair: "slippery" },
  { cat: "Sweet", name: "Stout Brownie Sundae", desc: "Warm brownie baked with our Pastry Stout, vanilla ice cream.", veg: true, pair: "pastry" },
  { cat: "Sweet", name: "Churros & Dubbel Caramel", desc: "Cinnamon churros with a Belgian-beer caramel dip.", veg: true, pair: "time" },
];

/* ---------- EVENTS (SAMPLE: replace with real events) ----------
   One-off events: give a "date" (YYYY-MM-DD).
   Weekly events: give "weekly" (0 = Sunday … 6 = Saturday) and they repeat automatically.
   Past events are hidden automatically. */
const EVENTS = [
  { title: "Live on the Floor", type: "Music", weekly: 5, time: "20:00", end: "23:00",
    desc: "Local bands, loud amps, cold pints. Every Friday." },
  { title: "Pint & Quiz Night", type: "Quiz", weekly: 2, time: "20:00", end: "22:00",
    desc: "Teams of up to 6. Winners drink on the house." },
  { title: "Tap Takeover: Collab Drop", type: "Tap Takeover", date: "2026-10-10", time: "18:00", end: "22:30",
    desc: "A brand new collab beer, first pours straight from the tank." },
  { title: "Sunday Spray Jam", type: "Art", date: "2026-10-11", time: "16:00", end: "21:00",
    desc: "Live graffiti on the back wall, a DJ on the decks, and bring your own sketchbook." },
  { title: "Stand-up in the Mill", type: "Comedy", date: "2026-10-15", time: "21:00", end: "22:30",
    desc: "Mumbai's sharpest new comics. Heckle at your own risk." },
  { title: "Brewery Tour + Tasting", type: "Tour", date: "2026-10-24", time: "15:00", end: "17:00",
    desc: "See the tanks in Kandivali, taste straight from the source. Limited spots." },
  { title: "It's Dark in Here: Halloween", type: "Party", date: "2026-10-31", time: "20:00", end: "23:30",
    desc: "Costumes, neon, and a black IPA you'll only find tonight." },
];
