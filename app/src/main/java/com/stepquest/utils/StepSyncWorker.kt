package com.stepquest.utils

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.stepquest.domain.repository.StepRepository
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject

/**
 * Periodic background worker that syncs locally cached step data to Supabase.
 * Scheduled to run every 15 minutes via WorkManager.
 */
@HiltWorker
class StepSyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val stepRepository: StepRepository
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        return try {
            stepRepository.syncPendingSteps()
            Result.success()
        } catch (_: Exception) {
            // Retry on next scheduled run
            Result.retry()
        }
    }
}
