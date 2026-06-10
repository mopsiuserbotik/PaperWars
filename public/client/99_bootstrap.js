CLIENT_TOKEN = getClientToken();
sfxEnabled = loadSoundEnabled();

ensureDynamicUi();
applyTheme(loadTheme());
applySoundPreference();
connect();
bindUi();
preloadEventSfx();
registerServiceWorker();
setInterval(updateLivePanels, 1000);