package com.stepquest.domain.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: String = "",
    val username: String = "",
    @SerialName("avatar_url") val avatarUrl: String? = null,
    @SerialName("total_steps") val totalSteps: Long = 0L,
    @SerialName("total_km") val totalKm: Double = 0.0,
    @SerialName("is_premium") val isPremium: Boolean = false,
    @SerialName("created_at") val createdAt: String = ""
)
