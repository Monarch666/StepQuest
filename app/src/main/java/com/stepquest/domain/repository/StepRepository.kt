package com.stepquest.domain.repository

import com.stepquest.domain.model.DailyLog
import kotlinx.coroutines.flow.Flow

interface StepRepository {

    /** Live step count for today from the sensor. */
    val todaySteps: Flow<Int>

    suspend fun getTodayLog(userId: String): Result<DailyLog?>

    /** Persist steps locally and sync to Supabase. */
    suspend fun logSteps(userId: String, steps: Int, km: Double): Result<Unit>

    /** Push any unsynced local step data to the remote database. */
    suspend fun syncPendingSteps(): Result<Unit>
}
