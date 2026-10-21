package com.stepquest.domain.repository

import com.stepquest.domain.model.User
import kotlinx.coroutines.flow.Flow

interface AuthRepository {

    /** Currently signed-in user, or null. Emits on auth state changes. */
    val currentUser: Flow<User?>

    suspend fun signInWithEmail(email: String, password: String): Result<User>

    suspend fun signUpWithEmail(email: String, password: String): Result<User>

    suspend fun signInWithGoogle(idToken: String): Result<User>

    /** Set the display name on first login. Creates the public users row. */
    suspend fun setupUsername(username: String): Result<User>

    suspend fun signOut()

    /** True if a users row exists for the current auth uid. */
    suspend fun hasCompletedOnboarding(): Boolean
}
