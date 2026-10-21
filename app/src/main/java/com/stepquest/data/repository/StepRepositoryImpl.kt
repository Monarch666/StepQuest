package com.stepquest.data.repository

import com.stepquest.data.local.StepCacheDao
import com.stepquest.data.local.StepCacheEntity
import com.stepquest.data.remote.AuthDataSource
import com.stepquest.data.remote.StepDataSource
import com.stepquest.domain.model.DailyLog
import com.stepquest.domain.repository.StepRepository
import com.stepquest.utils.StepSensorManager
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class StepRepositoryImpl @Inject constructor(
    private val stepDataSource: StepDataSource,
    private val stepCacheDao: StepCacheDao,
    private val stepSensorManager: StepSensorManager,
    private val authDataSource: AuthDataSource
) : StepRepository {

    override val todaySteps: Flow<Int> = stepSensorManager.stepCount

    override suspend fun getTodayLog(userId: String): Result<DailyLog?> = runCatching {
        stepDataSource.getTodayLog(userId)
    }

    override suspend fun logSteps(userId: String, steps: Int, km: Double): Result<Unit> =
        runCatching {
            val today = LocalDate.now().toString()

            // Always cache locally first for reliability
            stepCacheDao.insert(
                StepCacheEntity(date = today, steps = steps, km = km)
            )

            // Attempt immediate remote sync
            try {
                stepDataSource.upsertDailyLog(userId, today, steps, km)
                // Mark as synced if remote write succeeded
                val unsynced = stepCacheDao.getUnsyncedEntries()
                unsynced.lastOrNull()?.let { stepCacheDao.markSynced(it.id) }
            } catch (_: Exception) {
                // Will be retried by WorkManager
            }
        }

    override suspend fun syncPendingSteps(): Result<Unit> = runCatching {
        val userId = authDataSource.getCurrentUserId() ?: return@runCatching
        val pending = stepCacheDao.getUnsyncedEntries()

        for (entry in pending) {
            try {
                stepDataSource.upsertDailyLog(userId, entry.date, entry.steps, entry.km)
                stepCacheDao.markSynced(entry.id)
            } catch (_: Exception) {
                // Skip this entry — will retry next sync cycle
                break
            }
        }

        // Clean up old synced entries to prevent DB bloat
        stepCacheDao.clearSynced()
    }
}
