package com.stepquest.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.stepquest.domain.model.Journey
import com.stepquest.domain.model.Milestone
import com.stepquest.domain.model.User
import com.stepquest.domain.model.UserJourney
import com.stepquest.domain.repository.AuthRepository
import com.stepquest.domain.repository.JourneyRepository
import com.stepquest.domain.usecase.GetTodayStepsUseCase
import com.stepquest.domain.usecase.UpdateProgressUseCase
import com.stepquest.utils.Constants
import com.stepquest.utils.NotificationHelper
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val isLoading: Boolean = true,
    val user: User? = null,
    val todaySteps: Int = 0,
    val activeJourney: UserJourney? = null,
    val activeJourneyInfo: Journey? = null,
    val nextMilestone: Milestone? = null,
    val showConfetti: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val journeyRepository: JourneyRepository,
    private val getTodayStepsUseCase: GetTodayStepsUseCase,
    private val updateProgressUseCase: UpdateProgressUseCase,
    private val notificationHelper: NotificationHelper
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    private var lastSyncedSteps = 0

    init {
        observeUser()
        observeSteps()
    }

    private fun observeUser() {
        viewModelScope.launch {
            authRepository.currentUser.collectLatest { user ->
                _uiState.value = _uiState.value.copy(user = user)
                if (user != null) {
                    loadActiveJourney(user.id)
                }
            }
        }
    }

    private fun observeSteps() {
        viewModelScope.launch {
            getTodayStepsUseCase().collectLatest { steps ->
                _uiState.value = _uiState.value.copy(todaySteps = steps)
                syncProgressIfNeeded(steps)
            }
        }
    }

    private fun loadActiveJourney(userId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            journeyRepository.getActiveJourney(userId)
                .onSuccess { userJourney ->
                    if (userJourney != null) {
                        val journey = journeyRepository
                            .getJourneyById(userJourney.journeyId)
                            .getOrNull()
                        val milestones = journeyRepository
                            .getMilestones(userJourney.journeyId)
                            .getOrNull() ?: emptyList()
                        val nextMilestone = milestones
                            .filter { it.kmMark > userJourney.progressKm }
                            .minByOrNull { it.kmMark }

                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            activeJourney = userJourney,
                            activeJourneyInfo = journey,
                            nextMilestone = nextMilestone
                        )
                    } else {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            activeJourney = null,
                            activeJourneyInfo = null
                        )
                    }
                }
                .onFailure {
                    _uiState.value = _uiState.value.copy(isLoading = false)
                }
        }
    }

    /**
     * Sync step progress to the backend every 500 steps to avoid excessive writes.
     */
    private fun syncProgressIfNeeded(currentSteps: Int) {
        val delta = currentSteps - lastSyncedSteps
        if (delta < 500) return

        val user = _uiState.value.user ?: return
        val kmDelta = delta * Constants.KM_PER_STEP

        viewModelScope.launch {
            updateProgressUseCase(user.id, delta, kmDelta)
                .onSuccess { update ->
                    lastSyncedSteps = currentSteps
                    update.newMilestones.forEach { milestone ->
                        notificationHelper.showMilestoneNotification(milestone.title)
                        _uiState.value = _uiState.value.copy(showConfetti = true)
                    }
                    // Refresh journey state
                    loadActiveJourney(user.id)
                }
        }
    }

    fun dismissConfetti() {
        _uiState.value = _uiState.value.copy(showConfetti = false)
    }

    fun refresh() {
        val userId = _uiState.value.user?.id ?: return
        loadActiveJourney(userId)
    }
}
