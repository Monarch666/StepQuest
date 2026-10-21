package com.stepquest.domain.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Journey(
    val id: String = "",
    val title: String = "",
    val description: String = "",
    @SerialName("total_km") val totalKm: Double = 0.0,
    @SerialName("banner_url") val bannerUrl: String = "",
    @SerialName("created_at") val createdAt: String = ""
) {
    /** Simple difficulty label based on total distance. */
    val difficulty: String
        get() = when {
            totalKm <= 100 -> "Easy"
            totalKm <= 400 -> "Moderate"
            else -> "Hard"
        }
}
