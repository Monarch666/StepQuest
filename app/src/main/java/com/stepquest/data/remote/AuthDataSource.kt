package com.stepquest.data.remote

import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.gotrue.auth
import io.github.jan.supabase.gotrue.providers.builtin.Email
import io.github.jan.supabase.gotrue.providers.builtin.IDToken
import io.github.jan.supabase.gotrue.providers.Google
import io.github.jan.supabase.gotrue.user.UserInfo
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthDataSource @Inject constructor(
    private val client: SupabaseClient
) {
    /** Observe auth state changes. Emits the current user ID or null. */
    val currentUserId: Flow<String?> =
        client.auth.sessionFlow.map { it?.user?.id }

    suspend fun signInWithEmail(email: String, password: String): String {
        client.auth.signInWith(Email) {
            this.email = email
            this.password = password
        }
        return requireUserId()
    }

    suspend fun signUpWithEmail(email: String, password: String): String {
        client.auth.signUpWith(Email) {
            this.email = email
            this.password = password
        }
        return requireUserId()
    }

    suspend fun signInWithGoogle(idToken: String): String {
        client.auth.signInWith(IDToken) {
            this.provider = Google
            this.idToken = idToken
        }
        return requireUserId()
    }

    suspend fun signOut() {
        client.auth.signOut()
    }

    fun getCurrentUserId(): String? {
        return client.auth.currentUserOrNull()?.id
    }

    private fun requireUserId(): String {
        return client.auth.currentUserOrNull()?.id
            ?: throw IllegalStateException("Auth succeeded but no user ID available")
    }
}
