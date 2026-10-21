package com.stepquest.domain.model

/**
 * Projection used for the weekly leaderboard display.
 * Not stored directly in a table — assembled from a query joining users + daily_logs.
 */
data class LeaderboardEntry(
    val userId: String,
    val username: String,
    val avatarUrl: String?,
    val totalKm: Double,
    val rank: Int
)
