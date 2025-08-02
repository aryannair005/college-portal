const Joi = require('joi');

// Joi Schemas
const schemas = {
    // Auth Validation
    registerSchema: Joi.object({
        username: Joi.string().trim().alphanum().min(3).max(30).required().messages({
            'string.base': 'Username should be a type of text',
            'string.empty': 'Username cannot be empty',
            'string.alphanum': 'Username can only contain alpha-numeric characters',
            'string.min': 'Username should have a minimum length of {#limit}',
            'string.max': 'Username should have a maximum length of {#limit}',
            'any.required': 'Username is required'
        }),
        email: Joi.string().trim().email().required().messages({
            'string.base': 'Email should be a type of text',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required'
        }),
        password: Joi.string().min(6).required().messages({
            'string.base': 'Password should be a type of text',
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password should have a minimum length of {#limit}',
            'any.required': 'Password is required'
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Confirm Password is required'
        })
    }),

    loginSchema: Joi.object({
        username: Joi.string().trim().required().messages({
            'string.base': 'Username should be a type of text',
            'string.empty': 'Username cannot be empty',
            'any.required': 'Username is required'
        }),
        password: Joi.string().required().messages({
            'string.base': 'Password should be a type of text',
            'string.empty': 'Password cannot be empty',
            'any.required': 'Password is required'
        })
    }),

    // Admin Creation Schema - More flexible for better UX
    createAdminSchema: Joi.object({
        secretCode: Joi.string().trim().required().messages({
            'string.base': 'Secret code should be a type of text',
            'string.empty': 'Secret code cannot be empty',
            'any.required': 'Secret code is required'
        }),
        username: Joi.string().trim().alphanum().min(3).max(30).required().messages({
            'string.base': 'Username should be a type of text',
            'string.empty': 'Username cannot be empty',
            'string.alphanum': 'Username can only contain alpha-numeric characters',
            'string.min': 'Username should have a minimum length of {#limit}',
            'string.max': 'Username should have a maximum length of {#limit}',
            'any.required': 'Username is required'
        }),
        email: Joi.string().trim().email().required().messages({
            'string.base': 'Email should be a type of text',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required'
        }),
        password: Joi.string().min(8).required().messages({
            'string.base': 'Password should be a type of text',
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password should have a minimum length of {#limit}',
            'any.required': 'Password is required'
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Confirm Password is required'
        })
    }),

    // Admin Schemas
    addResourceSchema: Joi.object({
        title: Joi.string().trim().min(3).max(100).required().messages({
            'string.empty': 'Title cannot be empty',
            'string.min': 'Title should have a minimum length of {#limit}',
            'string.max': 'Title should have a maximum length of {#limit}',
            'any.required': 'Title is required'
        }),
        course: Joi.string().trim().required().messages({
            'string.empty': 'Course cannot be empty',
            'any.required': 'Course is required'
        }),
        semester: Joi.number().integer().min(1).max(10).required().messages({
            'number.base': 'Semester should be a number',
            'number.integer': 'Semester should be an integer',
            'number.min': 'Semester must be at least {#limit}',
            'number.max': 'Semester must be at most {#limit}',
            'any.required': 'Semester is required'
        }),
        subject: Joi.string().trim().required().messages({
            'string.empty': 'Subject cannot be empty',
            'any.required': 'Subject is required'
        }),
        type: Joi.string().valid('pdf', 'link').required().messages({
            'any.only': 'Type must be either "pdf" or "link"',
            'any.required': 'Type is required'
        }),
        url: Joi.string().uri().allow('').messages({ // URL is optional, only if type is 'link'
            'string.uri': 'URL must be a valid URI'
        })
    }),

    addPyqSchema: Joi.object({
        course: Joi.string().trim().required().messages({
            'string.empty': 'Course cannot be empty',
            'any.required': 'Course is required'
        }),
        semester: Joi.number().integer().min(1).max(10).required().messages({
            'number.base': 'Semester should be a number',
            'number.integer': 'Semester should be an integer',
            'number.min': 'Semester must be at least {#limit}',
            'number.max': 'Semester must be at most {#limit}',
            'any.required': 'Semester is required'
        }),
        subject: Joi.string().trim().required().messages({
            'string.empty': 'Subject cannot be empty',
            'any.required': 'Subject is required'
        })
    }),

    addSyllabusSchema: Joi.object({
        title: Joi.string().trim().min(3).max(100).required().messages({
            'string.empty': 'Title cannot be empty',
            'string.min': 'Title should have a minimum length of {#limit}',
            'string.max': 'Title should have a maximum length of {#limit}',
            'any.required': 'Title is required'
        }),
        course: Joi.string().trim().required().messages({
            'string.empty': 'Course cannot be empty',
            'any.required': 'Course is required'
        }),
        semester: Joi.number().integer().min(1).max(10).required().messages({
            'number.base': 'Semester should be a number',
            'number.integer': 'Semester should be an integer',
            'number.min': 'Semester must be at least {#limit}',
            'number.max': 'Semester must be at most {#limit}',
            'any.required': 'Semester is required'
        }),
        subject: Joi.string().trim().required().messages({
            'string.empty': 'Subject cannot be empty',
            'any.required': 'Subject is required'
        }),
        description: Joi.string().trim().allow(''), // Optional
        type: Joi.string().valid('pdf', 'link').required().messages({
            'any.only': 'Type must be either "pdf" or "link"',
            'any.required': 'Type is required'
        }),
        url: Joi.string().uri().allow('').messages({ // URL is optional, only if type is 'link'
            'string.uri': 'URL must be a valid URI'
        })
    }),

    addYoutubeLinkSchema: Joi.object({
        topicName: Joi.string().trim().min(3).max(100).required().messages({
            'string.empty': 'Topic name cannot be empty',
            'string.min': 'Topic name should have a minimum length of {#limit}',
            'string.max': 'Topic name should have a maximum length of {#limit}',
            'any.required': 'Topic name is required'
        }),
        url: Joi.string().trim().uri().pattern(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/).required().messages({
            'string.empty': 'URL cannot be empty',
            'string.uri': 'URL must be a valid URI',
            'string.pattern.base': 'Please enter a valid YouTube URL (e.g., youtube.com/watch?v=...)',
            'any.required': 'URL is required'
        })
    }),

    bulkAddYoutubeLinksSchema: Joi.object({
        links: Joi.array().items(
            Joi.object({
                topicName: Joi.string().trim().min(3).max(100).required(),
                url: Joi.string().trim().uri().pattern(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/).required()
            })
        ).min(1).required().messages({
            'array.min': 'At least one link is required for bulk upload.'
        })
    }),

    // Doubt Schemas
    addDoubtSchema: Joi.object({
        title: Joi.string().trim().min(5).max(200).required().messages({
            'string.empty': 'Title cannot be empty',
            'string.min': 'Title should have a minimum length of {#limit}',
            'string.max': 'Title should have a maximum length of {#limit}',
            'any.required': 'Title is required'
        }),
        description: Joi.string().trim().min(10).required().messages({
            'string.empty': 'Description cannot be empty',
            'string.min': 'Description should have a minimum length of {#limit}',
            'any.required': 'Description is required'
        }),
        course: Joi.string().trim().required().messages({
            'string.empty': 'Course cannot be empty',
            'any.required': 'Course is required'
        }),
        semester: Joi.number().integer().min(1).max(10).required().messages({
            'number.base': 'Semester should be a number',
            'number.integer': 'Semester should be an integer',
            'number.min': 'Semester must be at least {#limit}',
            'number.max': 'Semester must be at most {#limit}',
            'any.required': 'Semester is required'
        }),
        subject: Joi.string().trim().required().messages({
            'string.empty': 'Subject cannot be empty',
            'any.required': 'Subject is required'
        })
        // image is handled by multer, not directly validated by Joi here
    }),

    replyToDoubtSchema: Joi.object({
        message: Joi.string().trim().min(5).required().messages({
            'string.empty': 'Reply message cannot be empty',
            'string.min': 'Reply message should have a minimum length of {#limit}',
            'any.required': 'Reply message is required'
        })
    }),

    // Student Query Schemas (for getResources, getPyqs, getSyllabus)
    studentQuerySchema: Joi.object({
        course: Joi.string().trim().allow(''),
        semester: Joi.number().integer().min(1).max(10).allow(''),
        subject: Joi.string().trim().allow('')
    }),

    // Notice Schemas
    addNoticeSchema: Joi.object({
        title: Joi.string().trim().min(3).max(200).required().messages({
            'string.empty': 'Title cannot be empty',
            'string.min': 'Title should have a minimum length of {#limit}',
            'string.max': 'Title should have a maximum length of {#limit}',
            'any.required': 'Title is required'
        }),
        description: Joi.string().trim().min(10).required().messages({
            'string.empty': 'Description cannot be empty',
            'string.min': 'Description should have a minimum length of {#limit}',
            'any.required': 'Description is required'
        }),
        priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium').messages({
            'any.only': 'Priority must be one of: low, medium, high, urgent'
        })
        // image is handled by multer, not directly validated by Joi here
    }),

    // Profile Update Schema
    profileUpdateSchema: Joi.object({
        fullName: Joi.string().trim().min(2).max(100).allow('').messages({
            'string.min': 'Full name should have a minimum length of {#limit}',
            'string.max': 'Full name should have a maximum length of {#limit}'
        }),
        email: Joi.string().email().allow('').optional().messages({
            'string.email': 'Email must be a valid email address'
        }), // Allow email but ignore it in processing
        phone: Joi.string().trim().pattern(/^[+]?[\d\s\-\(\)]{7,15}$/).allow('').messages({
            'string.pattern.base': 'Please enter a valid phone number'
        }),
        rollNo: Joi.string().trim().alphanum().max(20).allow('').messages({
            'string.alphanum': 'Roll number can only contain letters and numbers',
            'string.max': 'Roll number should have a maximum length of {#limit}'
        }),
        course: Joi.string().trim().max(100).allow('').messages({
            'string.max': 'Course name should have a maximum length of {#limit}'
        }),
        bio: Joi.string().trim().max(500).allow('').messages({
            'string.max': 'Bio should have a maximum length of {#limit} characters'
        }),
        dateOfBirth: Joi.date().max('now').allow('').optional().messages({
            'date.max': 'Date of birth cannot be in the future'
        }),
        address: Joi.string().trim().max(200).allow('').messages({
            'string.max': 'Address should have a maximum length of {#limit}'
        })
    }),

    // Calendar Event Schemas
    addCalendarEventSchema: Joi.object({
        title: Joi.string().trim().min(3).max(200).required().messages({
            'string.empty': 'Event title cannot be empty',
            'string.min': 'Event title should have a minimum length of {#limit}',
            'string.max': 'Event title should have a maximum length of {#limit}',
            'any.required': 'Event title is required'
        }),
        description: Joi.string().trim().min(10).required().messages({
            'string.empty': 'Event description cannot be empty',
            'string.min': 'Event description should have a minimum length of {#limit}',
            'any.required': 'Event description is required'
        }),
        eventDate: Joi.date().required().messages({
            'date.base': 'Event date must be a valid date',
            'any.required': 'Event date is required'
        }),
        eventType: Joi.string().valid('holiday', 'exam', 'assignment', 'meeting', 'seminar', 'workshop', 'other').default('other').messages({
            'any.only': 'Event type must be one of: holiday, exam, assignment, meeting, seminar, workshop, other'
        })
    }),

    editCalendarEventSchema: Joi.object({
        title: Joi.string().trim().min(3).max(200).required().messages({
            'string.empty': 'Event title cannot be empty',
            'string.min': 'Event title should have a minimum length of {#limit}',
            'string.max': 'Event title should have a maximum length of {#limit}',
            'any.required': 'Event title is required'
        }),
        description: Joi.string().trim().min(10).required().messages({
            'string.empty': 'Event description cannot be empty',
            'string.min': 'Event description should have a minimum length of {#limit}',
            'any.required': 'Event description is required'
        }),
        eventDate: Joi.date().required().messages({
            'date.base': 'Event date must be a valid date',
            'any.required': 'Event date is required'
        }),
        eventType: Joi.string().valid('holiday', 'exam', 'assignment', 'meeting', 'seminar', 'workshop', 'other').default('other').messages({
            'any.only': 'Event type must be one of: holiday, exam, assignment, meeting, seminar, workshop, other'
        })
    }),
};

// Route mapping for better redirect handling
const routeRedirectMap = {
    // Auth routes
    'loginSchema': '/login',
    'registerSchema': '/register',
    'createAdminSchema': '/create-admin',
    
    // Admin routes
    'addResourceSchema': '/admin/add-resource',
    'addPyqSchema': '/admin/add-pyq',
    'addSyllabusSchema': '/admin/add-syllabus',
    'addYoutubeLinkSchema': 'back', // Will use referrer for YouTube links
    'bulkAddYoutubeLinksSchema': 'back',
    'addNoticeSchema': '/admin/add-notice',
    
    // Student/User routes
    'addDoubtSchema': '/doubts/add',
    'replyToDoubtSchema': 'back', // Will use referrer for replies
    
    // Calendar routes
    'addCalendarEventSchema': '/admin/calendar/add',
    'editCalendarEventSchema': 'back', // Will use referrer for edits
    'studentQuerySchema': 'back', // For query params, stay on same page
    'profileUpdateSchema': '/profile/edit'
};

// Helper function to get safe redirect URL
function getSafeRedirectUrl(req, schemaName) {
    const mappedRoute = routeRedirectMap[schemaName];
    
    // If it's mapped to 'back', try to use referrer
    if (mappedRoute === 'back') {
        const referrer = req.get('Referrer') || req.get('Referer');
        if (referrer) {
            try {
                const referrerUrl = new URL(referrer);
                // Make sure referrer is from same origin for security
                if (referrerUrl.origin === `${req.protocol}://${req.get('host')}`) {
                    return referrerUrl.pathname + (referrerUrl.search || '');
                }
            } catch (e) {
                console.error('Invalid referrer URL:', referrer);
            }
        }
        // Fallback to dashboard if no valid referrer
        return '/dashboard';
    }
    
    // Return mapped route or fallback
    return mappedRoute || '/dashboard';
}

// Validation middleware function
const validate = (schemaName, source = 'body') => {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) {
            console.error(`Joi schema "${schemaName}" not found.`);
            req.session.messages = ['Internal server error: Validation schema missing.'];
            return res.redirect(getSafeRedirectUrl(req, schemaName));
        }

        let dataToValidate;
        if (source === 'body') {
            dataToValidate = req.body;
        } else if (source === 'query') {
            dataToValidate = req.query;
        } else {
            console.error(`Invalid source for validation: ${source}. Must be 'body' or 'query'.`);
            req.session.messages = ['Internal server error: Invalid validation source.'];
            return res.redirect(getSafeRedirectUrl(req, schemaName));
        }

        const { error } = schema.validate(dataToValidate, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            console.log('Validation Errors:', errors);
            req.session.messages = errors;

            // Always use safe redirect URL
            const redirectUrl = getSafeRedirectUrl(req, schemaName);
            return res.redirect(redirectUrl);
        }
        next();
    };
};

module.exports = validate;