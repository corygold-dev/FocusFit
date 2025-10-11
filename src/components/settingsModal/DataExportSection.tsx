import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth, useTheme } from '../../providers';
import { dataExportService } from '../../services/DataExportService';

interface DataExportSectionProps {
  onExportComplete?: () => void;
}

export default function DataExportSection({
  onExportComplete,
}: DataExportSectionProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  const styles = {
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    exportButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    exportButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500' as const,
      marginLeft: 8,
    },
    disabledButton: {
      backgroundColor: theme.colors.textSecondary,
    },
    disabledText: {
      color: '#FFFFFF',
    },
  };

  const handleExportJSON = async () => {
    if (!user || isExporting) return;

    setIsExporting(true);
    try {
      const jsonData = await dataExportService.exportToJSON(user);

      // Share the JSON data
      await Share.share({
        message: jsonData,
        title: 'FocusFit Data Export (JSON)',
      });

      Alert.alert(
        'Export Complete',
        'Your data has been prepared for export. The JSON data contains all your FocusFit information.',
        [{ text: 'OK', onPress: onExportComplete }]
      );
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert(
        'Export Failed',
        'There was an error exporting your data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    if (!user || isExporting) return;

    setIsExporting(true);
    try {
      const csvData = await dataExportService.exportToCSV(user);

      // Share the CSV data
      await Share.share({
        message: csvData,
        title: 'FocusFit Data Export (CSV)',
      });

      Alert.alert(
        'Export Complete',
        'Your session data has been exported as CSV format.',
        [{ text: 'OK', onPress: onExportComplete }]
      );
    } catch (error) {
      console.error('CSV export failed:', error);
      Alert.alert(
        'Export Failed',
        'There was an error exporting your data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportOptions = () => {
    Alert.alert('Export Data', 'Choose your preferred export format:', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'JSON (Complete Data)', onPress: handleExportJSON },
      { text: 'CSV (Session Data)', onPress: handleExportCSV },
    ]);
  };

  return (
    <View>
      <Text style={styles.description}>
        Export your FocusFit data for backup, analysis, or to use with other
        apps. Choose from complete JSON export or CSV for spreadsheets.
      </Text>

      <TouchableOpacity
        style={[styles.exportButton, isExporting && styles.disabledButton]}
        onPress={handleExportOptions}
        disabled={isExporting}
      >
        {isExporting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <MaterialIcons name="download" size={16} color="#FFFFFF" />
        )}
        <Text
          style={[styles.exportButtonText, isExporting && styles.disabledText]}
        >
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
