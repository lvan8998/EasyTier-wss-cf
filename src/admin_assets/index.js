import { sharedScript } from './shared.js';
import { authScript } from './auth.js';
import { dashboardScript } from './dashboard.js';
import { tokensSettingsScript } from './tokens-settings.js';
import { bootScript } from './boot.js';

const assets = {
  'shared.js': sharedScript,
  'auth.js': authScript,
  'dashboard.js': dashboardScript,
  'tokens-settings.js': tokensSettingsScript,
  'boot.js': bootScript,
};

export function getAdminAsset(name) {
  return assets[name] || null;
}
