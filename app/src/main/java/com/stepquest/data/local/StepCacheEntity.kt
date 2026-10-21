package com.stepquest.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Local cache for step data that hasn't been synced to Supabase yet.
 * WorkManager reads unsynced rows and pushes them to the remote database.
 */
@Entity(tableName = "step_cache")
data class StepCacheEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,
    val steps: Int,
    val km: Double,
    val isSynced: Boolean = false
)
