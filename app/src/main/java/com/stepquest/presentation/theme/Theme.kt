package com.stepquest.presentation.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = TrailOrangeDark,
    onPrimary = Color.White,
    primaryContainer = TrailOrangeContainer,
    onPrimaryContainer = Color(0xFFFFFBFF),
    inversePrimary = TrailOrangeLight,
    secondary = ForestGreen,
    onSecondary = Color.White,
    secondaryContainer = ForestGreenLight,
    onSecondaryContainer = Color(0xFF307231),
    tertiary = SkyBlue,
    onTertiary = Color.White,
    tertiaryContainer = Color(0xFF007ABC),
    onTertiaryContainer = Color(0xFFFDFCFF),
    error = ErrorColor,
    onError = OnError,
    errorContainer = ErrorContainer,
    onErrorContainer = OnErrorContainer,
    background = BackgroundLight,
    onBackground = OnSurfaceLight,
    surface = SurfaceLight,
    onSurface = OnSurfaceLight,
    onSurfaceVariant = OnSurfaceVariantLight,
    surfaceVariant = SurfaceContainerHighestLight,
    outline = OutlineLight,
    outlineVariant = OutlineVariantLight,
    surfaceContainer = SurfaceContainerLight,
    surfaceContainerHigh = SurfaceContainerHighLight,
    surfaceContainerHighest = SurfaceContainerHighestLight,
    surfaceContainerLow = SurfaceContainerLowLight,
)

private val DarkColorScheme = darkColorScheme(
    primary = TrailOrangeLight,
    onPrimary = Color(0xFF5A1A00),
    primaryContainer = Color(0xFF7E2C00),
    onPrimaryContainer = Color(0xFFFFDBCE),
    inversePrimary = TrailOrangeDark,
    secondary = ForestGreenLight,
    onSecondary = Color(0xFF002203),
    secondaryContainer = Color(0xFF0C5216),
    onSecondaryContainer = Color(0xFFACF4A4),
    tertiary = SkyBlueLight,
    onTertiary = Color(0xFF001D32),
    tertiaryContainer = Color(0xFF004A75),
    onTertiaryContainer = Color(0xFFCEE5FF),
    error = Color(0xFFFFB4AB),
    onError = Color(0xFF690005),
    errorContainer = Color(0xFF93000A),
    onErrorContainer = Color(0xFFFFDAD6),
    background = BackgroundDark,
    onBackground = OnSurfaceDark,
    surface = SurfaceDark,
    onSurface = OnSurfaceDark,
    onSurfaceVariant = OnSurfaceVariantDark,
    surfaceVariant = SurfaceContainerHighestDark,
    outline = OutlineDark,
    surfaceContainer = SurfaceContainerDark,
    surfaceContainerHigh = SurfaceContainerHighDark,
    surfaceContainerHighest = SurfaceContainerHighestDark,
)

@Composable
fun StepQuestTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = StepQuestTypography,
        shapes = StepQuestShapes,
        content = content
    )
}
