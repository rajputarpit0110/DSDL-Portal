const eventService = require('../services/eventService');
const { validateEventInput } = require('../validators/eventValidators');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllEvents = asyncHandler(async (req, res) => {
  // Public users only see published events, admins can see all via a query param (or different route)
  // For simplicity, if admin hits this, maybe we let them see all if they pass ?all=true
  const isAdmin = req.user && req.user.role === 'admin';
  const publishedOnly = isAdmin && req.query.all === 'true' ? false : true;
  
  const events = await eventService.getAllEvents(publishedOnly);
  res.status(200).json(new ApiResponse(200, 'Events fetched successfully', events));
});

exports.getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Event fetched successfully', event));
});

exports.createEvent = asyncHandler(async (req, res) => {
  validateEventInput(req.body);
  const newEvent = await eventService.createEvent(req.body, req.user.userId);
  res.status(201).json(new ApiResponse(201, 'Event created successfully', newEvent));
});

exports.updateEvent = asyncHandler(async (req, res) => {
  if (req.body.title || req.body.type || req.body.date) {
     // rudimentary validation if required fields are passed
  }
  const updatedEvent = await eventService.updateEvent(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, 'Event updated successfully', updatedEvent));
});

exports.deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Event deleted successfully'));
});

exports.publishEvent = asyncHandler(async (req, res) => {
  const { publish } = req.body;
  const updatedEvent = await eventService.publishEvent(req.params.id, publish);
  res.status(200).json(new ApiResponse(200, `Event \${publish ? 'published' : 'unpublished'} successfully`, updatedEvent));
});

// --- Registrations ---

exports.registerForEvent = asyncHandler(async (req, res) => {
  const registration = await eventService.registerUserForEvent(req.params.id, req.user.userId);
  res.status(201).json(new ApiResponse(201, 'Successfully registered for event', registration));
});

exports.getEventRegistrations = asyncHandler(async (req, res) => {
  const registrations = await eventService.getEventRegistrations(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Registrations fetched successfully', registrations));
});
