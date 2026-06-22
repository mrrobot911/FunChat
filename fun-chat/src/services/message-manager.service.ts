import {
  isActiveUser,
  isAllMessages,
  isAuthMessage,
  isAuthUsersResponse,
  isErrorResponse,
  isGetHistoryMessage,
  isMessage,
  isUser,
  isUserLoginResponse,
  isUserLogoutResponse,
  validEditMessage,
  validMessageResponse,
  validUpdateMessage,
} from '@/validators';
import { authService } from './local-storage.service';
import { navigate } from '@/react/router';
import { getUserMessages, getUsersList } from '@/helpers/messages';
import type {
  ErrorStore,
  MessageAction,
  MessageResponse,
  OutgoingMessage,
  PreparedOutgoingMessage,
  User,
  UserData,
} from '@/types';

type PendingMap = { current: Map<string, string> | null };
type CurrentUserRef = { current: UserData | null };

export const HANDLED_EVENT_TYPES = [
  'USER_LOGIN',
  'USER_ACTIVE',
  'USER_INACTIVE',
  'USER_EXTERNAL_LOGIN',
  'USER_EXTERNAL_LOGOUT',
  'MSG_FROM_USER',
  'MSG_SEND',
  'MSG_DELIVER',
  'MSG_READ',
  'MSG_EDIT',
  'MSG_DELETE',
  'USER_LOGOUT',
  'ERROR',
] as const;

export function prepareOutgoingMessage(
  message: OutgoingMessage,
  pendingMessagesMapRef: PendingMap,
  currentLogin?: string
): PreparedOutgoingMessage {
  const requestId = crypto.randomUUID();

  if (isGetHistoryMessage(message)) {
    const userLogin = message.payload.user.login;
    pendingMessagesMapRef.current?.set(requestId, userLogin);
  }
  if (isAuthMessage(message)) {
    pendingMessagesMapRef.current?.set(
      requestId,
      JSON.stringify(message.payload.user)
    );
  }

  switch (message.type) {
    case 'MSG_SEND': {
      const msg = message.payload.message;
      return {
        eventType: message.type,
        requestId,
        payload: {
          id: requestId,
          from: msg.from || currentLogin,
          to: msg.to,
          text: msg.text,
        },
      };
    }

    case 'MSG_FROM_USER': {
      return {
        eventType: message.type,
        requestId,
        payload: {
          id: requestId,
          user: message.payload.user.login,
          limit: 50,
        },
      };
    }

    case 'MSG_READ':
    case 'MSG_DELETE': {
      return {
        eventType: message.type,
        requestId,
        payload: {
          id: message.payload.message.id,
          message_id: message.payload.message.id,
        },
      };
    }

    case 'MSG_EDIT': {
      return {
        eventType: message.type,
        requestId,
        payload: {
          id: message.payload.message.id,
          message_id: message.payload.message.id,
          text: message.payload.message.text,
        },
      };
    }

    default: {
      return {
        eventType: message.type,
        requestId,
        payload: {
          ...message.payload,
          id: requestId,
        },
      };
    }
  }
}

function normalizeResponse(data: unknown, eventType?: string): MessageResponse {
  if (
    data &&
    typeof data === 'object' &&
    'type' in data &&
    typeof (data as Record<string, unknown>).type === 'string' &&
    'payload' in data &&
    typeof (data as Record<string, unknown>).payload === 'object' &&
    (data as Record<string, unknown>).payload !== null
  ) {
    return data as MessageResponse;
  }

  return {
    id: null,
    type: eventType || 'UNKNOWN',
    payload: (data && typeof data === 'object' ? data : {}) as Record<
      string,
      unknown
    >,
  };
}

function fixServerQuirks(
  data: MessageResponse,
  currentLogin?: string
): MessageResponse {
  if (
    data.type === 'USER_LOGOUT' &&
    (!data.payload || Object.keys(data.payload).length === 0)
  ) {
    return {
      ...data,
      payload: {
        user: { login: currentLogin || '', isLogined: false },
      },
    };
  }
  return data;
}

export function messageManager(
  rawData: unknown,
  pendingMessagesMapRef: PendingMap,
  sendMessage: (message: OutgoingMessage) => void,
  currentUserRef: CurrentUserRef,
  dispatchMessages: (action: MessageAction) => void,
  addUser: (data: User) => void,
  addUsers: (data: User[]) => void,
  clearUsers: () => void,
  addError: (error: ErrorStore) => void,
  eventType?: string
): void {
  const normalized: MessageResponse = normalizeResponse(rawData, eventType);
  const data: MessageResponse = fixServerQuirks(
    normalized,
    currentUserRef.current?.login
  );

  if (!validMessageResponse(data)) {
    return;
  }

  switch (data.type) {
    case 'USER_LOGIN': {
      if (!isUserLoginResponse(data)) {
        return;
      }

      const isLog = data.payload.user.isLogined;
      if (!isLog) {
        return;
      }

      const userDataString = pendingMessagesMapRef.current?.get(data.id);
      if (!userDataString) {
        return;
      }

      const userData: unknown = JSON.parse(userDataString);
      if (!isUser(userData)) {
        return;
      }

      authService.signIn(userData);
      currentUserRef.current = userData;
      pendingMessagesMapRef.current?.delete(data.id);
      navigate();
      getUsersList(sendMessage);
      break;
    }

    case 'USER_ACTIVE':
    case 'USER_INACTIVE': {
      if (!isAuthUsersResponse(data)) {
        return;
      }

      const users = data.payload.users.filter(
        (user) => user.login !== currentUserRef.current?.login
      );

      addUsers(users);
      getUserMessages(sendMessage, users);
      break;
    }

    case 'USER_EXTERNAL_LOGIN':
    case 'USER_EXTERNAL_LOGOUT': {
      if (!isActiveUser(data)) {
        return;
      }

      addUser(data.payload.user);
      break;
    }

    case 'MSG_FROM_USER': {
      if (!isAllMessages(data)) {
        return;
      }

      const login = pendingMessagesMapRef.current?.get(data.id);
      pendingMessagesMapRef.current?.delete(data.id);

      if (!login) {
        return;
      }

      const activeMessages = data.payload.messages.filter(
        (msg) => !msg.status?.isDeleted
      );

      dispatchMessages({
        type: 'SET_ALL_MESSAGES',
        login,
        messages: activeMessages,
      });
      break;
    }

    case 'MSG_SEND': {
      if (!isMessage(data)) {
        return;
      }

      const user = currentUserRef.current?.login;
      if (!user) {
        return;
      }

      if (data.payload.message.from === user) {
        dispatchMessages({
          type: 'ADD_MESSAGE',
          login: data.payload.message.to,
          message: data.payload.message,
        });
      } else {
        dispatchMessages({
          type: 'ADD_MESSAGE',
          login: data.payload.message.from,
          message: data.payload.message,
        });
      }
      break;
    }

    case 'MSG_DELIVER':
    case 'MSG_READ': {
      if (!validUpdateMessage(data)) {
        return;
      }

      dispatchMessages({
        type: 'UPDATE_MESSAGE',
        message: data.payload.message,
      });
      break;
    }

    case 'MSG_EDIT': {
      if (!validEditMessage(data)) {
        return;
      }

      dispatchMessages({
        type: 'EDIT_MESSAGE',
        message: data.payload.message,
      });
      break;
    }

    case 'MSG_DELETE': {
      if (!validUpdateMessage(data)) {
        return;
      }

      dispatchMessages({
        type: 'DELETE_MESSAGE',
        message: data.payload.message,
      });
      break;
    }

    case 'USER_LOGOUT': {
      if (!isUserLogoutResponse(data)) {
        return;
      }

      const isLog = data.payload.user.isLogined;
      if (!isLog) {
        authService.signOut();
        currentUserRef.current = null;
        navigate();
        clearUsers();
      }
      break;
    }

    case 'ERROR': {
      if (!isErrorResponse(data)) {
        return;
      }

      addError({ type: 'LOGIN', message: data.payload.error });
      break;
    }

    default: {
      break;
    }
  }
}
