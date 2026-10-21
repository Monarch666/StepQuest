package com.stepquest.di

import com.stepquest.data.repository.AchievementRepositoryImpl
import com.stepquest.data.repository.AuthRepositoryImpl
import com.stepquest.data.repository.JourneyRepositoryImpl
import com.stepquest.data.repository.StepRepositoryImpl
import com.stepquest.data.repository.UserRepositoryImpl
import com.stepquest.domain.repository.AchievementRepository
import com.stepquest.domain.repository.AuthRepository
import com.stepquest.domain.repository.JourneyRepository
import com.stepquest.domain.repository.StepRepository
import com.stepquest.domain.repository.UserRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindAuthRepository(impl: AuthRepositoryImpl): AuthRepository

    @Binds
    @Singleton
    abstract fun bindUserRepository(impl: UserRepositoryImpl): UserRepository

    @Binds
    @Singleton
    abstract fun bindJourneyRepository(impl: JourneyRepositoryImpl): JourneyRepository

    @Binds
    @Singleton
    abstract fun bindStepRepository(impl: StepRepositoryImpl): StepRepository

    @Binds
    @Singleton
    abstract fun bindAchievementRepository(impl: AchievementRepositoryImpl): AchievementRepository
}
