package com.stepquest.data.remote

import com.stepquest.domain.model.LeaderboardEntry
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.postgrest
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import javax.inject.Inject
import javax.inject.Singleton

@Serializable
private data class LeaderboardRow(
    val id: String = "",
    val username: String = "",
    @SerialName("avatar_url") val avatarUrl: String? = null,
    @SerialName("total_km") val totalKm: Double = 0.0
)

@Singleton
class LeaderboardDataSource @Inject constructor(
    private val client: SupabaseClient
) {
    /**
     * Fetches top 10 users by total_km from the users table.
     * In a full implementation this would query weekly aggregated data
     * and use Supabase Realtime for live updates.
     */
    fun getLeaderboard(): Flow<List<LeaderboardEntry>> = flow {
        val rows = client.postgrest["users"]
            .select {
                order("total_km", referencedTable = null) {
                    ascending = false
                }
                limit(10)
            }
            .decodeList<LeaderboardRow>()

        val entries = rows.mapIndexed { index, row ->
            LeaderboardEntry(
                userId = row.id,
                username = row.username,
                avatarUrl = row.avatarUrl,
                totalKm = row.totalKm,
                rank = index + 1
            )
        }
        emit(entries)
    }
}
