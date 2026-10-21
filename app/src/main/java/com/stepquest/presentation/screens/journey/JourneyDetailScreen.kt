package com.stepquest.presentation.screens.journey

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Button
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.Polyline
import com.google.maps.android.compose.rememberCameraPositionState
import com.stepquest.presentation.components.LoadingIndicator
import com.stepquest.presentation.components.MilestoneItem
import com.stepquest.presentation.viewmodel.JourneyViewModel
import com.stepquest.utils.toKmString

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun JourneyDetailScreen(
    journeyId: String,
    onBack: () -> Unit,
    onPaywall: () -> Unit,
    viewModel: JourneyViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(journeyId) {
        viewModel.loadJourneyDetail(journeyId)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        uiState.selectedJourney?.title ?: "Journey",
                        fontWeight = FontWeight.SemiBold
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { /* Share intent */ }) {
                        Icon(Icons.Filled.Share, "Share Progress")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        }
    ) { padding ->
        if (uiState.isLoading) {
            LoadingIndicator(modifier = Modifier.padding(padding))
            return@Scaffold
        }

        val journey = uiState.selectedJourney ?: return@Scaffold

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
        ) {
            // Map showing the route
            val startLatLng = LatLng(28.6139, 77.2090) // Delhi default
            val cameraState = rememberCameraPositionState {
                position = CameraPosition.fromLatLngZoom(startLatLng, 7f)
            }

            GoogleMap(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(250.dp),
                cameraPositionState = cameraState
            ) {
                // Route polyline (simplified for demo)
                val routePoints = listOf(
                    LatLng(28.6139, 77.2090),
                    LatLng(29.3803, 79.4636),
                    LatLng(30.7346, 79.0669)
                )
                Polyline(
                    points = routePoints,
                    color = androidx.compose.ui.graphics.Color(0xFFC75B39),
                    width = 8f
                )

                // User progress marker
                val userJourney = uiState.userJourney
                if (userJourney != null) {
                    val fraction = userJourney.progressFraction(journey.totalKm)
                    val idx = (fraction * (routePoints.size - 1)).toInt()
                        .coerceIn(0, routePoints.size - 1)
                    Marker(
                        state = MarkerState(position = routePoints[idx]),
                        title = "You are here"
                    )
                }

                // Start & end markers
                Marker(
                    state = MarkerState(position = routePoints.first()),
                    title = "Start"
                )
                Marker(
                    state = MarkerState(position = routePoints.last()),
                    title = "Destination"
                )
            }

            Column(modifier = Modifier.padding(20.dp)) {
                // Journey description
                Text(
                    text = journey.description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Progress bar (if journey started)
                val userJourney = uiState.userJourney
                if (userJourney != null) {
                    Text(
                        text = "Your Progress",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Medium
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    LinearProgressIndicator(
                        progress = { userJourney.progressFraction(journey.totalKm) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(8.dp)
                            .clip(MaterialTheme.shapes.extraSmall),
                        color = MaterialTheme.colorScheme.primary,
                        trackColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                    Text(
                        text = "${userJourney.progressKm.toKmString()} / ${journey.totalKm.toKmString()}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                } else {
                    // Start journey button
                    Button(
                        onClick = { viewModel.startJourney(journeyId) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                    ) {
                        Text("Start Journey")
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Milestones section
                Text(
                    text = "Milestones",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(8.dp))

                uiState.milestones.forEach { milestone ->
                    val completed = userJourney != null &&
                            userJourney.progressKm >= milestone.kmMark
                    MilestoneItem(
                        title = milestone.title,
                        description = milestone.description,
                        kmMark = milestone.kmMark,
                        isCompleted = completed
                    )
                    Divider(
                        color = MaterialTheme.colorScheme.surfaceVariant,
                        thickness = 0.5.dp
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}
