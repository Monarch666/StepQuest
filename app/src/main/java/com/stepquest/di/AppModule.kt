package com.stepquest.di

import android.content.Context
import androidx.room.Room
import com.stepquest.data.local.StepCacheDao
import com.stepquest.data.local.StepQuestDatabase
import com.stepquest.data.remote.SupabaseClientProvider
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import io.github.jan.supabase.SupabaseClient
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideSupabaseClient(): SupabaseClient = SupabaseClientProvider.client

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): StepQuestDatabase {
        return Room.databaseBuilder(
            context,
            StepQuestDatabase::class.java,
            "stepquest.db"
        ).build()
    }

    @Provides
    fun provideStepCacheDao(database: StepQuestDatabase): StepCacheDao {
        return database.stepCacheDao()
    }
}
