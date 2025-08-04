// **************************************
// * DON'T MODIFY THIS FILE!!!
// * USE "config.json" INSTEAD
// **************************************

let appConfig = {
  isDebug: false,
  debugOnDesktop: false
};


export async function loadConfig() {
  try {
    const response = await fetch('/appConfig.json');
    const externalConfig = await response.json();
    appConfig = { ...appConfig, ...externalConfig };
    console.log("config:", appConfig)
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
};