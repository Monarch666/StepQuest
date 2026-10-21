package com.stepquest.utils

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.stepquest.MainActivity
import com.stepquest.R
import com.stepquest.domain.usecase.UpdateProgressUseCase
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.*
import javax.inject.Inject

/**
 * Foreground service that keeps the step counter sensor alive even when the
 * app is in the background. Updates progress every 30 seconds.
 */
@AndroidEntryPoint
class StepCounterService : Service() {

    @Inject lateinit var stepSensorManager: StepSensorManager
    @Inject lateinit var updateProgressUseCase: UpdateProgressUseCase

    private val serviceScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private var lastSyncedSteps = 0

    companion object {
        const val CHANNEL_ID = "step_counter_channel"
        const val NOTIFICATION_ID = 1001

        fun startService(context: Context) {
            val intent = Intent(context, StepCounterService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        fun stopService(context: Context) {
            context.stopService(Intent(context, StepCounterService::class.java))
        }
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification(0))
        stepSensorManager.start()
        startSyncLoop()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY // Restart if killed by system
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        stepSensorManager.stop()
        serviceScope.cancel()
    }

    private fun startSyncLoop() {
        serviceScope.launch {
            stepSensorManager.todaySteps.collect { steps ->
                updateNotification(steps)
                // Sync every 500 steps to reduce DB writes
                if (steps - lastSyncedSteps >= 500) {
                    val delta = steps - lastSyncedSteps
                    updateProgressUseCase(delta)
                    lastSyncedSteps = steps
                }
            }
        }
    }

    private fun updateNotification(steps: Int) {
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(NOTIFICATION_ID, buildNotification(steps))
    }

    private fun buildNotification(steps: Int): Notification {
        val pendingIntent = PendingIntent.getActivity(
            this, 0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE
        )
        val km = "%.2f".format(steps * Constants.KM_PER_STEP)
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle("StepQuest Active")
            .setContentText("$steps steps today · ${km}km")
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setSilent(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Step Tracker",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows your live step count"
                setShowBadge(false)
            }
            (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager)
                .createNotificationChannel(channel)
        }
    }
}
