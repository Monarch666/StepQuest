package com.stepquest.data.local

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(
    entities = [StepCacheEntity::class],
    version = 1,
    exportSchema = false
)
abstract class StepQuestDatabase : RoomDatabase() {
    abstract fun stepCacheDao(): StepCacheDao
}
