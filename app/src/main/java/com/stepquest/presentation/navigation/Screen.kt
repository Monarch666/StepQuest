package com.stepquest.presentation.navigation

/** All navigation routes in the app. */
sealed class Screen(val route: String) {
    data object Auth : Screen("auth")
    data object UsernameSetup : Screen("username_setup")
    data object Home : Screen("home")
    data object JourneySelection : Screen("journey_selection")
    data object JourneyDetail : Screen("journey_detail/{journeyId}") {
        fun createRoute(journeyId: String) = "journey_detail/$journeyId"
    }
    data object Achievements : Screen("achievements")
    data object Leaderboard : Screen("leaderboard")
    data object Profile : Screen("profile")
    data object Paywall : Screen("paywall")
}
