package com.stepquest.domain.usecase

import com.stepquest.domain.model.LeaderboardEntry
import com.stepquest.domain.repository.UserRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class GetLeaderboardUseCase @Inject constructor(
    private val userRepository: UserRepository
) {
    operator fun invoke(): Flow<List<LeaderboardEntry>> = userRepository.getLeaderboard()
}
