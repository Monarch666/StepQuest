package com.stepquest.domain.usecase

import com.stepquest.domain.model.Milestone
import com.stepquest.domain.repository.AchievementRepository
import javax.inject.Inject

class CheckMilestonesUseCase @Inject constructor(
    private val achievementRepository: AchievementRepository
) {
    suspend operator fun invoke(
        userId: String,
        journeyId: String,
        currentKm: Double
    ): List<Milestone> {
        return achievementRepository.checkAndUnlockMilestones(userId, journeyId, currentKm)
    }
}
