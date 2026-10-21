package com.stepquest.data.remote

import com.stepquest.domain.model.DailyLog
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.postgrest
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import java.time.LocalDate
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class StepDataSource @Inject constructor(
    private val client: SupabaseClient
) {
    private val table get() = client.postgrest["daily_logs"]

    suspend fun getTodayLog(userId: String): DailyLog? {
        val today = LocalDate.now().toString()
        val results = table.select {
            filter {
                eq("user_id", userId)
                eq("date", today)
            }
        }.decodeList<DailyLog>()
        return results.firstOrNull()
    }

    suspend fun upsertDailyLog(userId: String, date: String, steps: Int, km: Double) {
        val existing = table.select {
            filter {
                eq("user_id", userId)
                eq("date", date)
            }
        }.decodeList<DailyLog>()

        if (existing.isNotEmpty()) {
            // Accumulate on top of existing entry
            val current = existing.first()
            table.update({
                set("steps", current.steps + steps)
                set("km", current.km + km)
            }) {
                filter { eq("id", current.id) }
            }
        } else {
            val entry = buildJsonObject {
                put("user_id", userId)
                put("date", date)
                put("steps", steps)
                put("km", km)
            }
            table.insert(entry)
        }
    }
}
