import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const connectWebSocket = (restaurantId, handleTableUpdate, handleNotification) => {
    const socket = new SockJS('http://localhost:8080/ws');

    const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: function (str) {
            console.log(`WebSocket [${restaurantId}]:`, str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
    });

    stompClient.onConnect = () => {
        console.log('WebSocket Connected Successfully');

        // Subscribe to table updates
        stompClient.subscribe(
            `/topic/tables/${restaurantId}`,
            message => {
                try {
                    const tableUpdate = JSON.parse(message.body);
                    handleTableUpdate(tableUpdate);
                } catch (error) {
                    console.error('Error processing table update:', error);
                }
            }
        );

        stompClient.subscribe(
            `/topic/notifications/${restaurantId}`,
            message => {
                try {
                    const notification = JSON.parse(message.body);
                    handleNotification(notification);
                } catch (error) {
                    console.error('Error processing notification:', error);
                }
            }
        );
    };

    stompClient.onStompError = (frame) => {
        console.error('STOMP Protocol Error:', frame);
    };

    stompClient.onWebSocketError = (event) => {
        console.error('WebSocket Error:', event);
    };

    stompClient.onDisconnect = () => {
        console.log('WebSocket Disconnected - Will attempt to reconnect');
    };

    // Activate the connection
    try {
        stompClient.activate();
    } catch (error) {
        console.error('Error activating WebSocket connection:', error);
    }

    // Return cleanup function
    return () => {
        try {
            if (stompClient.active) {
                console.log('Cleaning up WebSocket connection');
                stompClient.deactivate();
            }
        } catch (error) {
            console.error('Error during WebSocket cleanup:', error);
        }
    };
};
