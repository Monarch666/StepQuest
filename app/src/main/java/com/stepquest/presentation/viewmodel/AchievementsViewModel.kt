package com.stepquest.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.stepquest.domain.model.Achievement
import com.stepquest.domain.model.Milestone
import com.stepquest.domain.repository.AchievementRepository
import com.stepquest.domain.repository.AuthRepository
import com.stepquest.domain.repository.JourneyRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AchievementsUiState(
    val isLoading: Boolean = true,
    val achievements: List<Achievement> = emptyList(),
    val milestones: List<Milestone> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class AchievementsViewModel @Inject constructor(
    private val achievementRepository: AchievementRepository,
    private val journeyRepository: JourneyRepository,
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _state = MutableStateFlow(AchievementsUiState())
    val state: StateFlow<AchievementsUiState> = _state.asStateFlow()

    init { loadAchievements() }

    private fun loadAchievements() {
        viewModelScope.launch {
            val user = authRepository.currentUser.firstOrNull() ?: return@launch
            _state.value = _state.value.copy(isLoading = true)

            try {
                val achievements = achievementRepository
                    .getAchievements(user.id).getOrDefault(emptyList())

                val journeys = journeyRepository.getJourneys().getOrDefault(emptyList())

                val allMilestones = mutableListOf<Milestone>()
                for (journey in journeys) {
                    val ms = achievementRepository.getMilestones(journey.id)
                        .getOrDefault(emptyList())
                    allMilestones += ms
                }

                _state.value = AchievementsUiState(
                    isLoading = false,
                    achievements = achievements,
                    milestones = allMilestones
                )
            } catch (e: Exception) {
                _state.value = AchievementsUiState(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }
}
