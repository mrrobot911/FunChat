import { messagesReducer } from '@/helpers/reducer';
import { authService } from '@/services/local-storage.service';
import React from '@/react';
import type {
  ErrorStore,
  OutgoingMessage,
  User,
  UserData,
  WebSocketHook,
} from '@/types';
import {
  messageManager,
  prepareOutgoingMessage,
  HANDLED_EVENT_TYPES,
} from '@/services/message-manager.service';
import socket from '@/helpers/socket';
import type { Channel } from 'phoenix';

const BROADCAST_EVENTS = HANDLED_EVENT_TYPES.filter(
  (e) => e !== 'USER_LOGIN' && e !== 'MSG_FROM_USER' && e !== 'USER_LOGOUT'
);

export function useWebSockets(): WebSocketHook {
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [userlist, setUserlist] = React.useState<User[]>([]);
  const [messages, dispatchMessages] = React.useReducer(messagesReducer, {});
  const [error, setError] = React.useState<ErrorStore[]>([]);

  const channelRef = React.useRef<Channel | null>(null);
  const currentUserRef = React.useRef<UserData | null>(authService.getUser());
  const pendingMessagesMapRef = React.useRef<Map<string, string>>(
    new Map<string, string>()
  );

  const addUser = (user: User): void => {
    setUserlist((pre) => {
      if (!pre.some((el) => el.login === user.login)) {
        return [...pre, user];
      }
      return pre.map((element) =>
        element.login === user.login ? user : element
      );
    });
  };

  const addUsers = (data: User[]): void => {
    setUserlist((pre) => [...pre, ...data]);
  };

  const clearUsers = (): void => {
    setUserlist([]);
  };

  function addError(error: ErrorStore): void {
    setError((pre) => [...pre, error]);
    setTimeout(() => setError((pre) => pre.filter((e) => e !== error)), 2000);
  }

  const handleMessage = (data: unknown, eventType?: string): void => {
    messageManager(
      data,
      pendingMessagesMapRef,
      sendMessage,
      currentUserRef,
      dispatchMessages,
      addUser,
      addUsers,
      clearUsers,
      addError,
      eventType
    );
  };

  const connect = React.useCallback(() => {
    if (channelRef.current) {
      return;
    }

    socket.connect();

    const handleDisconnect = (): void => {
      setIsConnected(false);
      clearUsers();
    };

    socket.onError(handleDisconnect);
    socket.onClose(handleDisconnect);

    const channel = socket.channel('chat:lobby', {});
    channelRef.current = channel;

    channel.onError(handleDisconnect);
    channel.onClose(handleDisconnect);

    channel
      .join()
      .receive('ok', () => {
        setIsConnected(true);

        if (currentUserRef.current !== null) {
          sendMessage({
            type: 'USER_LOGIN',
            payload: { user: currentUserRef.current },
          });
        }
      })
      .receive('error', () => {
        setIsConnected(false);
      });

    for (const event of BROADCAST_EVENTS) {
      channel.on(event, (response: unknown) => {
        handleMessage(response, event);
      });
    }
  }, []);

  const sendMessage = React.useCallback((message: OutgoingMessage): void => {
    if (!channelRef.current) {
      console.error('Channel is not connected. Unable to send message.');
      return;
    }

    const { eventType, payload } = prepareOutgoingMessage(
      message,
      pendingMessagesMapRef,
      currentUserRef.current?.login
    );

    channelRef.current
      .push(eventType, payload)
      .receive('ok', (response: unknown) => {
        handleMessage(response);
      })
      .receive('error', (err: unknown) => {
        handleMessage(err);
      });
  }, []);

  const disconnect = React.useCallback(() => {
    if (channelRef.current) {
      channelRef.current.leave();
      channelRef.current = null;
    }

    socket.disconnect();
    setIsConnected(false);
    clearUsers();
  }, []);

  return {
    connect,
    sendMessage,
    disconnect,
    isConnected,
    currentUserRef,
    userlist,
    messages,
    error,
  };
}
