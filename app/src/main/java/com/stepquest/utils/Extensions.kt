package com.stepquest.utils

import java.text.NumberFormat
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

/** Format a large number with commas: 12345 → "12,345" */
fun Int.formatted(): String = NumberFormat.getNumberInstance(Locale.getDefault()).format(this)

fun Long.formatted(): String = NumberFormat.getNumberInstance(Locale.getDefault()).format(this)

/** Format km to one decimal place: 3.456 → "3.5 km" */
fun Double.toKmString(): String = String.format(Locale.getDefault(), "%.1f km", this)

/** Friendly date: "25 Apr 2026" */
fun String.toDisplayDate(): String {
    return try {
        val date = LocalDate.parse(this)
        date.format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
    } catch (_: Exception) {
        this
    }
}

/** Greeting based on time of day. */
fun getGreeting(): String {
    val hour = java.time.LocalTime.now().hour
    return when {
        hour < 12 -> "Good morning"
        hour < 17 -> "Good afternoon"
        else -> "Good evening"
    }
}
