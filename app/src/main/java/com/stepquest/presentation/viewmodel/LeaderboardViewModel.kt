package com.stepquest.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.stepquest.domain.model.LeaderboardEntry
import com.stepquest.domain.repository.AuthRepository
import com.stepquest.domain.usecase.GetLeaderboardUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LeaderboardUiState(
    val isLoading: Boolean = true,
    val entries: List<LeaderboardEntry> = emptyList(),
    val currentUserId: String = "",
    val currentUserEntry: LeaderboardEntry? = null,
    val currentUserRank: Int = 0,
    val error: String? = null
)

@HiltViewModel
class LeaderboardViewModel @Inject constructor(
    private val getLeaderboardUseCase: GetLeaderboardUseCase,
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _state = MutableStateFlow(LeaderboardUiState())
    val state: StateFlow<LeaderboardUiState> = _state.asStateFlow()

    init { loadLeaderboard() }

    private fun loadLeaderboard() {
        viewModelScope.launch {
            val user = authRepository.currentUser.firstOrNull()
            val userId = user?.id ?: ""
            _state.value = _state.value.copy(currentUserId = userId)

            try {
                getLeaderboardUseCase().collectLatest { entries ->
                    val rank = entries.indexOfFirst { it.userId == userId }
                    _state.value = _state.value.copy(
                        isLoading = false,
                        entries = entries,
                        currentUserEntry = if (rank >= 0) entries[rank] else null,
                        currentUserRank = if (rank >= 0) rank + 1 else 0
                    )
                }
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }
}
