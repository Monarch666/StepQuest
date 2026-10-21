package com.stepquest.presentation.screens.journey

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DirectionsWalk
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.stepquest.domain.model.Journey
import com.stepquest.presentation.components.JourneyCard
import com.stepquest.presentation.components.LoadingIndicator
import com.stepquest.presentation.viewmodel.JourneyViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun JourneySelectionScreen(
    onJourneyClick: (String) -> Unit,
    viewModel: JourneyViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf("All") }
    val filters = listOf("All", "Easy", "Moderate", "Hard")

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Choose Your Quest",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Search bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                placeholder = { Text("Search journeys...", style = MaterialTheme.typography.bodyMedium) },
                leadingIcon = {
                    Icon(
                        Icons.Default.Search,
                        contentDescription = "Search",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                },
                trailingIcon = {
                    Icon(
                        Icons.Default.FilterList,
                        contentDescription = "Filter",
                        tint = MaterialTheme.colorScheme.primary
                    )
                },
                shape = MaterialTheme.shapes.large,
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = MaterialTheme.colorScheme.primary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant,
                    focusedContainerColor = MaterialTheme.colorScheme.surfaceContainerLow,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surfaceContainerLow,
                )
            )

            // Filter chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                filters.forEach { filter ->
                    FilterChip(
                        selected = selectedFilter == filter,
                        onClick = { selectedFilter = filter },
                        label = { Text(filter, style = MaterialTheme.typography.labelMedium) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MaterialTheme.colorScheme.primary,
                            selectedLabelColor = MaterialTheme.colorScheme.onPrimary,
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Stats banner
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .clip(MaterialTheme.shapes.large)
                    .background(
                        Brush.horizontalGradient(
                            colors = listOf(
                                MaterialTheme.colorScheme.primary,
                                MaterialTheme.colorScheme.tertiary
                            )
                        )
                    )
                    .padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    StatItem("24", "Quests", Color.White)
                    Divider(
                        modifier = Modifier
                            .height(32.dp)
                            .width(1.dp),
                        color = Color.White.copy(alpha = 0.4f)
                    )
                    StatItem("3", "Active", Color.White)
                    Divider(
                        modifier = Modifier
                            .height(32.dp)
                            .width(1.dp),
                        color = Color.White.copy(alpha = 0.4f)
                    )
                    StatItem("8.2k+", "Avg Steps", Color.White)
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Content
            when {
                state.isLoading -> LoadingIndicator()
                state.error != null -> {
                    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(
                                Icons.Default.DirectionsWalk,
                                contentDescription = null,
                                modifier = Modifier.size(64.dp),
                                tint = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(Modifier.height(16.dp))
                            Text(
                                "Failed to load journeys",
                                style = MaterialTheme.typography.titleMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(Modifier.height(8.dp))
                            Button(onClick = { viewModel.loadJourneys() }) {
                                Text("Retry")
                            }
                        }
                    }
                }
                else -> {
                    val filtered = state.journeys.filter { journey ->
                        val matchesSearch = searchQuery.isEmpty() ||
                            journey.title.contains(searchQuery, ignoreCase = true) ||
                            journey.description.contains(searchQuery, ignoreCase = true)
                        val matchesFilter = selectedFilter == "All" ||
                            journey.difficulty == selectedFilter
                        matchesSearch && matchesFilter
                    }

                    if (filtered.isEmpty()) {
                        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("🗺️", style = MaterialTheme.typography.displayMedium)
                                Spacer(Modifier.height(16.dp))
                                Text(
                                    "No quests found",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Text(
                                    "Try a different search or filter",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    } else {
                        LazyColumn(
                            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(filtered, key = { it.id }) { journey ->
                                JourneyCard(
                                    journey = journey,
                                    userJourney = state.activeJourney
                                        ?.takeIf { it.journeyId == journey.id },
                                    onClick = { onJourneyClick(journey.id) },
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                            item { Spacer(Modifier.height(16.dp)) }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun StatItem(value: String, label: String, tint: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = value,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = tint
        )
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = tint.copy(alpha = 0.85f)
        )
    }
}
