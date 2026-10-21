package com.stepquest.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.stepquest.domain.model.Journey
import com.stepquest.domain.model.Milestone
import com.stepquest.domain.model.UserJourney
import com.stepquest.domain.repository.AuthRepository
import com.stepquest.domain.repository.JourneyRepository
import com.stepquest.domain.usecase.StartJourneyUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.launch
import javax.inject.Inject

data class JourneyUiState(
    val isLoading: Boolean = true,
    val journeys: List<Journey> = emptyList(),
    val selectedJourney: Journey? = null,
    val milestones: List<Milestone> = emptyList(),
    val userJourney: UserJourney? = null,
    val error: String? = null
) {
    val activeJourney: UserJourney? get() = userJourney
}

@HiltViewModel
class JourneyViewModel @Inject constructor(
    private val journeyRepository: JourneyRepository,
    private val startJourneyUseCase: StartJourneyUseCase,
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(JourneyUiState())
    val uiState: StateFlow<JourneyUiState> = _uiState.asStateFlow()
    val state: StateFlow<JourneyUiState> get() = uiState

    init {
        loadJourneys()
    }

    fun loadJourneys() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            journeyRepository.getJourneys()
                .onSuccess { list ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        journeys = list
                    )
                }
                .onFailure { e ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = e.message
                    )
                }
        }
    }

    fun loadJourneyDetail(journeyId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            val journey = journeyRepository.getJourneyById(journeyId).getOrNull()
            val milestones = journeyRepository.getMilestones(journeyId).getOrNull() ?: emptyList()

            val userId = authRepository.currentUser.firstOrNull()?.id
            var userJourney: UserJourney? = null
            if (userId != null) {
                val userJourneys = journeyRepository.getUserJourneys(userId).getOrNull()
                userJourney = userJourneys?.find { it.journeyId == journeyId }
            }

            _uiState.value = _uiState.value.copy(
                isLoading = false,
                selectedJourney = journey,
                milestones = milestones.sortedBy { it.kmMark },
                userJourney = userJourney
            )
        }
    }

    fun startJourney(journeyId: String) {
        viewModelScope.launch {
            val userId = authRepository.currentUser.firstOrNull()?.id ?: return@launch
            _uiState.value = _uiState.value.copy(isLoading = true)
            startJourneyUseCase(userId, journeyId)
                .onSuccess { userJourney ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        userJourney = userJourney
                    )
                }
                .onFailure { e ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = e.message
                    )
                }
        }
    }
}
