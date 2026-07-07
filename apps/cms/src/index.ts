import type { Core } from '@strapi/strapi';

const PUBLIC_PROJECT_ACTIONS = [
  'api::project.project.find',
  'api::project.project.findOne',
];

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    const existingPermissions = await strapi
      .query('plugin::users-permissions.permission')
      .findMany({ where: { role: publicRole.id } });

    const existingActions = new Set(existingPermissions.map((p) => p.action));

    const missingActions = PUBLIC_PROJECT_ACTIONS.filter(
      (action) => !existingActions.has(action),
    );

    for (const action of missingActions) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
    }
  },
};
