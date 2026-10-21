package com.stepquest.presentation.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Leaderboard
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
import com.stepquest.domain.model.LeaderboardEntry
import com.stepquest.presentation.components.LeaderboardRow
import com.stepquest.presentation.components.LoadingIndicator
import com.stepquest.presentation.viewmodel.LeaderboardViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LeaderboardScreen(
    viewModel: LeaderboardViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.Leaderboard,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(28.dp)
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "Top Trailblazers",
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        if (state.isLoading) {
            LoadingIndicator()
            return@Scaffold
        }

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentPadding = PaddingValues(bottom = 24.dp)
        ) {
            // Weekly reset countdown banner
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                        .clip(MaterialTheme.shapes.large)
                        .background(
                            Brush.horizontalGradient(
                                colors = listOf(
                                    MaterialTheme.colorScheme.primary,
                                    MaterialTheme.colorScheme.primaryContainer
                                )
                            )
                        )
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                "Weekly Challenge",
                                style = MaterialTheme.typography.titleMedium,
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                "Resets every Monday at midnight",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color.White.copy(alpha = 0.8f)
                            )
                        }
                        Surface(
                            shape = MaterialTheme.shapes.medium,
                            color = Color.White.copy(alpha = 0.2f)
                        ) {
                            Text(
                                "3d 14h left",
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                style = MaterialTheme.typography.labelLarge,
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            // Podium — top 3
            if (state.entries.size >= 3) {
                item {
                    PodiumSection(
                        first = state.entries[0],
                        second = state.entries[1],
                        third = state.entries[2],
                        currentUserId = state.currentUserId
                    )
                }
            }

            // Rank list
            item {
                Text(
                    "All Trailblazers",
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }

            itemsIndexed(state.entries, key = { _, e -> e.userId }) { index, entry ->
                LeaderboardRow(
                    rank = index + 1,
                    entry = entry,
                    isCurrentUser = entry.userId == state.currentUserId,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
                )
            }

            // Current user floating rank (if not in top list)
            if (state.currentUserEntry != null &&
                state.entries.none { it.userId == state.currentUserId }
            ) {
                item {
                    Divider(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp))
                    Text(
                        "Your Rank",
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    LeaderboardRow(
                        rank = state.currentUserRank,
                        entry = state.currentUserEntry!!,
                        isCurrentUser = true,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun PodiumSection(
    first: LeaderboardEntry,
    second: LeaderboardEntry,
    third: LeaderboardEntry,
    currentUserId: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.Bottom
    ) {
        PodiumItem(entry = second, position = 2, height = 80.dp, currentUserId = currentUserId)
        PodiumItem(entry = first, position = 1, height = 110.dp, currentUserId = currentUserId)
        PodiumItem(entry = third, position = 3, height = 60.dp, currentUserId = currentUserId)
    }
}

@Composable
private fun PodiumItem(
    entry: LeaderboardEntry,
    position: Int,
    height: androidx.compose.ui.unit.Dp,
    currentUserId: String
) {
    val medalColor = when (position) {
        1 -> Color(0xFFFFD700)
        2 -> Color(0xFFC0C0C0)
        else -> Color(0xFFCD7F32)
    }
    val medalEmoji = when (position) { 1 -> "🥇"; 2 -> "🥈"; else -> "🥉" }
    val isMe = entry.userId == currentUserId

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(medalEmoji, style = MaterialTheme.typography.headlineSmall)
        Spacer(Modifier.height(4.dp))
        Text(
            entry.username.take(8),
            style = MaterialTheme.typography.labelMedium,
            fontWeight = if (isMe) FontWeight.Bold else FontWeight.Normal,
            color = if (isMe) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
        )
        Text(
            "${entry.totalKm.toInt()} km",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(Modifier.height(4.dp))
        Box(
            modifier = Modifier
                .width(72.dp)
                .height(height)
                .clip(MaterialTheme.shapes.medium)
                .background(medalColor.copy(alpha = if (isMe) 1f else 0.7f)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                "#$position",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }
    }
}
