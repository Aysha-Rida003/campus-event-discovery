// Base URL of our backend API.
// While developing locally, this points at our Express server.
// Update this to your deployed Render URL when you deploy (Step 12).
const API_URL = 'http://localhost:5000/api/events';

// Keep a copy of all events in memory so we can filter/search
// without re-fetching from the server every time.
let allEvents = [];

// Grab references to the DOM elements we'll need repeatedly
const eventGrid = document.getElementById('eventGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const clubFilter = document.getElementById('clubFilter');
const categoryFilter = document.getElementById('categoryFilter');
const dateFilter = document.getElementById('dateFilter');

const addEventBtn = document.getElementById('addEventBtn');
const eventModal = document.getElementById('eventModal');
const modalTitle = document.getElementById('modalTitle');
const eventForm = document.getElementById('eventForm');
const cancelBtn = document.getElementById('cancelBtn');

// Form fields
const eventIdField = document.getElementById('eventId');
const titleField = document.getElementById('title');
const clubField = document.getElementById('club');
const categoryField = document.getElementById('category');
const dateField = document.getElementById('date');
const venueField = document.getElementById('venue');
const descriptionField = document.getElementById('description');

// ---------- FETCH & RENDER ----------

async function fetchEvents() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    allEvents = await response.json();
    populateFilterOptions();
    renderEvents(allEvents);
  } catch (err) {
    console.error(err);
    eventGrid.innerHTML = `<p class="empty-state">Could not load events. Is the backend running?</p>`;
  }
}

function getEventStatus(eventDateStr) {
  const eventDate = new Date(eventDateStr);
  const today = new Date();

  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (eventDate.getTime() === today.getTime()) return 'Ongoing';
  if (eventDate.getTime() > today.getTime()) return 'Upcoming';
  return 'Past';
}

function renderEvents(events) {
  eventGrid.innerHTML = '';

  if (events.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  events.forEach(event => {
    const status = getEventStatus(event.date);
    const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    const card = document.createElement('article');
    card.className = 'event-card';

    card.innerHTML = `
      <span class="status-badge status-${status.toLowerCase()}">${status}</span>
      <h3>${event.title}</h3>
      <p class="event-meta">${event.club} • ${event.category}</p>
      <p class="event-meta">📅 ${formattedDate} &nbsp; 📍 ${event.venue}</p>
      <p class="event-desc">${event.description || ''}</p>
      <div class="card-actions">
        <button class="btn-edit" data-id="${event._id}">Edit</button>
        <button class="btn-delete" data-id="${event._id}">Delete</button>
      </div>
    `;

    eventGrid.appendChild(card);
  });
}

function populateFilterOptions() {
  const clubs = [...new Set(allEvents.map(e => e.club))];
  const categories = [...new Set(allEvents.map(e => e.category))];

  clubFilter.innerHTML = '<option value="">All Clubs</option>';
  clubs.forEach(club => {
    const option = document.createElement('option');
    option.value = club;
    option.textContent = club;
    clubFilter.appendChild(option);
  });

  categoryFilter.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// ---------- SEARCH & FILTER ----------

function applyFiltersAndSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedClub = clubFilter.value;
  const selectedCategory = categoryFilter.value;
  const selectedDate = dateFilter.value;

  let filtered = allEvents.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm) ||
      (event.description || '').toLowerCase().includes(searchTerm);

    const matchesClub = !selectedClub || event.club === selectedClub;
    const matchesCategory = !selectedCategory || event.category === selectedCategory;

    const matchesDate =
      !selectedDate ||
      new Date(event.date).toISOString().slice(0, 10) === selectedDate;

    return matchesSearch && matchesClub && matchesCategory && matchesDate;
  });

  renderEvents(filtered);
}

searchInput.addEventListener('input', applyFiltersAndSearch);
clubFilter.addEventListener('change', applyFiltersAndSearch);
categoryFilter.addEventListener('change', applyFiltersAndSearch);
dateFilter.addEventListener('change', applyFiltersAndSearch);

// ---------- MODAL: ADD / EDIT ----------

function openAddModal() {
  modalTitle.textContent = 'Add Event';
  eventForm.reset();
  eventIdField.value = '';
  eventModal.hidden = false;
}

function closeModal() {
  eventModal.hidden = true;
}

function openEditModal(event) {
  modalTitle.textContent = 'Edit Event';

  eventIdField.value = event._id;
  titleField.value = event.title;
  clubField.value = event.club;
  categoryField.value = event.category;
  dateField.value = new Date(event.date).toISOString().slice(0, 10);
  venueField.value = event.venue;
  descriptionField.value = event.description || '';

  eventModal.hidden = false;
}

addEventBtn.addEventListener('click', openAddModal);
cancelBtn.addEventListener('click', closeModal);

eventModal.addEventListener('click', (e) => {
  if (e.target === eventModal) closeModal();
});

// ---------- CREATE / UPDATE (form submit) ----------

eventForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const eventData = {
    title: titleField.value.trim(),
    club: clubField.value.trim(),
    category: categoryField.value.trim(),
    date: dateField.value,
    venue: venueField.value.trim(),
    description: descriptionField.value.trim()
  };

  const id = eventIdField.value;

  try {
    let response;

    if (id) {
      response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
    } else {
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    }

    closeModal();
    await fetchEvents();
  } catch (err) {
    alert(`Error saving event: ${err.message}`);
  }
});

// ---------- DELETE (and Edit trigger) via event delegation ----------

eventGrid.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('btn-edit')) {
    const event = allEvents.find(ev => ev._id === id);
    if (event) openEditModal(event);
  }

  if (e.target.classList.contains('btn-delete')) {
    const confirmed = confirm('Delete this event? This cannot be undone.');
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete event');
      await fetchEvents();
    } catch (err) {
      alert(`Error deleting event: ${err.message}`);
    }
  }
});

// ---------- INITIAL LOAD ----------

fetchEvents();