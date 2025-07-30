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
    })
};

// Validation middleware function
const validate = (schemaName, source = 'body') => {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) {
            console.error(`Joi schema "${schemaName}" not found.`);
            req.session.messages = ['Internal server error: Validation schema missing.'];
            return res.redirect('back');
        }

        let dataToValidate;
        if (source === 'body') {
            dataToValidate = req.body;
        } else if (source === 'query') {
            dataToValidate = req.query;
        } else {
            console.error(`Invalid source for validation: ${source}. Must be 'body' or 'query'.`);
            req.session.messages = ['Internal server error: Invalid validation source.'];
            return res.redirect('back');
        }

        const { error } = schema.validate(dataToValidate, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            console.log('Validation Errors:', errors);
            req.session.messages = errors;

            // Always redirect back for POST requests, never to a 404
            if (req.method === 'POST') {
                return res.redirect('back');
            } else {
                // For GET requests with query params, just continue with empty/default values
                return next();
            }
        }
        next();
    };
};

module.exports = validate;