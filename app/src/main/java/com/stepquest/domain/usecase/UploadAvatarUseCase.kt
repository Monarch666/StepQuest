package com.stepquest.domain.usecase

import com.stepquest.domain.repository.UserRepository
import javax.inject.Inject

class UploadAvatarUseCase @Inject constructor(
    private val userRepository: UserRepository
) {
    /**
     * Uploads the avatar image bytes and returns the public URL.
     */
    suspend operator fun invoke(userId: String, imageBytes: ByteArray): Result<String> {
        return userRepository.uploadAvatar(userId, imageBytes)
    }
}
