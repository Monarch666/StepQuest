package com.stepquest.presentation.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.stepquest.presentation.theme.EasyBadge
import com.stepquest.presentation.theme.HardBadge
import com.stepquest.presentation.theme.ModerateBadge
import com.stepquest.utils.toKmString

/**
 * Card displaying a journey with its banner image, title, distance, and difficulty.
 * Optionally shows a progress bar when the user has started this journey.
 */
@Composable
fun JourneyCard(
    title: String,
    totalKm: Double,
    difficulty: String,
    bannerUrl: String,
    progressKm: Double? = null,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        onClick = onClick,
        modifier = modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.large,
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column {
            // Banner image
            AsyncImage(
                model = bannerUrl,
                contentDescription = title,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(140.dp),
                contentScale = ContentScale.Crop
            )

            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    DifficultyBadge(difficulty)
                }

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = totalKm.toKmString(),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                // Show progress bar if the user is on this journey
                if (progressKm != null) {
                    Spacer(modifier = Modifier.height(12.dp))
                    val fraction = (progressKm / totalKm).coerceIn(0.0, 1.0).toFloat()
                    LinearProgressIndicator(
                        progress = { fraction },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(MaterialTheme.shapes.extraSmall),
                        color = MaterialTheme.colorScheme.primary,
                        trackColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                    Text(
                        text = "${progressKm.toKmString()} / ${totalKm.toKmString()}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun DifficultyBadge(difficulty: String) {
    val color = when (difficulty) {
        "Easy" -> EasyBadge
        "Moderate" -> ModerateBadge
        "Hard" -> HardBadge
        else -> MaterialTheme.colorScheme.outline
    }
    androidx.compose.material3.SuggestionChip(
        onClick = {},
        label = {
            Text(
                text = difficulty,
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Medium
            )
        },
        colors = androidx.compose.material3.SuggestionChipDefaults.suggestionChipColors(
            containerColor = color.copy(alpha = 0.15f),
            labelColor = color
        ),
        border = null
    )
}
