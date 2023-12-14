const {
  SubscriptionPlans,
  ToolUsage,
  Tool,
  ToolQuota,
} = require("../../db/sequelize");
const { ErrorWithStatus } = require("../../utils/error");
const { UserService } = require("../user");
class ToolsService {
  userService = new UserService();
  async getUsageQuota(plan, tool_id) {
    console.log("Hi");
    const _plan = await SubscriptionPlans.findByPk(plan);
    if (!_plan) throw new ErrorWithStatus("Plan not found", 404);
    const tool = Tool.findByPk(tool_id);
    console.log(tool);
    if (!tool) throw new Error(`Tool with toolid ${tool_id} not exists`, 404);
    const quota = ToolQuota.findOne({ where: { plan, tool_id } });
    if (!quota)
      throw new ErrorWithStatus(
        `Quota is not defined for ${tool_id} under ${plan}`,
        500
      );
    else return quota;
  }

  async getUserToolUsage(uid, tool_id) {
    const user = await this.userService.getUserById(uid);
    if (!user) throw new Error(`User with uid ${uid} not exists`, 404);
    const tool = await Tool.findByPk(tool_id);
    if (!tool) throw new Error(`Tool with toolid ${tool_id} not exists`, 404);

    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    console.log(year);
    const tool_usage = await ToolUsage.findOne({ where: { uid, tool_id } });
    if (!tool_usage) {
      return await ToolUsage.create({ month, year, uid, tool_id });
    } else return tool_usage;
  }

  async getUserToolUsageAndQuota(uid, tool_id) {
    const usage = await this.getUserToolUsage(uid, tool_id);
    const user = await this.userService.getUserById(uid);
    const quota = await this.getUsageQuota(user.user_plan, tool_id);
    return {
      uid: user.uid,
      usage: usage.usage,
      quota: quota.quota,
      exceeded: usage.usage > quota.quota,
    };
  }

  async incrementUserToolUsage(uid, tool_id) {
    const toolUsage = await this.getUserToolUsage(uid, tool_id);
    toolUsage.set("usage", toolUsage.usage + 1);
    return await toolUsage.save();
  }
}

module.exports = { ToolsService };
