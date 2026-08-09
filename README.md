# Campus Event & Club Discovery

A full-stack web app that centralizes campus club events into one searchable,
filterable board — solving the problem of events getting lost across
WhatsApp groups and Instagram stories.

## Live Links
- Frontend: https://your-frontend.vercel.app
- Backend API: https://campus-event-api.onrender.com

## What I Built
- Full CRUD for events (create, view, edit, delete)
- Search by title/description
- Filter by club, category, and date
- Automatic status calculation (Upcoming / Ongoing / Past) based on event date
- Responsive design — usable on both mobile and desktop
- Input validation on both frontend (HTML `required`) and backend (Mongoose schema)

## Tech Stack
- **Frontend:** HTML, CSS, vanilla JavaScript (fetch API)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (via Mongoose)
- **Deployment:** Vercel (frontend), Render (backend)

## API Endpoints
| Method | Route | Purpose |
|---|---|---|
| GET | /api/events | Get all events (supports ?search, ?club, ?category, ?date) |
| GET | /api/events/:id | Get a single event |
| POST | /api/events | Create a new event |
| PUT | /api/events/:id | Update an event |
| DELETE | /api/events/:id | Delete an event |

## One Challenge I Faced
[Write this yourself — genuinely. Some real candidates for what you actually
ran into while building this: getting CORS working between frontend and
backend, handling the date-format mismatch between MongoDB's stored dates
and the HTML date input's expected "YYYY-MM-DD" format, or figuring out
event delegation for dynamically-created Edit/Delete buttons. Pick whichever
ACTUALLY gave you trouble, and describe what the problem looked like and
how you debugged/fixed it.]

## One Thing I'd Improve With More Time
[Also genuinely yours. Real options based on what we built: adding
authentication so only the club that created an event can edit/delete it,
adding pagination once there are many events, adding image uploads for
events, or replacing the native `confirm()` delete dialog with a proper
custom modal. Pick one you'd actually prioritize and briefly say why.]

## Running Locally
1. Clone the repo
2. In `backend/`: `npm install`, create a `.env` with `MONGO_URI` and `PORT`, then `npm run dev`
3. In `frontend/`: open `index.html` with Live Server (or any static server)