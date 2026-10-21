package com.stepquest.domain.usecase

import com.stepquest.domain.repository.StepRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class GetTodayStepsUseCase @Inject constructor(
    private val stepRepository: StepRepository
) {
    operator fun invoke(): Flow<Int> = stepRepository.todaySteps
}
