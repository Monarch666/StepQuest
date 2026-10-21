package com.stepquest.domain.model

import kotlinx.serialization.Serializable

@Serializable
data class DailyLog(
    val id: String = "",
    val user_id: String = "",
    val date: String = "",
    val steps: Int = 0,
    val km: Double = 0.0
)
