rm ./platforms/android/app/build/outputs/apk/release/*.apk
ionic cordova build android --prod --release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/XwingTabled.jks ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk xwing-tabled
~/Library/Android/sdk/build-tools/28.0.1/zipalign -v 4 ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk XwingTabled.apk
~/Library/Android/sdk/build-tools/28.0.1/apksigner verify XwingTabled.apk
