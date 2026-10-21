package com.stepquest.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.stepquest.presentation.screens.AchievementsScreen
import com.stepquest.presentation.screens.LeaderboardScreen
import com.stepquest.presentation.screens.ProfileScreen
import com.stepquest.presentation.screens.auth.AuthScreen
import com.stepquest.presentation.screens.auth.UsernameSetupScreen
import com.stepquest.presentation.screens.home.HomeScreen
import com.stepquest.presentation.screens.journey.JourneyDetailScreen
import com.stepquest.presentation.screens.journey.JourneySelectionScreen

@Composable
fun NavGraph(
    navController: NavHostController = rememberNavController(),
    startDestination: String = Screen.Auth.route
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Auth.route) {
            AuthScreen(
                onAuthSuccess = { hasUsername ->
                    if (hasUsername) {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(Screen.Auth.route) { inclusive = true }
                        }
                    } else {
                        navController.navigate(Screen.UsernameSetup.route) {
                            popUpTo(Screen.Auth.route) { inclusive = true }
                        }
                    }
                }
            )
        }

        composable(Screen.UsernameSetup.route) {
            UsernameSetupScreen(
                onComplete = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.UsernameSetup.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Home.route) {
            HomeScreen(
                onJourneyClick = { journeyId ->
                    navController.navigate(Screen.JourneyDetail.createRoute(journeyId))
                },
                onViewAllJourneys = {
                    navController.navigate(Screen.JourneySelection.route)
                }
            )
        }

        composable(Screen.JourneySelection.route) {
            JourneySelectionScreen(
                onJourneyClick = { journeyId ->
                    navController.navigate(Screen.JourneyDetail.createRoute(journeyId))
                }
            )
        }

        composable(
            route = Screen.JourneyDetail.route,
            arguments = listOf(navArgument("journeyId") { type = NavType.StringType })
        ) { backStackEntry ->
            val journeyId = backStackEntry.arguments?.getString("journeyId") ?: return@composable
            JourneyDetailScreen(
                journeyId = journeyId,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Achievements.route) {
            AchievementsScreen()
        }

        composable(Screen.Leaderboard.route) {
            LeaderboardScreen()
        }

        composable(Screen.Profile.route) {
            ProfileScreen(
                onSignOut = {
                    navController.navigate(Screen.Auth.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
    }
}
