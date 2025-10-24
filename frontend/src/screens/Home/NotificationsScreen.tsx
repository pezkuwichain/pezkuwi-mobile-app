import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../constants/theme';

interface Notification {
  id: string;
  type: 'transaction' | 'governance' | 'reward' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export default function NotificationsScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setNotifications([
        {
          id: '1',
          type: 'transaction',
          title: 'Transaction Confirmed',
          message: 'You received 1,000 PEZ from 5Grw...KutQY',
          timestamp: Date.now() - 3600000,
          read: false,
        },
        {
          id: '2',
          type: 'governance',
          title: 'New Proposal',
          message: 'Proposal #47: Increase PEZ rewards by 10%',
          timestamp: Date.now() - 7200000,
          read: false,
        },
        {
          id: '3',
          type: 'reward',
          title: 'Staking Rewards',
          message: 'You earned 245 PEZ from staking',
          timestamp: Date.now() - 86400000,
          read: true,
        },
        {
          id: '4',
          type: 'system',
          title: 'KYC Approved',
          message: 'Your Kurdistan Citizen Card is ready',
          timestamp: Date.now() - 172800000,
          read: true,
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return 'swap-horizontal';
      case 'governance':
        return 'megaphone';
      case 'reward':
        return 'star';
      case 'system':
        return 'information-circle';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'transaction':
        return Colors.blue;
      case 'governance':
        return Colors.peach;
      case 'reward':
        return Colors.gold;
      case 'system':
        return Colors.teal;
      default:
        return Colors.textGray;
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.teal} style={{ marginTop: 50 }} />
        ) : notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={80} color={Colors.textGray} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard,
              ]}
              onPress={() => markAsRead(notification.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getNotificationColor(notification.type) + '20' },
                ]}
              >
                <Ionicons
                  name={getNotificationIcon(notification.type)}
                  size={24}
                  color={getNotificationColor(notification.type)}
                />
              </View>

              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{formatTime(notification.timestamp)}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.coral,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    marginBottom: Spacing.md,
    ...Shadow.small,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.teal,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.teal,
  },
  notificationMessage: {
    fontSize: Typography.sizes.small,
    color: Colors.textGray,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: Typography.sizes.small,
    color: Colors.textGray,
    opacity: 0.7,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: Typography.sizes.medium,
    color: Colors.textGray,
    marginTop: Spacing.lg,
  },
});

