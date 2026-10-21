package com.stepquest.data.repository

import com.stepquest.data.remote.AchievementDataSource
import com.stepquest.domain.model.Achievement
import com.stepquest.domain.model.Milestone
import com.stepquest.domain.repository.AchievementRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AchievementRepositoryImpl @Inject constructor(
    private val achievementDataSource: AchievementDataSource
) : AchievementRepository {

    override suspend fun getAchievements(userId: String): Result<List<Achievement>> = runCatching {
        achievementDataSource.getAchievements(userId)
    }

    override suspend fun getMilestones(journeyId: String): Result<List<Milestone>> = runCatching {
        achievementDataSource.getMilestonesForJourney(journeyId)
    }

    override suspend fun getMilestonesWithStatus(
        userId: String,
        journeyId: String
    ): Result<List<Pair<Milestone, Boolean>>> = runCatching {
        val milestones = achievementDataSource.getMilestonesForJourney(journeyId)
        val earned = achievementDataSource.getAchievements(userId)
        val earnedMilestoneIds = earned.map { it.milestoneId }.toSet()

        milestones.map { milestone ->
            milestone to (milestone.id in earnedMilestoneIds)
        }
    }

    override suspend fun unlockAchievement(
        userId: String,
        milestoneId: String
    ): Result<Achievement> = runCatching {
        achievementDataSource.insertAchievement(userId, milestoneId)
    }

    override suspend fun checkAndUnlockMilestones(
        userId: String,
        journeyId: String,
        currentKm: Double
    ): List<Milestone> {
        val milestones = achievementDataSource.getMilestonesForJourney(journeyId)
        val newlyUnlocked = mutableListOf<Milestone>()

        for (milestone in milestones) {
            if (currentKm >= milestone.kmMark) {
                val alreadyEarned = achievementDataSource.hasAchievement(userId, milestone.id)
                if (!alreadyEarned) {
                    achievementDataSource.insertAchievement(userId, milestone.id)
                    newlyUnlocked.add(milestone)
                }
            }
        }

        return newlyUnlocked
    }
}
