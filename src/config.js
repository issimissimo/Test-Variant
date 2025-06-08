let appConfig = {
  isDebug: false,
  debugOnDesktop: false,
  usePlayGround: false
};


export async function loadConfig() {
  try {
    const response = await fetch('/config.json');
    const externalConfig = await response.json();
    appConfig = {...appConfig, ...externalConfig};
    console.log('Config loaded:', appConfig);
  } catch (error) {
    console.error('Failed to load config, using defaults', error);
  }
}

export const config = {
  get isDebug() {
    return appConfig.isDebug;
  },
  get debugOnDesktop() {
    return appConfig.debugOnDesktop;
  },
  get usePlayGround() {
    return appConfig.usePlayGround;
  }
};