/* =========================================================
   GRANDSTAY HOTEL MANAGEMENT SYSTEM
   ========================================================= */

const STORAGE_KEY = "grandstay_hotel_data";

let selectedDate = getTodayString();

let currentFoodMeal = "Breakfast";
let currentRoomFilter = "all";

const roomInventory = [
  { number: "101", type: "Standard", price: 1800 },
  { number: "102", type: "Standard", price: 1800 },
  { number: "103", type: "Standard", price: 1800 },
  { number: "104", type: "Standard", price: 1800 },

  { number: "201", type: "Deluxe", price: 2800 },
  { number: "202", type: "Deluxe", price: 2800 },
  { number: "203", type: "Deluxe", price: 2800 },
  { number: "204", type: "Deluxe", price: 2800 },

  { number: "301", type: "Suite", price: 4500 },
  { number: "302", type: "Suite", price: 4500 },
  { number: "303", type: "Suite", price: 4500 },
  { number: "304", type: "Suite", price: 4500 },
];

/* =========================================================
   BASIC FUNCTIONS
   ========================================================= */

function getTodayString() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDayName(dateString) {
  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
  });
}

function money(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN");
}

function generateId(prefix = "ID") {
  return prefix + Date.now() + Math.floor(Math.random() * 1000);
}

/* =========================================================
   DEFAULT FOOD
   ========================================================= */

function getDefaultFood() {
  return [
    {
      id: generateId("FOOD"),
      name: "Idli & Sambar",
      meal: "Breakfast",
      price: 80,
      available: true,
    },

    {
      id: generateId("FOOD"),
      name: "Masala Dosa",
      meal: "Breakfast",
      price: 120,
      available: true,
    },

    {
      id: generateId("FOOD"),
      name: "Fresh Fruit Bowl",
      meal: "Breakfast",
      price: 100,
      available: true,
    },

    {
      id: generateId("FOOD"),
      name: "Veg Biryani",
      meal: "Lunch",
      price: 180,
      available: true,
    },

    {
      id: generateId("FOOD"),
      name: "Paneer Fried Rice",
      meal: "Lunch",
      price: 220,
      available: true,
    },

    {
      id: generateId("FOOD"),
      name: "South Indian Meals",
      meal: "Lunch",
      price: 160,
      available: true,
    },

    {
      id: generateId("FOOD"),
      name: "Chapati & Paneer",
      meal: "Dinner",
      price: 180,
      available: true,
    },

    {
      id: generateId("FOOD"),
      name: "Vegetable Noodles",
      meal: "Dinner",
      price: 190,
      available: true,
    },

    {
      id: generateId("FOOD"),
      name: "Tomato Soup",
      meal: "Dinner",
      price: 100,
      available: true,
    },
  ];
}

/* =========================================================
   DEFAULT DATA
   ========================================================= */

function createDateData(date) {
  return {
    rooms: roomInventory.map((room) => ({
      ...room,
      status: "available",
    })),

    bookings: [],

    food: getDefaultFood(),
  };
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.log("Data reset.");
    }
  }

  const initialData = {
    guests: [],
    dates: {},
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));

  return initialData;
}

let appData = loadData();

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

function getDateData(date = selectedDate) {
  if (!appData.dates[date]) {
    appData.dates[date] = createDateData(date);

    saveData();
  }

  return appData.dates[date];
}

/* =========================================================
   DATE CONTROL
   ========================================================= */

function setSelectedDate(date) {
  selectedDate = date;

  document.getElementById("selectedDate").value = date;

  getDateData(date);

  updateAll();
}

function moveDate(days) {
  const date = new Date(selectedDate + "T00:00:00");

  date.setDate(date.getDate() + days);

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  setSelectedDate(`${year}-${month}-${day}`);
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function showSection(sectionId) {
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active");
  });

  document.getElementById(sectionId).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.classList.remove("active");

    if (button.dataset.section === sectionId) {
      button.classList.add("active");
    }
  });

  const titles = {
    dashboard: ["Dashboard", "Hotel overview and today's activities"],

    guests: ["Guest Management", "Manage hotel guest information"],

    bookings: [
      "Booking Management",
      "Manage reservations for the selected date",
    ],

    rooms: ["Room Management", "View and manage rooms for the selected day"],

    food: ["Food & Menu", "Manage daily food availability"],

    billing: ["Billing & Revenue", "View bills for the selected date"],
  };

  document.getElementById("pageTitle").textContent = titles[sectionId][0];

  document.getElementById("pageSubtitle").textContent = titles[sectionId][1];
}

document.querySelectorAll(".nav-btn").forEach((button) => {
  button.addEventListener("click", () => {
    showSection(button.dataset.section);
  });
});

/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {
  const data = getDateData();

  const bookings = data.bookings;

  const occupied = data.rooms.filter(
    (room) => room.status === "occupied",
  ).length;

  const available = data.rooms.filter(
    (room) => room.status === "available",
  ).length;

  const foodAvailable = data.food.filter((food) => food.available).length;

  const revenue = bookings
    .filter((booking) => booking.status !== "cancelled")
    .reduce((sum, booking) => sum + Number(booking.total), 0);

  document.getElementById("availableRooms").textContent = available;

  document.getElementById("occupiedRooms").textContent = occupied;

  document.getElementById("totalBookings").textContent = bookings.length;

  document.getElementById("totalGuests").textContent = new Set(
    bookings.map((booking) => booking.guest),
  ).size;

  document.getElementById("foodAvailable").textContent = foodAvailable;

  document.getElementById("dailyRevenue").textContent = money(revenue);

  document.getElementById("displayDate").textContent = formatDate(selectedDate);

  document.getElementById("displayDay").textContent = getDayName(selectedDate);

  document.getElementById("dashboardRooms").innerHTML = data.rooms
    .slice(0, 8)
    .map((room) => {
      return `
                <div class="room-mini">

                    <strong>${room.number}</strong>

                    <span class="${room.status}">
                        ${capitalize(room.status)}
                    </span>

                </div>
            `;
    })
    .join("");

  const dashboardBookings = document.getElementById("dashboardBookings");

  if (!bookings.length) {
    dashboardBookings.innerHTML = `
            <div class="empty-state">
                No bookings for this date.
            </div>
        `;

    return;
  }

  dashboardBookings.innerHTML = bookings
    .slice(0, 5)
    .map((booking) => {
      return `
                <div class="dashboard-booking">

                    <div>
                        <strong>${escapeHtml(booking.guest)}</strong>

                        <p>
                            Room ${booking.room} •
                            ${booking.roomType}
                        </p>
                    </div>

                    <span class="status-badge status-${statusClass(booking.status)}">
                        ${booking.status}
                    </span>

                </div>
            `;
    })
    .join("");
}

/* =========================================================
   GUEST MANAGEMENT
   ========================================================= */

function renderGuests() {
  const table = document.getElementById("guestTable");

  const empty = document.getElementById("guestEmpty");

  const search = document.getElementById("guestSearch").value.toLowerCase();

  const guests = appData.guests.filter((guest) => {
    return (
      guest.name.toLowerCase().includes(search) ||
      guest.phone.toLowerCase().includes(search) ||
      guest.email.toLowerCase().includes(search)
    );
  });

  if (!guests.length) {
    table.innerHTML = "";

    empty.style.display = "block";

    return;
  }

  empty.style.display = "none";

  table.innerHTML = guests
    .map((guest) => {
      return `

            <tr>

                <td>

                    <div class="guest-name">
                        ${escapeHtml(guest.name)}
                    </div>

                    <div class="guest-sub">
                        ID: ${guest.id}
                    </div>

                </td>

                <td>
                    ${escapeHtml(guest.phone)}
                </td>

                <td>
                    ${escapeHtml(guest.email || "-")}
                </td>

                <td>
                    ${escapeHtml(guest.city || "-")}
                </td>

                <td>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteGuest('${guest.id}')"
                    >
                        Delete
                    </button>

                </td>

            </tr>

        `;
    })
    .join("");
}

function openGuestModal() {
  document.getElementById("guestForm").reset();

  document.getElementById("guestModal").classList.add("show");
}

function deleteGuest(id) {
  const guest = appData.guests.find((item) => item.id === id);

  if (!guest) return;

  if (confirm(`Delete guest ${guest.name}?`)) {
    appData.guests = appData.guests.filter((item) => item.id !== id);

    saveData();

    renderGuests();
  }
}

document
  .getElementById("guestForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const guest = {
      id: generateId("GST"),

      name: document.getElementById("guestName").value.trim(),

      phone: document.getElementById("guestPhone").value.trim(),

      email: document.getElementById("guestEmail").value.trim(),

      city: document.getElementById("guestCity").value.trim(),
    };

    appData.guests.push(guest);

    saveData();

    closeModal("guestModal");

    renderGuests();

    alert("Guest added successfully.");
  });

document.getElementById("guestSearch").addEventListener("input", renderGuests);

/* =========================================================
   BOOKING MANAGEMENT
   ========================================================= */

function openBookingModal() {
  populateRoomSelect();

  document.getElementById("bookingForm").reset();

  populateRoomSelect();

  updateEstimatedBill();

  document.getElementById("bookingModal").classList.add("show");
}

function populateRoomSelect() {
  const select = document.getElementById("bookingRoom");

  const data = getDateData();

  const availableRooms = data.rooms.filter(
    (room) => room.status === "available",
  );

  select.innerHTML = `
        <option value="">
            Select Room
        </option>
    `;

  availableRooms.forEach((room) => {
    select.innerHTML += `

            <option
                value="${room.number}"
                data-type="${room.type}"
            >
                Room ${room.number} -
                ${room.type} -
                ${money(room.price)}
            </option>

        `;
  });
}

function getRoomPrice(roomNumber) {
  const room = roomInventory.find((room) => room.number === roomNumber);

  return room ? room.price : 0;
}

function updateEstimatedBill() {
  const room = document.getElementById("bookingRoom").value;

  const days = Number(document.getElementById("stayType").value) || 1;

  const price = getRoomPrice(room);

  document.getElementById("estimatedBill").textContent = money(price * days);
}

document
  .getElementById("bookingRoom")
  .addEventListener("change", updateEstimatedBill);

document
  .getElementById("stayType")
  .addEventListener("change", updateEstimatedBill);

document
  .getElementById("bookingForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const guest = document.getElementById("bookingGuest").value.trim();

    const phone = document.getElementById("bookingPhone").value.trim();

    const room = document.getElementById("bookingRoom").value;

    const roomType = document.getElementById("bookingRoomType").value;

    const checkIn = document.getElementById("checkInTime").value;

    const checkOut = document.getElementById("checkOutTime").value;

    const guestCount = Number(document.getElementById("guestCount").value);

    const stayDays = Number(document.getElementById("stayType").value);

    if (!room) {
      alert("Please select a room.");

      return;
    }

    const data = getDateData();

    const roomObject = data.rooms.find((item) => item.number === room);

    if (!roomObject || roomObject.status !== "available") {
      alert("This room is not available.");

      populateRoomSelect();

      return;
    }

    const price = getRoomPrice(room);

    const total = price * stayDays;

    const booking = {
      id: generateId("BOOK"),

      guest,

      phone,

      room,

      roomType,

      checkIn,

      checkOut,

      guestCount,

      stayDays,

      roomPrice: price,

      total,

      status: "pending",

      createdAt: new Date().toISOString(),
    };

    data.bookings.push(booking);

    roomObject.status = "occupied";

    /* Add guest automatically */

    const existingGuest = appData.guests.find((item) => item.phone === phone);

    if (!existingGuest) {
      appData.guests.push({
        id: generateId("GST"),

        name: guest,

        phone,

        email: "",

        city: "",
      });
    }

    saveData();

    closeModal("bookingModal");

    updateAll();

    alert("Booking created successfully.");
  });

function renderBookings() {
  const container = document.getElementById("bookingCards");

  const search = document.getElementById("bookingSearch").value.toLowerCase();

  const data = getDateData();

  const bookings = data.bookings.filter((booking) => {
    return (
      booking.guest.toLowerCase().includes(search) ||
      booking.room.toLowerCase().includes(search)
    );
  });

  document.getElementById("bookingCount").textContent = data.bookings.length;

  document.getElementById("checkedInCount").textContent = data.bookings.filter(
    (booking) => booking.status === "checked in",
  ).length;

  document.getElementById("checkedOutCount").textContent = data.bookings.filter(
    (booking) => booking.status === "checked out",
  ).length;

  document.getElementById("pendingCount").textContent = data.bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  if (!bookings.length) {
    container.innerHTML = `
            <div class="empty-state">
                No bookings found for this date.
            </div>
        `;

    return;
  }

  container.innerHTML = bookings
    .map((booking) => {
      return `

                <div class="booking-card">

                    <div class="booking-top">

                        <div class="booking-guest">

                            <div class="guest-avatar">
                                ${getInitials(booking.guest)}
                            </div>

                            <div>

                                <h3>
                                    ${escapeHtml(booking.guest)}
                                </h3>

                                <p>
                                    ${escapeHtml(booking.phone)}
                                </p>

                            </div>

                        </div>

                        <span class="status-badge status-${statusClass(booking.status)}">
                            ${booking.status}
                        </span>

                    </div>


                    <div class="booking-info">

                        <div>
                            <span>Room</span>
                            <strong>
                                ${booking.room}
                            </strong>
                        </div>

                        <div>
                            <span>Room Type</span>
                            <strong>
                                ${booking.roomType}
                            </strong>
                        </div>

                        <div>
                            <span>Guests</span>
                            <strong>
                                ${booking.guestCount}
                            </strong>
                        </div>

                        <div>
                            <span>Stay</span>
                            <strong>
                                ${booking.stayDays} Day(s)
                            </strong>
                        </div>

                    </div>


                    <div class="booking-actions">

                        ${
                          booking.status === "pending"
                            ? `
                            <button
                                style="background:#e8f8ef;color:#138755"
                                onclick="changeBookingStatus('${booking.id}','checked in')"
                            >
                                ✓ Check In
                            </button>
                            `
                            : ""
                        }


                        ${
                          booking.status === "checked in"
                            ? `
                            <button
                                style="background:#eeeeef;color:#555"
                                onclick="changeBookingStatus('${booking.id}','checked out')"
                            >
                                Check Out
                            </button>
                            `
                            : ""
                        }


                        <button
                            style="background:#f0f0ff;color:#5757d5"
                            onclick="showInvoice('${booking.id}')"
                        >
                            🧾 Invoice
                        </button>


                        ${
                          booking.status !== "checked out" &&
                          booking.status !== "cancelled"
                            ? `
                            <button
                                style="background:#fff0f1;color:#d13e49"
                                onclick="cancelBooking('${booking.id}')"
                            >
                                Cancel
                            </button>
                            `
                            : ""
                        }

                    </div>

                </div>

            `;
    })
    .join("");
}

document
  .getElementById("bookingSearch")
  .addEventListener("input", renderBookings);

function changeBookingStatus(id, newStatus) {
  const data = getDateData();

  const booking = data.bookings.find((item) => item.id === id);

  if (!booking) return;

  booking.status = newStatus;

  const room = data.rooms.find((item) => item.number === booking.room);

  if (room) {
    if (newStatus === "checked out") {
      room.status = "cleaning";
    }

    if (newStatus === "checked in") {
      room.status = "occupied";
    }
  }

  saveData();

  updateAll();
}

function cancelBooking(id) {
  if (!confirm("Cancel this booking?")) return;

  const data = getDateData();

  const booking = data.bookings.find((item) => item.id === id);

  if (!booking) return;

  booking.status = "cancelled";

  const room = data.rooms.find((item) => item.number === booking.room);

  if (room) {
    room.status = "available";
  }

  saveData();

  updateAll();
}

/* =========================================================
   ROOMS
   ========================================================= */

function renderRooms() {
  const container = document.getElementById("roomGrid");

  const data = getDateData();

  let rooms = data.rooms;

  if (currentRoomFilter !== "all") {
    rooms = rooms.filter((room) => room.status === currentRoomFilter);
  }

  container.innerHTML = rooms
    .map((room) => {
      return `

                <div class="room-card">

                    <div class="room-number">
                        Room ${room.number}
                    </div>

                    <div class="room-type">
                        ${room.type} Room
                    </div>

                    <div class="room-price">
                        ${money(room.price)}
                        <span>/ night</span>
                    </div>

                    <span class="room-status ${room.status}">
                        ${capitalize(room.status)}
                    </span>

                    <div class="room-control">

                        <select
                            onchange="changeRoomStatus('${room.number}', this.value)"
                        >

                            <option
                                value="available"
                                ${room.status === "available" ? "selected" : ""}
                            >
                                Available
                            </option>

                            <option
                                value="occupied"
                                ${room.status === "occupied" ? "selected" : ""}
                            >
                                Occupied
                            </option>

                            <option
                                value="cleaning"
                                ${room.status === "cleaning" ? "selected" : ""}
                            >
                                Cleaning
                            </option>

                            <option
                                value="maintenance"
                                ${room.status === "maintenance" ? "selected" : ""}
                            >
                                Maintenance
                            </option>

                        </select>

                    </div>

                </div>

            `;
    })
    .join("");
}

function changeRoomStatus(roomNumber, status) {
  const data = getDateData();

  const room = data.rooms.find((item) => item.number === roomNumber);

  if (!room) return;

  room.status = status;

  saveData();

  updateAll();
}

document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    currentRoomFilter = button.dataset.filter;

    renderRooms();
  });
});

/* =========================================================
   FOOD MANAGEMENT
   ========================================================= */

function renderFood() {
  const data = getDateData();

  const container = document.getElementById("foodGrid");

  document.getElementById("foodDateText").textContent =
    formatDate(selectedDate);

  const food = data.food.filter((item) => item.meal === currentFoodMeal);

  if (!food.length) {
    container.innerHTML = `
            <div class="empty-state">
                No food items for this meal.
            </div>
        `;

    return;
  }

  container.innerHTML = food
    .map((item) => {
      return `

                <div class="food-card">

                    <div class="food-icon">
                        🍴
                    </div>

                    <h3>
                        ${escapeHtml(item.name)}
                    </h3>

                    <p>
                        ${item.meal}
                    </p>

                    <div class="food-bottom">

                        <span class="food-price">
                            ${money(item.price)}
                        </span>

                        <button
                            class="food-toggle"
                            style="
                                background:${item.available ? "#e8f8ef" : "#fff0f1"};
                                color:${item.available ? "#138755" : "#d13e49"};
                            "
                            onclick="toggleFood('${item.id}')"
                        >
                            ${item.available ? "Available" : "Unavailable"}
                        </button>

                    </div>

                    <button
                        class="action-btn delete-btn"
                        style="margin-top:12px"
                        onclick="deleteFood('${item.id}')"
                    >
                        Delete
                    </button>

                </div>

            `;
    })
    .join("");
}

document.querySelectorAll(".meal-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".meal-tab")
      .forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    currentFoodMeal = button.dataset.meal;

    renderFood();
  });
});

function openFoodModal() {
  document.getElementById("foodForm").reset();

  document.getElementById("foodModal").classList.add("show");
}

document
  .getElementById("foodForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const data = getDateData();

    data.food.push({
      id: generateId("FOOD"),

      name: document.getElementById("foodName").value.trim(),

      meal: document.getElementById("foodMeal").value,

      price: Number(document.getElementById("foodPrice").value),

      available: true,
    });

    saveData();

    closeModal("foodModal");

    renderFood();

    updateDashboard();

    alert("Food item added successfully.");
  });

function toggleFood(id) {
  const data = getDateData();

  const food = data.food.find((item) => item.id === id);

  if (!food) return;

  food.available = !food.available;

  saveData();

  renderFood();

  updateDashboard();
}

function deleteFood(id) {
  if (!confirm("Delete this food item?")) return;

  const data = getDateData();

  data.food = data.food.filter((item) => item.id !== id);

  saveData();

  renderFood();

  updateDashboard();
}

/* =========================================================
   BILLING
   ========================================================= */

function renderBilling() {
  const data = getDateData();

  const container = document.getElementById("billingList");

  const activeBookings = data.bookings.filter(
    (booking) => booking.status !== "cancelled",
  );

  const roomRevenue = activeBookings.reduce(
    (sum, booking) => sum + Number(booking.total),
    0,
  );

  const foodRevenue = 0;

  const totalRevenue = roomRevenue + foodRevenue;

  document.getElementById("roomRevenue").textContent = money(roomRevenue);

  document.getElementById("foodRevenue").textContent = money(foodRevenue);

  document.getElementById("totalRevenue").textContent = money(totalRevenue);

  if (!activeBookings.length) {
    container.innerHTML = `
            <div class="empty-state">
                No bills generated for this date.
            </div>
        `;

    return;
  }

  container.innerHTML = activeBookings
    .map((booking) => {
      return `

                <div class="billing-card">

                    <div class="billing-card-top">

                        <div>

                            <h3>
                                ${escapeHtml(booking.guest)}
                            </h3>

                            <p>
                                Room ${booking.room}
                                •
                                ${booking.stayDays} day(s)
                            </p>

                        </div>

                        <div class="invoice-total">
                            ${money(booking.total)}
                        </div>

                    </div>

                    <div style="margin-top:15px">

                        <button
                            class="action-btn view-btn"
                            onclick="showInvoice('${booking.id}')"
                        >
                            🧾 View Invoice
                        </button>

                    </div>

                </div>

            `;
    })
    .join("");
}

/* =========================================================
   INVOICE
   ========================================================= */

function showInvoice(id) {
  const data = getDateData();

  const booking = data.bookings.find((item) => item.id === id);

  if (!booking) return;

  const invoice = document.getElementById("invoiceContent");

  invoice.innerHTML = `

        <div class="invoice">

            <div class="invoice-header">

                <div>

                    <h2>GrandStay</h2>

                    <p style="font-size:11px;color:#777">
                        Hotel Management System
                    </p>

                </div>

                <div class="invoice-meta">

                    <strong>
                        INVOICE
                    </strong>

                    <br>

                    ${booking.id}

                    <br>

                    ${formatDate(selectedDate)}

                </div>

            </div>


            <div class="invoice-section">

                <h4>Guest Details</h4>

                <div class="invoice-row">

                    <span>Guest Name</span>

                    <strong>
                        ${escapeHtml(booking.guest)}
                    </strong>

                </div>

                <div class="invoice-row">

                    <span>Phone</span>

                    <strong>
                        ${escapeHtml(booking.phone)}
                    </strong>

                </div>

            </div>


            <div class="invoice-section">

                <h4>Room Details</h4>

                <div class="invoice-row">

                    <span>
                        Room ${booking.room}
                        (${booking.roomType})
                    </span>

                    <strong>
                        ${money(booking.roomPrice)}
                    </strong>

                </div>

                <div class="invoice-row">

                    <span>
                        Stay Duration
                    </span>

                    <strong>
                        ${booking.stayDays} day(s)
                    </strong>

                </div>

                <div class="invoice-row">

                    <span>
                        Check-in
                    </span>

                    <strong>
                        ${booking.checkIn}
                    </strong>

                </div>

                <div class="invoice-row">

                    <span>
                        Check-out
                    </span>

                    <strong>
                        ${booking.checkOut}
                    </strong>

                </div>

            </div>


            <div class="invoice-section">

                <div class="invoice-row invoice-grand">

                    <span>
                        Total Amount
                    </span>

                    <strong>
                        ${money(booking.total)}
                    </strong>

                </div>

            </div>


            <p style="
                text-align:center;
                color:#777;
                font-size:11px;
                margin-top:20px;
            ">
                Thank you for choosing GrandStay Hotel.
            </p>

        </div>

    `;

  document.getElementById("invoiceModal").classList.add("show");
}

function printInvoice() {
  const content = document.getElementById("invoiceContent").innerHTML;

  const printWindow = window.open("", "_blank", "width=800,height=700");

  printWindow.document.write(`

        <html>

        <head>

            <title>GrandStay Invoice</title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                }

                .invoice-header {
                    display:flex;
                    justify-content:space-between;
                    border-bottom:2px solid #555;
                    padding-bottom:15px;
                }

                .invoice-row {
                    display:flex;
                    justify-content:space-between;
                    padding:10px 0;
                    border-bottom:1px solid #ddd;
                }

            </style>

        </head>

        <body>

            ${content}

        </body>

        </html>

    `);

  printWindow.document.close();

  printWindow.focus();

  printWindow.print();
}

/* =========================================================
   MODAL
   ========================================================= */

function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("show");
    }
  });
});

/* =========================================================
   DATE EVENTS
   ========================================================= */

document.getElementById("selectedDate").addEventListener("change", function () {
  setSelectedDate(this.value);
});

document.getElementById("prevDay").addEventListener("click", () => {
  moveDate(-1);
});

document.getElementById("nextDay").addEventListener("click", () => {
  moveDate(1);
});

document.getElementById("todayBtn").addEventListener("click", () => {
  setSelectedDate(getTodayString());
});

/* =========================================================
   UPDATE EVERYTHING
   ========================================================= */

function updateAll() {
  getDateData();

  updateDashboard();

  renderGuests();

  renderBookings();

  renderRooms();

  renderFood();

  renderBilling();

  document.getElementById("selectedDate").value = selectedDate;
}

/* =========================================================
   HELPERS
   ========================================================= */

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function statusClass(status) {
  return status.replace(/\s+/g, "").toLowerCase();
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("selectedDate").value = selectedDate;

  getDateData(selectedDate);

  updateAll();
});
