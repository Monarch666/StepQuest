package com.stepquest.data.repository

import com.stepquest.data.remote.AuthDataSource
import com.stepquest.data.remote.UserDataSource
import com.stepquest.domain.model.User
import com.stepquest.domain.repository.AuthRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val authDataSource: AuthDataSource,
    private val userDataSource: UserDataSource
) : AuthRepository {

    override val currentUser: Flow<User?> =
        authDataSource.currentUserId.map { uid ->
            if (uid != null && userDataSource.userExists(uid)) {
                try { userDataSource.getUser(uid) } catch (_: Exception) { null }
            } else null
        }

    override suspend fun signInWithEmail(email: String, password: String): Result<User> =
        runCatching {
            val uid = authDataSource.signInWithEmail(email, password)
            userDataSource.getUser(uid)
        }

    override suspend fun signUpWithEmail(email: String, password: String): Result<User> =
        runCatching {
            authDataSource.signUpWithEmail(email, password)
            // User row will be created during username setup
            User(id = authDataSource.getCurrentUserId() ?: "")
        }

    override suspend fun signInWithGoogle(idToken: String): Result<User> = runCatching {
        val uid = authDataSource.signInWithGoogle(idToken)
        if (userDataSource.userExists(uid)) {
            userDataSource.getUser(uid)
        } else {
            User(id = uid)
        }
    }

    override suspend fun setupUsername(username: String): Result<User> = runCatching {
        val uid = authDataSource.getCurrentUserId()
            ?: throw IllegalStateException("Not signed in")
        val user = User(id = uid, username = username)
        userDataSource.upsertUser(user)
    }

    override suspend fun signOut() {
        authDataSource.signOut()
    }

    override suspend fun hasCompletedOnboarding(): Boolean {
        val uid = authDataSource.getCurrentUserId() ?: return false
        return userDataSource.userExists(uid)
    }
}
