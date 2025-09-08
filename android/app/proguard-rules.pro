# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Add any project specific keep options here:

# Vision Camera
-keep class com.mrousavy.camera.** { *; }
-keep class com.mrousavy.camera.core.** { *; }
-keep class com.mrousavy.camera.frameprocessor.** { *; }

# Face Detector
-keep class com.visioncameraFacedetector.** { *; }
-keep class com.google.mlkit.** { *; }
-keep class com.google.android.gms.** { *; }

# Worklets - SANGAT PENTING
-keep class com.margelo.worklets.** { *; }

# JSI
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# JavaScript Interface
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.proguard.annotations.KeepGettersAndSetters *;
}

# Worklet functions
-keepclassmembers class * {
    *** *Worklet*(...);
}

# React Native Bridge
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }

# Expo Modules
-keep class expo.modules.** { *; }

# Prevent stripping of native methods
-keepclasseswithmembers class * {
    native <methods>;
}

