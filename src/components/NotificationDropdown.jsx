import React, { useState, useEffect, useCallback } from 'react';
import { Bell, User } from 'lucide-react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import api from '../config/axiosConfig';
import PropTypes from 'prop-types';
import { useAuth } from "@/context/AuthContext";
import './NotificationDropdown.css';

const NotificationDropdown = ({ onTableUpdate }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [stompClient, setStompClient] = useState(null);

    const handleTableUpdate = useCallback((message) => {
        if (onTableUpdate) {
            onTableUpdate();
        }
    }, [onTableUpdate]);

    const handleNotification = useCallback((message) => {
        try {
            const notification = JSON.parse(message.body);
            setNotifications(prev => {
                if (!prev.find(n => n.id === notification.id)) {
                    setUnreadCount(count => count + 1);
                    return [notification, ...prev];
                }
                return prev;
            });
        } catch (error) {
            console.error('Error processing notification:', error);
        }
    }, []);

    // WebSocket connection setup
    useEffect(() => {
        if (!user?.companyId) return;

        let client = null;
        try {
            const socket = new SockJS('http://localhost:8080/ws');
            client = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    console.log('WebSocket Connected');
                    client.subscribe(`/topic/notifications/${user.companyId}`, handleNotification);
                    client.subscribe(`/topic/tables/${user.companyId}`, handleTableUpdate);
                },
                onStompError: (error) => {
                    console.error('STOMP error:', error);
                },
                onDisconnect: () => {
                    console.log('WebSocket Disconnected');
                }
            });

            client.activate();
            setStompClient(client);
        } catch (error) {
            console.error('Error setting up WebSocket:', error);
        }

        return () => {
            if (client?.active) {
                client.deactivate();
            }
        };
    }, [user?.companyId, handleNotification, handleTableUpdate]);

    // Check reservations status
    useEffect(() => {
        if (!user?.companyId) return;

        const checkReservations = async () => {
            try {
                const response = await api.get(`/staff/reservations/company/${user.companyId}`);
                const reservations = response.data;
                const now = new Date();

                reservations.forEach(reservation => {
                    const reservationDate = new Date(reservation.reservationDate);
                    const timeDiff = Math.abs(now - reservationDate) / 60000;

                    if (reservation.status === 'CONFIRMED' && timeDiff > 15) {
                        const notificationId = `late-${reservation.id}`;
                        if (!notifications.find(n => n.id === notificationId)) {
                            handleNotification({
                                body: JSON.stringify({
                                    id: notificationId,
                                    type: 'LATE_ARRIVAL',
                                    userName: reservation.customerName,
                                    message: 'is 15 minutes late',
                                    action: 'Table ' + reservation.tableNumber,
                                    time: new Date().toISOString()
                                })
                            });
                        }
                    }
                });
            } catch (error) {
                console.error('Error checking reservations:', error);
            }
        };

        const interval = setInterval(checkReservations, 60000);
        checkReservations();

        return () => clearInterval(interval);
    }, [user?.companyId, notifications, handleNotification]);

    const markAllAsRead = () => {
        setUnreadCount(0);
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
    };

    const formatTimeAgo = (time) => {
        if (!time) return '';
        const minutes = Math.floor((new Date() - new Date(time)) / 60000);
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    return (
        <div className="notification-dropdown">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="notification-button"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="notification-count">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-panel">
                    <div className="notification-header">
                        <h3 className="notification-title">Notifications</h3>
                        <button
                            onClick={markAllAsRead}
                            className="mark-read-button"
                        >
                            Mark all as read
                        </button>
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="empty-notifications">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div key={notification.id} className="notification-item">
                                    <div className="notification-content">
                                        <div className="avatar">
                                            <User size={24} />
                                        </div>
                                        <div className="notification-details">
                                            <p className="notification-message">
                                                <span className="notification-name">
                                                    {notification.userName}
                                                </span>
                                                {' '}{notification.message}{' '}
                                                <span className="notification-action">
                                                    {notification.action}
                                                </span>
                                            </p>
                                            <span className="notification-time">
                                                {formatTimeAgo(notification.time)}
                                            </span>

                                            {notification.type === 'LATE_ARRIVAL' && (
                                                <div className="notification-buttons">
                                                    <button className="action-button accept-button">
                                                        Call Customer
                                                    </button>
                                                    <button className="action-button decline-button">
                                                        Mark No-Show
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <a href="#" className="view-all">
                            View all notifications
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

NotificationDropdown.propTypes = {
    onTableUpdate: PropTypes.func,
};

export default NotificationDropdown;