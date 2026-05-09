import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (expertId, onSlotBooked) => {
  const socketRef = useRef(null);
  const callbackRef = useRef(onSlotBooked);

  useEffect(() => {
    callbackRef.current = onSlotBooked;
  }, [onSlotBooked]);

  useEffect(() => {
    if (!expertId) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Connected, joining room for expert:', expertId);
      socket.emit('joinExpertRoom', expertId);
    });

    socket.on('slotBooked', (data) => {
      console.log('[Socket] slotBooked event received:', data);
      if (data.expertId === expertId && callbackRef.current) {
        callbackRef.current(data.date, data.timeSlot);
      }
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    return () => {
      if (socket.connected) {
        socket.emit('leaveExpertRoom', expertId);
      }
      socket.disconnect();
    };
  }, [expertId]);

  return socketRef;
};

export default useSocket;
