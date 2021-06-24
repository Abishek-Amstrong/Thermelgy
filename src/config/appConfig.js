const env = 'dev';

const CONFIG = {
  dev: {
    BASE_URL: 'https://thermelgy-service-4oevwyecva-uc.a.run.app',
  },
};

export const APP_CONFIG = CONFIG[env] ? CONFIG[env] : CONFIG.dev;
