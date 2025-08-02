# Academic Calendar Feature

## Overview
The Academic Calendar feature has been successfully integrated into the College Portal website. This feature allows administrators to manage academic events, holidays, and important dates, while students can view these events in an interactive calendar interface.

## Features

### For Students:
- **Interactive Calendar View**: Monthly calendar grid with navigation
- **Event Listings**: Sidebar showing upcoming events organized by month
- **Event Types**: Color-coded events by type (holiday, exam, assignment, etc.)
- **Responsive Design**: Works on desktop and mobile devices
- **Event Details**: Hover effects and visual indicators for events

### For Administrators:
- **Event Management**: Add, edit, delete, and toggle event status
- **Event Types**: 7 different event categories (holiday, exam, assignment, meeting, seminar, workshop, other)
- **Bulk Management**: View all events in a table format
- **Status Control**: Activate/deactivate events without deletion
- **Form Validation**: Client-side and server-side validation

## File Structure

### Models:
- `models/Calendar.js` - MongoDB schema for calendar events

### Controllers:
- `controllers/calendarController.js` - Business logic for calendar operations

### Routes:
- `routes/calendarRoutes.js` - API endpoints for calendar functionality
- `routes/studentRoutes.js` - Student calendar access
- `routes/adminRoutes.js` - Admin calendar management

### Views:
- `views/calendar.ejs` - Student calendar interface
- `views/admin/manage-calendar.ejs` - Admin event management
- `views/admin/add-calendar-event.ejs` - Add new events
- `views/admin/edit-calendar-event.ejs` - Edit existing events

### Styles:
- `public/css/calendar.css` - Calendar-specific styling

### Validation:
- Updated `middleware/validationMiddleware.js` with calendar schemas

## Event Types

1. **Holiday** (Green) - College holidays and breaks
2. **Exam** (Red) - Examinations and assessments
3. **Assignment** (Yellow) - Assignment due dates
4. **Meeting** (Blue) - Faculty and student meetings
5. **Seminar** (Primary Blue) - Academic seminars and lectures
6. **Workshop** (Gray) - Training sessions and workshops
7. **Other** (Dark) - Miscellaneous events

## API Endpoints

### Student Routes:
- `GET /calendar` - View calendar page
- `GET /calendar/events/:year/:month` - Get events for specific month

### Admin Routes:
- `GET /admin/calendar` - Manage calendar events
- `GET /admin/calendar/add` - Add new event form
- `POST /admin/calendar/add` - Create new event
- `GET /admin/calendar/edit/:id` - Edit event form
- `POST /admin/calendar/edit/:id` - Update event
- `POST /admin/calendar/delete/:id` - Delete event
- `POST /admin/calendar/toggle/:id` - Toggle event status

## Database Schema

```javascript
{
  title: String (required, 3-200 chars),
  description: String (required, min 10 chars),
  eventDate: Date (required),
  eventType: String (enum: holiday, exam, assignment, meeting, seminar, workshop, other),
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: User),
  createdByName: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Navigation Integration

### Student Navigation:
- Added "Calendar" link to main navigation bar
- Accessible to all authenticated students

### Admin Navigation:
- Added "Academic Calendar" section to admin dashboard
- Quick action buttons for calendar management
- Student view includes calendar link

## Usage Instructions

### For Administrators:
1. Navigate to Admin Dashboard
2. Click "Academic Calendar" section
3. Use "Manage Calendar" to view all events
4. Use "Add Event" to create new events
5. Edit or delete events as needed

### For Students:
1. Click "Calendar" in the main navigation
2. Browse events by month using navigation buttons
3. View event details in the sidebar
4. Events are color-coded by type for easy identification

## Technical Implementation

- **Frontend**: EJS templates with Bootstrap 5 and custom CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Joi schema validation
- **Authentication**: Session-based with role-based access control
- **Responsive**: Mobile-first design with CSS Grid

## Security Features

- Role-based access control (students vs admins)
- Input validation and sanitization
- CSRF protection through form tokens
- Session management
- SQL injection prevention through Mongoose

## Future Enhancements

Potential improvements for future versions:
- Event recurrence (weekly, monthly, yearly)
- Event reminders and notifications
- Calendar export (PDF, iCal)
- Event search and filtering
- Integration with external calendar systems
- Email notifications for upcoming events
- Calendar sharing between departments 