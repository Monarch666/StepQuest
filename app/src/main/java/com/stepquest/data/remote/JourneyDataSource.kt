package com.stepquest.data.remote

import com.stepquest.domain.model.Journey
import com.stepquest.domain.model.Milestone
import com.stepquest.domain.model.UserJourney
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.postgrest
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class JourneyDataSource @Inject constructor(
    private val client: SupabaseClient
) {
    private val journeys get() = client.postgrest["journeys"]
    private val milestones get() = client.postgrest["milestones"]
    private val userJourneys get() = client.postgrest["user_journeys"]

    suspend fun getAllJourneys(): List<Journey> {
        return journeys.select().decodeList<Journey>()
    }

    suspend fun getJourneyById(journeyId: String): Journey {
        return journeys.select {
            filter { eq("id", journeyId) }
        }.decodeSingle<Journey>()
    }

    suspend fun getMilestones(journeyId: String): List<Milestone> {
        return milestones.select {
            filter { eq("journey_id", journeyId) }
        }.decodeList<Milestone>()
    }

    suspend fun getUserJourneys(userId: String): List<UserJourney> {
        return userJourneys.select {
            filter { eq("user_id", userId) }
        }.decodeList<UserJourney>()
    }

    suspend fun getActiveJourney(userId: String): UserJourney? {
        val results = userJourneys.select {
            filter {
                eq("user_id", userId)
                eq("is_completed", false)
            }
        }.decodeList<UserJourney>()
        return results.firstOrNull()
    }

    suspend fun startJourney(userId: String, journeyId: String): UserJourney {
        val entry = buildJsonObject {
            put("user_id", userId)
            put("journey_id", journeyId)
            put("progress_km", 0.0)
            put("is_completed", false)
        }
        return userJourneys.insert(entry) {
            select()
        }.decodeSingle<UserJourney>()
    }

    suspend fun updateProgress(userJourneyId: String, newProgressKm: Double): UserJourney {
        userJourneys.update({
            set("progress_km", newProgressKm)
        }) {
            filter { eq("id", userJourneyId) }
        }
        return userJourneys.select {
            filter { eq("id", userJourneyId) }
        }.decodeSingle<UserJourney>()
    }

    suspend fun completeJourney(userJourneyId: String) {
        userJourneys.update({
            set("is_completed", true)
        }) {
            filter { eq("id", userJourneyId) }
        }
    }
}
