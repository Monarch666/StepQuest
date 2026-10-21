package com.stepquest.domain.repository

import com.stepquest.domain.model.Journey
import com.stepquest.domain.model.Milestone
import com.stepquest.domain.model.UserJourney

interface JourneyRepository {

    suspend fun getJourneys(): Result<List<Journey>>

    suspend fun getJourneyById(journeyId: String): Result<Journey>

    suspend fun getMilestones(journeyId: String): Result<List<Milestone>>

    suspend fun startJourney(userId: String, journeyId: String): Result<UserJourney>

    suspend fun getUserJourneys(userId: String): Result<List<UserJourney>>

    suspend fun getActiveJourney(userId: String): Result<UserJourney?>

    suspend fun updateProgress(userJourneyId: String, additionalKm: Double): Result<UserJourney>
}
