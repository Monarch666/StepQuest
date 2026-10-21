package com.stepquest.utils

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.callbackFlow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Manages the hardware step counter sensor.
 *
 * TYPE_STEP_COUNTER reports cumulative steps since last device reboot,
 * so we track the initial reading and compute deltas from there.
 */
@Singleton
class StepSensorManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val stepSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)

    private var initialSteps: Int? = null

    private val _stepCount = MutableStateFlow(0)
    val stepCount: Flow<Int> = _stepCount
    val todaySteps: Flow<Int> get() = stepCount

    val isSensorAvailable: Boolean
        get() = stepSensor != null

    fun startListening() {
        if (stepSensor == null) return
        sensorManager.registerListener(
            stepListener,
            stepSensor,
            SensorManager.SENSOR_DELAY_UI
        )
    }

    fun stopListening() {
        sensorManager.unregisterListener(stepListener)
    }

    // Convenience aliases
    fun start() = startListening()
    fun stop() = stopListening()

    private val stepListener = object : SensorEventListener {
        override fun onSensorChanged(event: SensorEvent) {
            val totalSinceBoot = event.values[0].toInt()

            if (initialSteps == null) {
                // First reading after registration — treat as baseline
                initialSteps = totalSinceBoot
            }

            val sessionSteps = totalSinceBoot - (initialSteps ?: totalSinceBoot)
            _stepCount.value = sessionSteps
        }

        override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
            // Not used for step counter
        }
    }

    /** Reset the baseline, e.g. at midnight or on new day. */
    fun resetBaseline() {
        initialSteps = null
        _stepCount.value = 0
    }
}
