package com.stepquest.domain.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Milestone(
    val id: String = "",
    @SerialName("journey_id") val journeyId: String = "",
    val title: String = "",
    val description: String = "",
    @SerialName("km_mark") val kmMark: Double = 0.0,
    @SerialName("badge_icon") val badgeIcon: String = ""
)
