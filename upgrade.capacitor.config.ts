
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: "ionic.mynest.vendor",
    appName: "mynest-vendor",
    bundledWebRuntime: false,
    webDir: "www",
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: false
        },
        PushNotifications: {
            presentationOptions: ["badge", "sound", "alert"]
        }
    },
    cordova: {}
}

export default config;
