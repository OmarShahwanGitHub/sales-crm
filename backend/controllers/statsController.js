const Client = require('../models/Client');
const CallLog = require('../models/CallLog');
const User = require('../models/User');

// @desc    Get dashboard stats for logged-in agent
// @route   GET /api/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const agentId = req.user.id;

    // Total leads/contacts
    const totalClients = await Client.countDocuments({ agent: agentId });

    // Clients by opportunity stage
    const leadClients = await Client.countDocuments({ agent: agentId, opportunityStage: 'lead' });
    const qualifiedClients = await Client.countDocuments({ agent: agentId, opportunityStage: 'qualified' });
    const closedWonClients = await Client.countDocuments({ agent: agentId, opportunityStage: 'closed-won' });

    // Revenue metrics
    const closedWonDeals = await Client.find({ 
      agent: agentId, 
      opportunityStage: 'closed-won' 
    }).select('dealValue');
    const totalRevenue = closedWonDeals.reduce((sum, deal) => sum + (deal.dealValue || 0), 0);
    
    // Pipeline value (all active opportunities)
    const pipelineDeals = await Client.find({
      agent: agentId,
      opportunityStage: { $in: ['lead', 'qualified', 'proposal', 'negotiation'] }
    }).select('dealValue');
    const pipelineValue = pipelineDeals.reduce((sum, deal) => sum + (deal.dealValue || 0), 0);

    // Total calls this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const callsThisMonth = await CallLog.countDocuments({
      agent: agentId,
      callDate: { $gte: startOfMonth }
    });

    // Recent calls
    const recentCalls = await CallLog.find({ agent: agentId })
      .populate('client', 'firstName lastName company phone')
      .sort({ callDate: -1 })
      .limit(5);

    // Recent clients
    const recentClients = await Client.find({ agent: agentId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Conversion rate (closed-won / total)
    const conversionRate = totalClients > 0 ? ((closedWonClients / totalClients) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalClients,
        leadClients,
        qualifiedClients,
        closedWonClients,
        callsThisMonth,
        conversionRate,
        totalRevenue,
        pipelineValue,
        recentCalls,
        recentClients
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all agents with their stats
// @route   GET /api/stats/agents
// @access  Private
exports.getAllAgentsStats = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent', isActive: true })
      .select('-password');

    const agentsWithStats = await Promise.all(
      agents.map(async (agent) => {
        const totalClients = await Client.countDocuments({ agent: agent._id });
        const closedWonClients = await Client.countDocuments({
          agent: agent._id,
          opportunityStage: 'closed-won'
        });
        const totalCalls = await CallLog.countDocuments({ agent: agent._id });

        // Calculate revenue
        const closedWonDeals = await Client.find({
          agent: agent._id,
          opportunityStage: 'closed-won'
        }).select('dealValue');
        const totalRevenue = closedWonDeals.reduce((sum, deal) => sum + (deal.dealValue || 0), 0);

        const conversionRate = totalClients > 0
          ? ((closedWonClients / totalClients) * 100).toFixed(1)
          : 0;

        return {
          _id: agent._id,
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
          department: agent.department,
          hireDate: agent.hireDate,
          stats: {
            totalClients,
            closedWonClients,
            totalCalls,
            conversionRate,
            totalRevenue
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      count: agentsWithStats.length,
      data: agentsWithStats
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get specific agent stats
// @route   GET /api/stats/agents/:id
// @access  Private
exports.getAgentStats = async (req, res) => {
  try {
    const agent = await User.findById(req.params.id).select('-password');

    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }

    // Get detailed stats
    const totalClients = await Client.countDocuments({ agent: agent._id });
    const clients = await Client.find({ agent: agent._id }).select('firstName lastName company opportunityStage dealValue');

    const clientsByStage = {
      lead: await Client.countDocuments({ agent: agent._id, opportunityStage: 'lead' }),
      qualified: await Client.countDocuments({ agent: agent._id, opportunityStage: 'qualified' }),
      proposal: await Client.countDocuments({ agent: agent._id, opportunityStage: 'proposal' }),
      negotiation: await Client.countDocuments({ agent: agent._id, opportunityStage: 'negotiation' }),
      closedWon: await Client.countDocuments({ agent: agent._id, opportunityStage: 'closed-won' }),
      closedLost: await Client.countDocuments({ agent: agent._id, opportunityStage: 'closed-lost' })
    };

    const totalCalls = await CallLog.countDocuments({ agent: agent._id });
    const recentCalls = await CallLog.find({ agent: agent._id })
      .populate('client', 'firstName lastName company')
      .sort({ callDate: -1 })
      .limit(10);

    const conversionRate = totalClients > 0
      ? ((clientsByStage.closedWon / totalClients) * 100).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        agent: {
          _id: agent._id,
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
          department: agent.department,
          hireDate: agent.hireDate
        },
        stats: {
          totalClients,
          totalCalls,
          clientsByStage,
          conversionRate
        },
        clients,
        recentCalls
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
