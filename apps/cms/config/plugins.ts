import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedExecutableTypes = [
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  // Render's (and most free-tier hosts') filesystem is ephemeral — files
  // written to local disk vanish on every redeploy/restart, even though the
  // DB row referencing them survives. Route uploads to Cloudinary instead
  // whenever credentials are configured; local dev falls back to disk so no
  // Cloudinary account is needed just to run the app.
  const cloudinaryName = env('CLOUDINARY_NAME');
  const cloudinaryKey = env('CLOUDINARY_KEY');
  const cloudinarySecret = env('CLOUDINARY_SECRET');
  const useCloudinary = Boolean(cloudinaryName && cloudinaryKey && cloudinarySecret);

  return {
    'users-permissions': {
      config: {
        jwtManagement: 'refresh',
        sessions: {
          httpOnly: true,
        },
      },
    },
    upload: {
      config: {
        ...(useCloudinary && {
          provider: 'cloudinary',
          providerOptions: {
            cloud_name: cloudinaryName,
            api_key: cloudinaryKey,
            api_secret: cloudinarySecret,
          },
        }),
        security: {
          allowedTypes: allowedMediaTypes,
          deniedTypes: deniedExecutableTypes,
        },
      },
    },
  };
};

export default config;
