package com.stepquest.presentation.screens.home

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.DirectionsWalk
import androidx.compose.material.icons.outlined.Straighten
import androidx.compose.material.icons.outlined.Tour
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.stepquest.presentation.components.ConfettiOverlay
import com.stepquest.presentation.components.JourneyCard
import com.stepquest.presentation.components.LoadingIndicator
import com.stepquest.presentation.components.StepProgressRing
import com.stepquest.presentation.viewmodel.HomeViewModel
import com.stepquest.utils.Constants
import com.stepquest.utils.formatted
import com.stepquest.utils.getGreeting
import com.stepquest.utils.toKmString

@Composable
fun HomeScreen(
    onJourneyClick: (String) -> Unit,
    onViewAllJourneys: () -> Unit,
    viewModel: HomeViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Box(modifier = Modifier.fillMaxSize()) {
        if (uiState.isLoading && uiState.user == null) {
            LoadingIndicator()
            return@Box
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 16.dp)
        ) {
            // Greeting
            Text(
                text = "${getGreeting()},",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                text = uiState.user?.username ?: "Walker",
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Step progress ring
            Box(
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                StepProgressRing(
                    steps = uiState.todaySteps,
                    goal = Constants.DAILY_STEP_GOAL
                )
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Quick stats row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                QuickStat(
                    icon = Icons.Outlined.DirectionsWalk,
                    value = uiState.user?.totalSteps?.formatted() ?: "0",
                    label = "Total Steps"
                )
                QuickStat(
                    icon = Icons.Outlined.Straighten,
                    value = uiState.user?.totalKm?.toKmString() ?: "0 km",
                    label = "Distance"
                )
                QuickStat(
                    icon = Icons.Outlined.Tour,
                    value = "0", // Populated from journeys
                    label = "Journeys"
                )
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Active journey section
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Active Journey",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.SemiBold
                )
                TextButton(onClick = onViewAllJourneys) {
                    Text("Browse All")
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            if (uiState.activeJourney != null && uiState.activeJourneyInfo != null) {
                val journey = uiState.activeJourneyInfo!!
                val userJourney = uiState.activeJourney!!
                JourneyCard(
                    title = journey.title,
                    totalKm = journey.totalKm,
                    difficulty = journey.difficulty,
                    bannerUrl = journey.bannerUrl,
                    progressKm = userJourney.progressKm,
                    onClick = { onJourneyClick(journey.id) }
                )

                // Next milestone hint
                uiState.nextMilestone?.let { milestone ->
                    Spacer(modifier = Modifier.height(12.dp))
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.4f)
                        )
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("🏁", style = MaterialTheme.typography.titleLarge)
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "Next: ${milestone.title}",
                                    style = MaterialTheme.typography.titleSmall,
                                    fontWeight = FontWeight.Medium
                                )
                                Text(
                                    text = "${(milestone.kmMark - userJourney.progressKm).toKmString()} to go",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            } else {
                // No active journey — prompt to start one
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "No active journey",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        TextButton(onClick = onViewAllJourneys) {
                            Text("Pick a destination →")
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }

        // Confetti overlay for milestone celebrations
        ConfettiOverlay(
            isVisible = uiState.showConfetti,
            onFinished = { viewModel.dismissConfetti() }
        )
    }
}

@Composable
private fun QuickStat(
    icon: ImageVector,
    value: String,
    label: String
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = value,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.SemiBold
        )
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}
