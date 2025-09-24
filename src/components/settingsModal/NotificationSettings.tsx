import { useNotifications, useTheme } from '@/src/providers';
import React from 'react';
import { Switch, Text, View } from 'react-native';
import { notificationSettingsStyles } from './styles';

export default function NotificationSettings() {
  const { theme } = useTheme();
  const { settings, updateSettings } = useNotifications();
  const styles = notificationSettingsStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Morning Focus</Text>
          <Text style={styles.settingDescription}>
            Get reminded to start your daily focus session
          </Text>
        </View>
        <Switch
          value={settings.dailyReminderEnabled}
          onValueChange={(enabled) => updateSettings({ dailyReminderEnabled: enabled })}
          trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
          thumbColor={
            settings.dailyReminderEnabled ? theme.colors.background : theme.colors.textSecondary
          }
        />
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Motivational Boost</Text>
          <Text style={styles.settingDescription}>
            Afternoon reminder to keep your momentum going
          </Text>
        </View>
        <Switch
          value={settings.motivationalReminderEnabled}
          onValueChange={(enabled) => updateSettings({ motivationalReminderEnabled: enabled })}
          trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
          thumbColor={
            settings.motivationalReminderEnabled
              ? theme.colors.background
              : theme.colors.textSecondary
          }
        />
      </View>
    </View>
  );
}
