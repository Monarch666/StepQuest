package com.stepquest.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query

@Dao
interface StepCacheDao {

    @Insert
    suspend fun insert(entry: StepCacheEntity)

    @Query("SELECT * FROM step_cache WHERE isSynced = 0 ORDER BY date ASC")
    suspend fun getUnsyncedEntries(): List<StepCacheEntity>

    @Query("UPDATE step_cache SET isSynced = 1 WHERE id = :id")
    suspend fun markSynced(id: Long)

    @Query("SELECT COALESCE(SUM(steps), 0) FROM step_cache WHERE date = :date")
    suspend fun getTodayStepCount(date: String): Int

    @Query("DELETE FROM step_cache WHERE isSynced = 1")
    suspend fun clearSynced()
}
