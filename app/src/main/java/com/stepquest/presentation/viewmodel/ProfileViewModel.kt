package com.stepquest.presentation.viewmodel

import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.stepquest.domain.model.User
import com.stepquest.domain.repository.AchievementRepository
import com.stepquest.domain.repository.AuthRepository
import com.stepquest.domain.repository.JourneyRepository
import com.stepquest.domain.repository.UserRepository
import com.stepquest.domain.usecase.UploadAvatarUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ProfileUiState(
    val isLoading: Boolean = true,
    val user: User? = null,
    val journeysCompleted: Int = 0,
    val achievementCount: Int = 0,
    val isUploadingAvatar: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class ProfileViewModel @Inject constructor(
    @dagger.hilt.android.qualifiers.ApplicationContext private val context: android.content.Context,
    private val authRepository: AuthRepository,
    private val userRepository: UserRepository,
    private val journeyRepository: JourneyRepository,
    private val achievementRepository: AchievementRepository,
    private val uploadAvatarUseCase: UploadAvatarUseCase
) : ViewModel() {

    private val _state = MutableStateFlow(ProfileUiState())
    val state: StateFlow<ProfileUiState> = _state.asStateFlow()

    init {
        loadProfile()
    }

    private fun loadProfile() {
        viewModelScope.launch {
            val user = authRepository.currentUser.firstOrNull() ?: return@launch
            _state.value = _state.value.copy(isLoading = true)

            val fullUser = userRepository.getUser(user.id).getOrNull() ?: user
            val journeys = journeyRepository.getUserJourneys(user.id).getOrNull() ?: emptyList()
            val completed = journeys.count { it.isCompleted }
            val achievements = achievementRepository.getAchievements(user.id).getOrNull() ?: emptyList()
            val earnedCount = achievements.count { it.earnedAt.isNotBlank() }

            _state.value = ProfileUiState(
                isLoading = false,
                user = fullUser,
                journeysCompleted = completed,
                achievementCount = earnedCount
            )
        }
    }

    /** Upload avatar from a content URI (image picker result). */
    fun uploadAvatar(uri: Uri) {
        viewModelScope.launch {
            val user = authRepository.currentUser.firstOrNull() ?: return@launch
            _state.value = _state.value.copy(isUploadingAvatar = true)
            val bytes = try {
                context.contentResolver.openInputStream(uri)?.use { it.readBytes() }
            } catch (_: Exception) { null }

            if (bytes == null) {
                _state.value = _state.value.copy(
                    isUploadingAvatar = false,
                    error = "Failed to read image"
                )
                return@launch
            }

            uploadAvatarUseCase(user.id, bytes)
                .onSuccess { loadProfile() }
                .onFailure { e ->
                    _state.value = _state.value.copy(
                        isUploadingAvatar = false,
                        error = e.message
                    )
                }
        }
    }

    fun updateUsername(newUsername: String) {
        viewModelScope.launch {
            val user = authRepository.currentUser.firstOrNull() ?: return@launch
            userRepository.updateUser(user.copy(username = newUsername))
            loadProfile()
        }
    }

    fun signOut() {
        viewModelScope.launch { authRepository.signOut() }
    }
}
