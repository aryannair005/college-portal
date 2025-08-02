const Calendar = require('../models/Calendar');

// === STUDENT FUNCTIONS ===

exports.getCalendarPage = async (req, res) => {
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        // Get events for current month and next month
        const startDate = new Date(currentYear, currentMonth, 1);
        const endDate = new Date(currentYear, currentMonth + 2, 0);

        const events = await Calendar.find({
            eventDate: { $gte: startDate, $lte: endDate },
            isActive: true
        }).sort({ eventDate: 1 });

        // Group events by month
        const eventsByMonth = {};
        events.forEach(event => {
            const monthKey = `${event.eventDate.getFullYear()}-${event.eventDate.getMonth() + 1}`;
            if (!eventsByMonth[monthKey]) {
                eventsByMonth[monthKey] = [];
            }
            eventsByMonth[monthKey].push(event);
        });

        res.render('calendar', {
            title: 'Academic Calendar',
            events,
            eventsByMonth,
            currentYear,
            currentMonth
        });
    } catch (error) {
        console.error('Error loading calendar:', error);
        req.session.messages = ['Error loading calendar'];
        res.render('calendar', {
            title: 'Academic Calendar',
            events: [],
            eventsByMonth: {},
            currentYear: new Date().getFullYear(),
            currentMonth: new Date().getMonth()
        });
    }
};

exports.getCalendarEvents = async (req, res) => {
    try {
        const { year, month } = req.params;
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0);

        const events = await Calendar.find({
            eventDate: { $gte: startDate, $lte: endDate },
            isActive: true
        }).sort({ eventDate: 1 });

        res.json(events);
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        res.status(500).json({ error: 'Error fetching events' });
    }
};

// === ADMIN FUNCTIONS ===

exports.getAdminCalendarPage = async (req, res) => {
    try {
        const events = await Calendar.find()
            .sort({ eventDate: -1 })
            .populate('createdBy', 'username');

        res.render('admin/manage-calendar', {
            title: 'Manage Academic Calendar',
            events
        });
    } catch (error) {
        console.error('Error loading calendar for admin:', error);
        req.session.messages = ['Error loading calendar'];
        res.render('admin/manage-calendar', {
            title: 'Manage Academic Calendar',
            events: []
        });
    }
};

exports.getAddCalendarEventPage = (req, res) => {
    res.render('admin/add-calendar-event', { title: 'Add Calendar Event' });
};

exports.postAddCalendarEvent = async (req, res) => {
    try {
        const { title, description, eventDate, eventType } = req.body;

        const calendarEvent = new Calendar({
            title,
            description,
            eventDate: new Date(eventDate),
            eventType: eventType || 'other',
            createdBy: req.session.userId,
            createdByName: req.session.username
        });

        await calendarEvent.save();
        req.session.messages = ['Calendar event added successfully'];
        res.redirect('/admin/calendar');
    } catch (error) {
        console.error('Error adding calendar event:', error);
        req.session.messages = ['Error adding calendar event'];
        res.redirect('/admin/calendar/add');
    }
};

exports.getEditCalendarEventPage = async (req, res) => {
    try {
        const event = await Calendar.findById(req.params.id);
        
        if (!event) {
            req.session.messages = ['Event not found'];
            return res.redirect('/admin/calendar');
        }

        res.render('admin/edit-calendar-event', {
            title: 'Edit Calendar Event',
            event
        });
    } catch (error) {
        console.error('Error loading event for edit:', error);
        req.session.messages = ['Error loading event'];
        res.redirect('/admin/calendar');
    }
};

exports.postEditCalendarEvent = async (req, res) => {
    try {
        const { title, description, eventDate, eventType } = req.body;
        
        const event = await Calendar.findById(req.params.id);
        
        if (!event) {
            req.session.messages = ['Event not found'];
            return res.redirect('/admin/calendar');
        }

        event.title = title;
        event.description = description;
        event.eventDate = new Date(eventDate);
        event.eventType = eventType;
        event.updatedAt = Date.now();

        await event.save();
        req.session.messages = ['Calendar event updated successfully'];
        res.redirect('/admin/calendar');
    } catch (error) {
        console.error('Error updating calendar event:', error);
        req.session.messages = ['Error updating calendar event'];
        res.redirect('/admin/calendar');
    }
};

exports.deleteCalendarEvent = async (req, res) => {
    try {
        const event = await Calendar.findById(req.params.id);

        if (!event) {
            req.session.messages = ['Event not found'];
            return res.redirect('/admin/calendar');
        }

        await Calendar.findByIdAndDelete(req.params.id);
        req.session.messages = ['Calendar event deleted successfully'];
        res.redirect('/admin/calendar');
    } catch (error) {
        console.error('Error deleting calendar event:', error);
        req.session.messages = ['Error deleting calendar event'];
        res.redirect('/admin/calendar');
    }
};

exports.toggleCalendarEventStatus = async (req, res) => {
    try {
        const event = await Calendar.findById(req.params.id);

        if (!event) {
            req.session.messages = ['Event not found'];
            return res.redirect('/admin/calendar');
        }

        event.isActive = !event.isActive;
        await event.save();

        req.session.messages = [`Event ${event.isActive ? 'activated' : 'deactivated'} successfully`];
        res.redirect('/admin/calendar');
    } catch (error) {
        console.error('Error toggling event status:', error);
        req.session.messages = ['Error updating event status'];
        res.redirect('/admin/calendar');
    }
}; 