package com.stepquest.utils

import android.content.Context
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import dagger.hilt.android.qualifiers.ApplicationContext
import java.time.LocalDate
import java.time.ZoneId
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Fallback step source using Health Connect API.
 * Used when the hardware step counter sensor is not available.
 */
@Singleton
class HealthConnectManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val client: HealthConnectClient? by lazy {
        try {
            if (HealthConnectClient.getSdkStatus(context) == HealthConnectClient.SDK_AVAILABLE) {
                HealthConnectClient.getOrCreate(context)
            } else null
        } catch (_: Exception) {
            null
        }
    }

    val isAvailable: Boolean
        get() = client != null

    /**
     * Reads today's total step count from Health Connect.
     * Returns 0 if unavailable or no data recorded.
     */
    suspend fun getTodaySteps(): Int {
        val hcClient = client ?: return 0

        val now = java.time.Instant.now()
        val startOfDay = LocalDate.now()
            .atStartOfDay(ZoneId.systemDefault())
            .toInstant()

        return try {
            val response = hcClient.readRecords(
                ReadRecordsRequest(
                    recordType = StepsRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(startOfDay, now)
                )
            )
            response.records.sumOf { it.count.toInt() }
        } catch (_: Exception) {
            0
        }
    }
}
