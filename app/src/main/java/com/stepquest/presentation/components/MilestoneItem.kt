package com.stepquest.presentation.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.outlined.Flag
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.stepquest.presentation.theme.SuccessGreen
import com.stepquest.utils.toKmString

@Composable
fun MilestoneItem(
    title: String,
    description: String,
    kmMark: Double,
    isCompleted: Boolean,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = if (isCompleted) Icons.Filled.CheckCircle else Icons.Outlined.Flag,
            contentDescription = if (isCompleted) "Completed" else "Upcoming",
            tint = if (isCompleted) SuccessGreen else MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.size(28.dp)
        )

        Spacer(modifier = Modifier.width(14.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleSmall,
                fontWeight = if (isCompleted) FontWeight.SemiBold else FontWeight.Normal,
                color = if (isCompleted)
                    MaterialTheme.colorScheme.onBackground
                else
                    MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                text = description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        Text(
            text = kmMark.toKmString(),
            style = MaterialTheme.typography.labelMedium,
            color = if (isCompleted)
                SuccessGreen
            else
                MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}
