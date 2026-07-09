import type { Core } from '@strapi/strapi';

const PUBLIC_ACTIONS = [
  'api::project.project.find',
  'api::project.project.findOne',
  'api::site-setting.site-setting.find',
];

const DEFAULT_SITE_SETTINGS = {
  siteName: 'MIORA WEB',
  headerCtaLabel: 'Start a project',
  heroEyebrow: 'Web design studio',
  heroHeading: 'Modern websites for hotels, cafes & hospitality brands.',
  heroSubtext:
    'MIORA WEB designs and builds clean, considered digital experiences for independent hospitality businesses that want to feel as good online as they do in person.',
  projectsSectionHeading: 'Selected work',
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
    } else {
      // Backfill any fields added after the entry was first created (e.g. by
      // an earlier deploy) without touching anything already customized.
      const missingFields = Object.fromEntries(
        Object.entries(DEFAULT_SITE_SETTINGS).filter(
          ([key]) => existingSettings[key] === null || existingSettings[key] === undefined,
        ),
      );

      if (Object.keys(missingFields).length > 0) {
        await strapi.query('api::site-setting.site-setting').update({
          where: { id: existingSettings.id },
          data: missingFields,
        });
      }
    }
  },
};
