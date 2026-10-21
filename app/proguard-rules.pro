# ============================================================
# StepQuest ProGuard Rules
# ============================================================

# --- Kotlin Serialization ---
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt

-keepclassmembers class kotlinx.serialization.json.** {
    *** Companion;
}
-keepclasseswithmembers class kotlinx.serialization.json.** {
    kotlinx.serialization.KSerializer serializer(...);
}
-keep,includedescriptorclasses class com.stepquest.**$$serializer { *; }
-keepclassmembers class com.stepquest.** {
    *** Companion;
}
-keepclasseswithmembers class com.stepquest.** {
    kotlinx.serialization.KSerializer serializer(...);
}

# --- Supabase / Ktor ---
-keep class io.github.jan.supabase.** { *; }
-keep class io.ktor.** { *; }
-dontwarn io.ktor.**
-dontwarn org.slf4j.**

# --- Google Maps ---
-keep class com.google.android.gms.maps.** { *; }
-keep class com.google.maps.android.** { *; }

# --- Room ---
-keep class * extends androidx.room.RoomDatabase
-dontwarn androidx.room.paging.**

# --- Hilt ---
-dontwarn dagger.hilt.**

# --- Coil ---
-dontwarn coil.**

# --- General ---
-keepattributes Signature
-keepattributes Exceptions
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
