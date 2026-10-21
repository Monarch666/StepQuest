package com.stepquest.data.repository

import com.stepquest.data.remote.LeaderboardDataSource
import com.stepquest.data.remote.UserDataSource
import com.stepquest.domain.model.LeaderboardEntry
import com.stepquest.domain.model.User
import com.stepquest.domain.repository.UserRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class UserRepositoryImpl @Inject constructor(
    private val userDataSource: UserDataSource,
    private val leaderboardDataSource: LeaderboardDataSource
) : UserRepository {

    override suspend fun getUser(userId: String): Result<User> = runCatching {
        userDataSource.getUser(userId)
    }

    override suspend fun updateUser(user: User): Result<User> = runCatching {
        userDataSource.updateUser(user)
    }

    override suspend fun uploadAvatar(userId: String, imageBytes: ByteArray): Result<String> =
        runCatching {
            val url = userDataSource.uploadAvatar(userId, imageBytes)
            // Update the user's avatar_url field
            val user = userDataSource.getUser(userId)
            userDataSource.updateUser(user.copy(avatarUrl = url))
            url
        }

    override fun getLeaderboard(): Flow<List<LeaderboardEntry>> =
        leaderboardDataSource.getLeaderboard()
}
