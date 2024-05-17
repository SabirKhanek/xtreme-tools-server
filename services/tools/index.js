const { Op } = require("sequelize");
const {
  SubscriptionPlans,
  ToolUsage,
  Tool,
  ToolQuota,
  sequelize,
} = require("../../db/sequelize");
const { ErrorWithStatus } = require("../../utils/error");
const { UserService } = require("../user");
class ToolsService {
  userService = new UserService();
  async getUsageQuota(plan, tool_id) {
    const _plan = await SubscriptionPlans.findByPk(plan);
    if (!_plan) throw new ErrorWithStatus("Plan not found", 404);
    const tool = await Tool.findByPk(tool_id);
    if (!tool) throw new Error(`Tool with toolid ${tool_id} not exists`, 404);
    // let quota = await ToolQuota.findOne({ where: { plan, tool_id } });
    const quota = await sequelize.query(
      `SELECT tq.* FROM tool_quota tq
        JOIN subscription_plans sp ON tq.plan = sp.id
        WHERE tq.tool_id = :tool_id
        AND sp.level <= :level
        ORDER BY sp.level DESC
        LIMIT 1`,
      {
        replacements: { tool_id, level: _plan.level },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    // console.log(quota);

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

    const date_obj = new Date();
    const date = date_obj.getDate();
    const month = date_obj.getMonth();
    const year = date_obj.getFullYear();
    const tool_usage = await ToolUsage.findOne({
      where: { uid, tool_id, month, year, date },
    });
    if (!tool_usage) {
      return await ToolUsage.create({ month, year, uid, tool_id, date });
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
