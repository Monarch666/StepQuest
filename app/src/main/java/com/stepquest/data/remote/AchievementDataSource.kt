package com.stepquest.data.remote

import com.stepquest.domain.model.Achievement
import com.stepquest.domain.model.Milestone
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.postgrest
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AchievementDataSource @Inject constructor(
    private val client: SupabaseClient
) {
    private val achievementsTable get() = client.postgrest["achievements"]
    private val milestonesTable get() = client.postgrest["milestones"]

    suspend fun getAchievements(userId: String): List<Achievement> {
        return achievementsTable.select {
            filter { eq("user_id", userId) }
        }.decodeList<Achievement>()
    }

    suspend fun hasAchievement(userId: String, milestoneId: String): Boolean {
        val results = achievementsTable.select {
            filter {
                eq("user_id", userId)
                eq("milestone_id", milestoneId)
            }
        }.decodeList<Achievement>()
        return results.isNotEmpty()
    }

    suspend fun insertAchievement(userId: String, milestoneId: String): Achievement {
        val entry = buildJsonObject {
            put("user_id", userId)
            put("milestone_id", milestoneId)
        }
        return achievementsTable.insert(entry) {
            select()
        }.decodeSingle<Achievement>()
    }

    suspend fun getMilestonesForJourney(journeyId: String): List<Milestone> {
        return milestonesTable.select {
            filter { eq("journey_id", journeyId) }
        }.decodeList<Milestone>()
    }
}
