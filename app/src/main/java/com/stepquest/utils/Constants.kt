package com.stepquest.utils

/** App-wide constants. */
object Constants {

    // Average stride length in km. Source: research average of ~0.762 m per step.
    const val KM_PER_STEP = 0.000762

    // Daily step goal used for the progress ring on the home screen.
    const val DAILY_STEP_GOAL = 10_000

    // WorkManager unique work name for periodic step sync.
    const val STEP_SYNC_WORK = "step_sync_work"

    // Notification channel
    const val NOTIFICATION_CHANNEL_ID = "stepquest_milestones"
    const val NOTIFICATION_CHANNEL_NAME = "Milestone Alerts"

    // Supabase Storage bucket names
    const val AVATAR_BUCKET = "avatars"
    const val BANNER_BUCKET = "banners"
}
