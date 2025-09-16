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

-keep class androidx.camera.** { *; }
-keep class androidx.lifecycle.** { *; }
-keep class com.facebook.react.** { *; }


# Worklet functions
-keepclassmembers class * {
    *** *Worklet*(...);
}

# Keep TF.js classes
-keep class org.tensorflow.** { *; }
-keep class org.tensorflow.lite.** { *; }
-keep class org.tensorflow.lite.support.** { *; }
-keep class org.tensorflow.tensorbuffer.** { *; }
-keep class com.github.rtmigo.** { *; } 

-keep class com.google.** { *; }

# Expo Modules
-keep class expo.modules.** { *; }

# Prevent stripping of native methods
-keepclasseswithmembers class * {
    native <methods>;
}

