package com.stepquest.domain.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Achievement(
    val id: String = "",
    @SerialName("user_id") val userId: String = "",
    @SerialName("milestone_id") val milestoneId: String = "",
    @SerialName("earned_at") val earnedAt: String = ""
)
