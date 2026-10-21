package com.stepquest.domain.usecase

import com.stepquest.domain.model.Milestone
import com.stepquest.domain.model.UserJourney
import com.stepquest.domain.repository.AchievementRepository
import com.stepquest.domain.repository.JourneyRepository
import com.stepquest.domain.repository.StepRepository
import com.stepquest.domain.repository.UserRepository
import com.stepquest.domain.model.User
import javax.inject.Inject

/**
 * Central use case that takes new step data and fans out updates:
 * 1. Logs steps for today
 * 2. Advances the active journey's progress
 * 3. Updates the user's lifetime totals
 * 4. Returns any newly unlocked milestones
 */
class UpdateProgressUseCase @Inject constructor(
    private val stepRepository: StepRepository,
    private val journeyRepository: JourneyRepository,
    private val userRepository: UserRepository,
    private val achievementRepository: AchievementRepository
) {
    data class ProgressUpdate(
        val updatedJourney: UserJourney?,
        val newMilestones: List<Milestone>
    )

    suspend operator fun invoke(
        userId: String,
        newSteps: Int,
        newKm: Double
    ): Result<ProgressUpdate> = runCatching {
        // 1. Log today's steps
        stepRepository.logSteps(userId, newSteps, newKm)

        // 2. Update lifetime totals on user profile
        val user = userRepository.getUser(userId).getOrThrow()
        userRepository.updateUser(
            user.copy(
                totalSteps = user.totalSteps + newSteps,
                totalKm = user.totalKm + newKm
            )
        )

        // 3. Advance active journey
        val activeJourney = journeyRepository.getActiveJourney(userId).getOrNull()
        var updatedJourney: UserJourney? = null
        var newMilestones = emptyList<Milestone>()

        if (activeJourney != null) {
            updatedJourney = journeyRepository
                .updateProgress(activeJourney.id, newKm)
                .getOrThrow()

            // 4. Check for milestone unlocks
            newMilestones = achievementRepository.checkAndUnlockMilestones(
                userId = userId,
                journeyId = activeJourney.journeyId,
                currentKm = updatedJourney.progressKm
            )
        }

        ProgressUpdate(updatedJourney, newMilestones)
    }
}
