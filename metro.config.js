const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force @firebase/auth to always resolve to the React Native bundle.
// firebase/auth (the wrapper) has no "react-native" export condition, so without
// this override Firebase's own internal imports of @firebase/auth resolve to the
// browser ESM bundle while our code gets the RN bundle — two copies of the same
// module that don't share singletons. This resolver intercepts ALL imports of
// @firebase/auth and routes them to dist/rn/index.js, ensuring a single copy of
// the RN bundle is used throughout the app.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@firebase/auth') {
    return {
      filePath: require.resolve('@firebase/auth/dist/rn/index.js'),
      type: 'sourceFile',
    };
  }
  return originalResolveRequest
    ? originalResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
