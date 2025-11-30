const Client = require('../models/Client');
const CallLog = require('../models/CallLog');

// @desc    Get all clients for logged-in agent
// @route   GET /api/clients
// @access  Private
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ agent: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      agent: req.user.id
    }).populate('agent', 'name email phone');

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    // Get call logs for this client
    const callLogs = await CallLog.find({ client: client._id })
      .sort({ callDate: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: { ...client.toObject(), callLogs }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
exports.createClient = async (req, res) => {
  try {
    // Add agent to req.body
    req.body.agent = req.user.id;

    const client = await Client.create(req.body);

    res.status(201).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = async (req, res) => {
  try {
    let client = await Client.findOne({
      _id: req.params.id,
      agent: req.user.id
    });

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      agent: req.user.id
    });

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    await client.deleteOne();

    // Also delete all call logs for this client
    await CallLog.deleteMany({ client: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Search clients
// @route   GET /api/clients/search/:query
// @access  Private
exports.searchClients = async (req, res) => {
  try {
    const searchQuery = req.params.query;

    const clients = await Client.find({
      agent: req.user.id,
      $or: [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { phone: { $regex: searchQuery, $options: 'i' } },
        { medicareNumber: { $regex: searchQuery, $options: 'i' } }
      ]
    });

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
