import { useTheme } from '@/src/providers';
import React, { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { notificationSettingsStyles } from './styles';

interface NotificationSettingsProps {
  initialMorningReminders?: boolean;
  initialAfternoonReminders?: boolean;
  initialTimerEndNotifications?: boolean;
  onNotificationChange: (notifications: {
    morningReminders: boolean;
    afternoonReminders: boolean;
    timerEndNotifications: boolean;
  }) => void;
}

export default function NotificationSettings({
  initialMorningReminders = true,
  initialAfternoonReminders = true,
  initialTimerEndNotifications = true,
  onNotificationChange,
}: NotificationSettingsProps) {
  const { theme } = useTheme();
  const styles = notificationSettingsStyles(theme);

  const [morningReminders, setMorningReminders] = useState(
    initialMorningReminders
  );
  const [afternoonReminders, setAfternoonReminders] = useState(
    initialAfternoonReminders
  );
  const [timerEndNotifications, setTimerEndNotifications] = useState(
    initialTimerEndNotifications
  );

  const handleNotificationChange = (type: string, value: boolean) => {
    let newNotifications;

    switch (type) {
      case 'morning':
        setMorningReminders(value);
        newNotifications = {
          morningReminders: value,
          afternoonReminders,
          timerEndNotifications,
        };
        break;
      case 'afternoon':
        setAfternoonReminders(value);
        newNotifications = {
          morningReminders,
          afternoonReminders: value,
          timerEndNotifications,
        };
        break;
      case 'timer':
        setTimerEndNotifications(value);
        newNotifications = {
          morningReminders,
          afternoonReminders,
          timerEndNotifications: value,
        };
        break;
      default:
        return;
    }

    onNotificationChange(newNotifications);
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Morning Reminders</Text>
          <Text style={styles.settingDescription}>
            Get reminded to start your daily focus session
          </Text>
        </View>
        <Switch
          value={morningReminders}
          onValueChange={enabled =>
            handleNotificationChange('morning', enabled)
          }
          trackColor={{
            false: theme.colors.surfaceVariant,
            true: theme.colors.primary,
          }}
          thumbColor={
            morningReminders
              ? theme.colors.background
              : theme.colors.textSecondary
          }
        />
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Afternoon Reminders</Text>
          <Text style={styles.settingDescription}>
            Afternoon reminder to keep your momentum going
          </Text>
        </View>
        <Switch
          value={afternoonReminders}
          onValueChange={enabled =>
            handleNotificationChange('afternoon', enabled)
          }
          trackColor={{
            false: theme.colors.surfaceVariant,
            true: theme.colors.primary,
          }}
          thumbColor={
            afternoonReminders
              ? theme.colors.background
              : theme.colors.textSecondary
          }
        />
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Timer End Notifications</Text>
          <Text style={styles.settingDescription}>
            Get notified when your timer ends (even if app is closed)
          </Text>
        </View>
        <Switch
          value={timerEndNotifications}
          onValueChange={enabled => handleNotificationChange('timer', enabled)}
          trackColor={{
            false: theme.colors.surfaceVariant,
            true: theme.colors.primary,
          }}
          thumbColor={
            timerEndNotifications
              ? theme.colors.background
              : theme.colors.textSecondary
          }
        />
      </View>
    </View>
  );
}
