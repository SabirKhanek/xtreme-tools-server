const { sequelize, DataTypes } = require("./");

const User = require("./models/user")(sequelize, DataTypes);
const OTPToken = require("./models/otp_tokens")(sequelize, DataTypes);

const Tool = require("./models/tool")(sequelize, DataTypes);
const ToolQuota = require("./models/tool_quota")(sequelize, DataTypes);
const ToolUsage = require("./models/tool_usage")(sequelize, DataTypes);
const SubscriptionPlans = require("./models/subscription_plans")(
  sequelize,
  DataTypes
);
const NewsletterSubscriber = require("./models/newsletter_subscriber")(
  sequelize,
  DataTypes
);

User.hasMany(OTPToken, { foreignKey: "uid" });
OTPToken.belongsTo(User, { foreignKey: "uid" });

SubscriptionPlans.hasMany(User, { foreignKey: "user_plan" });
User.belongsTo(SubscriptionPlans, { foreignKey: "user_plan" });

SubscriptionPlans.hasMany(ToolQuota, { foreignKey: "plan" });
ToolQuota.belongsTo(SubscriptionPlans, { foreignKey: "plan" });

Tool.hasMany(ToolQuota, { foreignKey: "tool_id" });
ToolQuota.belongsTo(Tool, { foreignKey: "tool_id" });

User.hasMany(ToolUsage, { foreignKey: "uid" });
ToolUsage.belongsTo(User, { foreignKey: "uid" });

Tool.hasMany(ToolUsage, { foreignKey: "tool_id" });
ToolUsage.belongsTo(Tool, { foreignKey: "tool_id" });

const plans = [
  { id: "free", name: "Free Plan" },
  { id: "basic", name: "Basic Plan" },
];
const tools = [
  {
    id: "outline_generator",
    name: "Outline Generator",
    quota: [{ plan: "basic", quota: 20 }],
  },
  {
    id: "ai_translator",
    name: "AI translator",
    quota: [{ plan: "basic", quota: 20 }],
  },
  {
    id: "ai_writer",
    name: "AI Writer",
    quota: [{ plan: "basic", quota: 20 }],
  },
  {
    id: "ai_rewriter",
    name: "AI Rewriter",
    quota: [{ plan: "basic", quota: 20 }],
  },
  {
    id: "keywords_research",
    name: "Keywords Research",
    quota: [{ plan: "basic", quota: 10 }],
  },
  {
    id: "people_also_ask_tool",
    name: "People Also Ask Tool",
    quota: [{ plan: "basic", quota: 10 }],
  },
  {
    id: "backlinks_checker",
    name: "Backlinks Checker",
    quota: [{ plan: "basic", quota: 10 }],
  },
  {
    id: "competitors_keyword_checker",
    name: "Competitors Keyword Research",
    quota: [{ plan: "basic", quota: 10 }],
  },
  {
    id: "domain_authority_checker",
    name: "Domain Authority Checker",
    quota: [{ plan: "basic", quota: 10 }],
  },
];

module.exports = {
  User,
  OTPToken,
  SubscriptionPlans,
  Tool,
  ToolQuota,
  ToolUsage,
  NewsletterSubscriber,
  sequelize,
};

async function seed() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Seed Subscription Plans
    for (const plan of plans) {
      const existingPlan = await SubscriptionPlans.findByPk(plan.id);
      if (!existingPlan) {
        await SubscriptionPlans.create(plan);
        console.log(`Created plan: ${plan.name}`);
      }
    }

    // Seed Tools and Tool Quotas
    for (const tool of tools) {
      const existingTool = await Tool.findByPk(tool.id);
      if (!existingTool) {
        // Create Tool
        const newTool = await Tool.create({
          id: tool.id,
          name: tool.name,
        });
        console.log(`Created tool: ${tool.name}`);

        // Create Tool Quotas
        for (const quota of tool.quota) {
          await ToolQuota.create({
            tool_id: newTool.id,
            plan: quota.plan,
            quota: quota.quota,
          });
          console.log(
            `Created quota for tool ${tool.name} under plan ${quota.plan}`
          );
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Call the seed function
// seed();
