import type { Core } from '@strapi/strapi';

const PUBLIC_ACTIONS = [
  'api::project.project.find',
  'api::project.project.findOne',
  'api::site-setting.site-setting.find',
];

const DEFAULT_SITE_SETTINGS = {
  siteName: 'MIORA WEB',
  headingFont: 'Fraunces',
  bodyFont: 'Inter',
  colorPaper: '#FFFFFF',
  colorLinen: '#E4E1D9',
  colorInk: '#000000',
  footerTagline: "Let's build your digital presence.",
  footerEmail: 'hello@miora.web',
};

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
      const existingPermissions = await strapi
        .query('plugin::users-permissions.permission')
        .findMany({ where: { role: publicRole.id } });

      const existingActions = new Set(existingPermissions.map((p) => p.action));
      const missingActions = PUBLIC_ACTIONS.filter((action) => !existingActions.has(action));

      for (const action of missingActions) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action, role: publicRole.id },
        });
      }
    }

    const existingSettings = await strapi.query('api::site-setting.site-setting').findOne({});
    if (!existingSettings) {
      await strapi.query('api::site-setting.site-setting').create({
        data: DEFAULT_SITE_SETTINGS,
      });
    }
  },
};
