package com.stepquest.presentation.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.airbnb.lottie.compose.LottieAnimation
import com.airbnb.lottie.compose.LottieCompositionSpec
import com.airbnb.lottie.compose.animateLottieCompositionAsState
import com.airbnb.lottie.compose.rememberLottieComposition

/**
 * Full-screen confetti overlay triggered when a milestone is unlocked.
 * Uses a bundled Lottie animation file.
 *
 * If no Lottie file is available, falls back to a simple visual.
 * Add a confetti.json to res/raw/ for the full effect.
 */
@Composable
fun ConfettiOverlay(
    isVisible: Boolean,
    onFinished: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (!isVisible) return

    val composition by rememberLottieComposition(
        LottieCompositionSpec.Asset("confetti.json")
    )
    val progress by animateLottieCompositionAsState(
        composition = composition,
        iterations = 1
    )

    // Auto-dismiss when animation finishes
    if (progress >= 1f) {
        onFinished()
    }

    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        LottieAnimation(
            composition = composition,
            progress = { progress },
            modifier = Modifier.fillMaxSize()
        )
    }
}
