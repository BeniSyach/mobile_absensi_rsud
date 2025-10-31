package com.deliserdang.sehat

import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DeveloperModeModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "DeveloperMode"

    @ReactMethod
    fun isDeveloperModeEnabled(promise: Promise) {
        try {
            val devOptions =
                Settings.Global.getInt(
                    reactContext.contentResolver,
                    Settings.Global.DEVELOPMENT_SETTINGS_ENABLED,
                    0
                )
            promise.resolve(devOptions == 1)
        } catch (e: Exception) {
            promise.reject("ERROR_CHECKING_DEV_MODE", e.message, e)
        }
    }
}
