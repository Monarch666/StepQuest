package com.stepquest.domain.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class UserJourney(
    val id: String = "",
    @SerialName("user_id") val userId: String = "",
    @SerialName("journey_id") val journeyId: String = "",
    @SerialName("progress_km") val progressKm: Double = 0.0,
    @SerialName("is_completed") val isCompleted: Boolean = false,
    @SerialName("started_at") val startedAt: String = "",
    @SerialName("completed_at") val completedAt: String? = null
) {
    /**
     * Returns a value between 0.0 and 1.0 representing completion fraction.
     * Requires the parent journey's total km to compute accurately.
     */
    fun progressFraction(totalKm: Double): Float {
        if (totalKm <= 0) return 0f
        return (progressKm / totalKm).coerceIn(0.0, 1.0).toFloat()
    }
}
