package com.stepquest.data.repository

import com.stepquest.data.remote.JourneyDataSource
import com.stepquest.domain.model.Journey
import com.stepquest.domain.model.Milestone
import com.stepquest.domain.model.UserJourney
import com.stepquest.domain.repository.JourneyRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class JourneyRepositoryImpl @Inject constructor(
    private val journeyDataSource: JourneyDataSource
) : JourneyRepository {

    override suspend fun getJourneys(): Result<List<Journey>> = runCatching {
        journeyDataSource.getAllJourneys()
    }

    override suspend fun getJourneyById(journeyId: String): Result<Journey> = runCatching {
        journeyDataSource.getJourneyById(journeyId)
    }

    override suspend fun getMilestones(journeyId: String): Result<List<Milestone>> = runCatching {
        journeyDataSource.getMilestones(journeyId)
    }

    override suspend fun startJourney(userId: String, journeyId: String): Result<UserJourney> =
        runCatching {
            journeyDataSource.startJourney(userId, journeyId)
        }

    override suspend fun getUserJourneys(userId: String): Result<List<UserJourney>> = runCatching {
        journeyDataSource.getUserJourneys(userId)
    }

    override suspend fun getActiveJourney(userId: String): Result<UserJourney?> = runCatching {
        journeyDataSource.getActiveJourney(userId)
    }

    override suspend fun updateProgress(
        userJourneyId: String,
        additionalKm: Double
    ): Result<UserJourney> = runCatching {
        // Fetch current progress, add the delta, and write back
        val current = journeyDataSource.getUserJourneys("").first { it.id == userJourneyId }
        val newKm = current.progressKm + additionalKm
        journeyDataSource.updateProgress(userJourneyId, newKm)
    }
}
