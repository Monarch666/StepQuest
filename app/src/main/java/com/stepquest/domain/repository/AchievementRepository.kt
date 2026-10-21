package com.stepquest.domain.repository

import com.stepquest.domain.model.Achievement
import com.stepquest.domain.model.Milestone

interface AchievementRepository {

    suspend fun getAchievements(userId: String): Result<List<Achievement>>

    /** Returns all milestones for a journey. */
    suspend fun getMilestones(journeyId: String): Result<List<Milestone>>

    /** Returns all milestones for a journey paired with whether the user has earned each. */
    suspend fun getMilestonesWithStatus(
        userId: String,
        journeyId: String
    ): Result<List<Pair<Milestone, Boolean>>>

    suspend fun unlockAchievement(userId: String, milestoneId: String): Result<Achievement>

    /**
     * Checks the user's current journey progress against milestone km_marks.
     * Returns a list of newly unlocked milestones (if any).
     */
    suspend fun checkAndUnlockMilestones(
        userId: String,
        journeyId: String,
        currentKm: Double
    ): List<Milestone>
}
