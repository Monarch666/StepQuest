package com.stepquest.domain.usecase

import com.stepquest.domain.model.UserJourney
import com.stepquest.domain.repository.JourneyRepository
import javax.inject.Inject

class StartJourneyUseCase @Inject constructor(
    private val journeyRepository: JourneyRepository
) {
    suspend operator fun invoke(userId: String, journeyId: String): Result<UserJourney> {
        // Check if user already has this journey active
        val existing = journeyRepository.getUserJourneys(userId).getOrNull()
        val alreadyActive = existing?.any { it.journeyId == journeyId && !it.isCompleted }
        if (alreadyActive == true) {
            return Result.failure(IllegalStateException("Journey already in progress"))
        }
        return journeyRepository.startJourney(userId, journeyId)
    }
}
