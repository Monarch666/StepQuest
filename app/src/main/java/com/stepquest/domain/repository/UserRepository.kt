package com.stepquest.domain.repository

import com.stepquest.domain.model.LeaderboardEntry
import com.stepquest.domain.model.User
import kotlinx.coroutines.flow.Flow

interface UserRepository {

    suspend fun getUser(userId: String): Result<User>

    suspend fun updateUser(user: User): Result<User>

    suspend fun uploadAvatar(userId: String, imageBytes: ByteArray): Result<String>

    /** Weekly leaderboard — top users by km this week. */
    fun getLeaderboard(): Flow<List<LeaderboardEntry>>
}
