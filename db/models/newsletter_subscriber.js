/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const NewsletterSubscriber = sequelize.define("newsletter_subscriber", {
    email: { type: DataTypes.STRING, primaryKey: true },
    subscribed: { type: DataTypes.BOOLEAN, defaultValue: true },
  });
  return NewsletterSubscriber;
};
