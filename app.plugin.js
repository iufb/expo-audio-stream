const { AndroidConfig, withAndroidManifest, withInfoPlist } = require('@expo/config-plugins');

const MICROPHONE_USAGE = 'Allow $(PRODUCT_NAME) to access your microphone';

function withRecordingPermission(config) {
  config = withInfoPlist(config, (config) => {
    config.modResults.NSMicrophoneUsageDescription =
      config.modResults.NSMicrophoneUsageDescription || MICROPHONE_USAGE;

    const existingBackgroundModes = config.modResults.UIBackgroundModes || [];
    if (!existingBackgroundModes.includes('audio')) {
      existingBackgroundModes.push('audio');
    }
    config.modResults.UIBackgroundModes = existingBackgroundModes;

    return config;
  });

  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'android.permission.RECORD_AUDIO',
      MICROPHONE_USAGE
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'android.permission.FOREGROUND_SERVICE',
      'This apps needs access to the foreground service to record audio in the background'
    );

    return config;
  });

  return config;
}

module.exports = withRecordingPermission;
