const CallLog = require('../models/CallLog');
const Client = require('../models/Client');

// @desc    Get all call logs for logged-in agent
// @route   GET /api/calllogs
// @access  Private
exports.getCallLogs = async (req, res) => {
  try {
    const callLogs = await CallLog.find({ agent: req.user.id })
      .populate('client', 'firstName lastName phone medicareNumber')
      .sort({ callDate: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: callLogs.length,
      data: callLogs
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get call logs for a specific client
// @route   GET /api/calllogs/client/:clientId
// @access  Private
exports.getCallLogsByClient = async (req, res) => {
  try {
    const callLogs = await CallLog.find({
      client: req.params.clientId,
      agent: req.user.id
    })
      .sort({ callDate: -1 })
      .populate('agent', 'name');

    res.status(200).json({
      success: true,
      count: callLogs.length,
      data: callLogs
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single call log
// @route   GET /api/calllogs/:id
// @access  Private
exports.getCallLog = async (req, res) => {
  try {
    const callLog = await CallLog.findOne({
      _id: req.params.id,
      agent: req.user.id
    })
      .populate('client', 'firstName lastName phone email medicareNumber')
      .populate('agent', 'name email');

    if (!callLog) {
      return res.status(404).json({ success: false, message: 'Call log not found' });
    }

    res.status(200).json({
      success: true,
      data: callLog
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create new call log
// @route   POST /api/calllogs
// @access  Private
exports.createCallLog = async (req, res) => {
  try {
    // Add agent to req.body
    req.body.agent = req.user.id;

    const callLog = await CallLog.create(req.body);

    // Prepare client update
    const clientUpdate = {
      lastContactDate: Date.now()
    };

    // Update client opportunity stage based on call outcome
    if (req.body.outcome === 'closed-won') {
      clientUpdate.opportunityStage = 'closed-won';
      clientUpdate.closedDate = Date.now();
      // If deal info provided, update deal value
      if (req.body.dealInfo && req.body.dealInfo.dealValue) {
        clientUpdate.dealValue = req.body.dealInfo.dealValue;
      }
    } else if (req.body.outcome === 'closed-lost') {
      clientUpdate.opportunityStage = 'closed-lost';
      clientUpdate.closedDate = Date.now();
    } else if (req.body.outcome === 'proposal-sent') {
      clientUpdate.opportunityStage = 'proposal';
    } else if (req.body.outcome === 'negotiation') {
      clientUpdate.opportunityStage = 'negotiation';
    } else if (req.body.outcome === 'qualified') {
      // Only update to 'qualified' if still in lead stage
      const currentClient = await Client.findById(req.body.client);
      if (currentClient && currentClient.opportunityStage === 'lead') {
        clientUpdate.opportunityStage = 'qualified';
      }
    } else if (req.body.outcome === 'not-interested') {
      clientUpdate.opportunityStage = 'closed-lost';
    }

    // Update client
    await Client.findByIdAndUpdate(req.body.client, clientUpdate);

    const populatedCallLog = await CallLog.findById(callLog._id)
      .populate('client', 'firstName lastName phone');

    res.status(201).json({
      success: true,
      data: populatedCallLog
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update call log
// @route   PUT /api/calllogs/:id
// @access  Private
exports.updateCallLog = async (req, res) => {
  try {
    let callLog = await CallLog.findOne({
      _id: req.params.id,
      agent: req.user.id
    });

    if (!callLog) {
      return res.status(404).json({ success: false, message: 'Call log not found' });
    }

    // Store the client ID before updating
    const clientId = callLog.client;

    callLog = await CallLog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('client', 'firstName lastName');

    // Prepare client update
    const clientUpdate = {
      lastContactDate: Date.now()
    };

    // Update client opportunity stage based on call outcome
    if (req.body.outcome === 'closed-won') {
      clientUpdate.opportunityStage = 'closed-won';
      clientUpdate.closedDate = Date.now();
      // If deal info provided, update deal value
      if (req.body.dealInfo && req.body.dealInfo.dealValue) {
        clientUpdate.dealValue = req.body.dealInfo.dealValue;
      }
    } else if (req.body.outcome === 'closed-lost') {
      clientUpdate.opportunityStage = 'closed-lost';
      clientUpdate.closedDate = Date.now();
    } else if (req.body.outcome === 'proposal-sent') {
      clientUpdate.opportunityStage = 'proposal';
    } else if (req.body.outcome === 'negotiation') {
      clientUpdate.opportunityStage = 'negotiation';
    } else if (req.body.outcome === 'qualified') {
      // Only update to 'qualified' if still in lead stage
      const currentClient = await Client.findById(clientId);
      if (currentClient && currentClient.opportunityStage === 'lead') {
        clientUpdate.opportunityStage = 'qualified';
      }
    } else if (req.body.outcome === 'not-interested') {
      clientUpdate.opportunityStage = 'closed-lost';
    }

    // Update client (always update lastContactDate, and status if changed)
    await Client.findByIdAndUpdate(clientId, clientUpdate);

    res.status(200).json({
      success: true,
      data: callLog
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete call log
// @route   DELETE /api/calllogs/:id
// @access  Private
exports.deleteCallLog = async (req, res) => {
  try {
    const callLog = await CallLog.findOne({
      _id: req.params.id,
      agent: req.user.id
    });

    if (!callLog) {
      return res.status(404).json({ success: false, message: 'Call log not found' });
    }

    await callLog.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
