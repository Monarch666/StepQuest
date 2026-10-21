package com.stepquest.data.remote

import com.stepquest.domain.model.User
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.storage.storage
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class UserDataSource @Inject constructor(
    private val client: SupabaseClient
) {
    private val table get() = client.postgrest["users"]
    private val bucket get() = client.storage["avatars"]

    suspend fun getUser(userId: String): User {
        return table.select {
            filter { eq("id", userId) }
        }.decodeSingle<User>()
    }

    suspend fun upsertUser(user: User): User {
        table.upsert(user)
        return user
    }

    suspend fun updateUser(user: User): User {
        table.update(user) {
            filter { eq("id", user.id) }
        }
        return user
    }

    suspend fun userExists(userId: String): Boolean {
        val result = table.select {
            filter { eq("id", userId) }
        }
        return result.data.isNotEmpty() && result.data != "[]"
    }

    suspend fun uploadAvatar(userId: String, imageBytes: ByteArray): String {
        val path = "avatars/$userId.jpg"
        bucket.upload(path, imageBytes, upsert = true)
        return bucket.publicUrl(path)
    }
}
