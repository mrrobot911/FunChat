export type WebSocketHook = {
  connect: () => void;
  sendMessage: (message: OutgoingMessage) => void;
  disconnect: () => void;
  isConnected: boolean;
  currentUserRef: { current: UserData | null };
  userlist: User[];
  messages: MessageState;
  error: ErrorStore[];
};

export type SocketMessage = {
  type: string;
  payload: Record<string, unknown> | null;
};

export type AuthMessage = SocketMessage & {
  type: 'USER_LOGIN';
  payload: {
    user: {
      password: string;
      login: string;
    };
  };
};

export type GetHistoryMessage = SocketMessage & {
  type: 'MSG_FROM_USER';
  payload: { user: { login: string } };
};

export type LoginResponse = ResponseData & { id: string; type: 'USER_LOGIN' };

export type LogoutResponse = ResponseData & { id: string; type: 'USER_LOGOUT' };

export type UserActivate = ResponseData & {
  id: null;
  type: 'USER_EXTERNAL_LOGIN';
};

export type UserInactive = ResponseData & {
  id: null;
  type: 'USER_EXTERNAL_LOGOUT';
};

export type User = {
  login: string;
  isLogined: boolean;
};

export type ResponseData = {
  id: string | null;
  type:
    | 'USER_LOGIN'
    | 'USER_LOGOUT'
    | 'USER_EXTERNAL_LOGIN'
    | 'USER_EXTERNAL_LOGOUT';
  payload: {
    user: User;
  };
};

export type ErrorResponse = {
  id: string;
  type: 'ERROR';
  payload: {
    error: string;
  };
};

export type UserData = {
  login: string;
  password: string;
};

export type AllUsers = {
  id: string;
  type: 'USER_ACTIVE' | 'USER_INACTIVE';
  payload: {
    users: User[];
  };
};

export type MessageResponse = {
  id: string | null;
  type: string;
  payload: Record<string, unknown>;
};

export type AllMessages = MessageResponse & {
  id: string;
  type: 'MSG_FROM_USER';
  payload: {
    messages: Message[];
  };
};

export type SingleMessage = MessageResponse & {
  type: 'MSG_SEND';
  payload: {
    message: Message;
  };
};

export type MessageState = Record<string, Message[]>;

export type Message = {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
    isDeleted?: boolean;
  };
};

type EditMessage = Pick<Message, 'id' | 'text'> & {
  status: {
    isEdited: boolean;
  };
};

export type UpdateMessage = MessageResponse & {
  payload: {
    message: DeliveryResponse;
  };
};

export type EditMessageResponse = MessageResponse & {
  payload: {
    message: DeliveryResponse & {
      text: string;
      status: {
        isEdited: boolean;
      };
    };
  };
};

type DeliveryResponse = {
  id: string;
  status: Record<string, boolean>;
};

export type MessageAction =
  | { type: 'SET_ALL_MESSAGES'; login: string; messages: Message[] }
  | { type: 'ADD_MESSAGE'; login: string; message: Message }
  | { type: 'UPDATE_MESSAGE'; message: DeliveryResponse }
  | { type: 'DELETE_MESSAGE'; message: DeliveryResponse }
  | { type: 'EDIT_MESSAGE'; message: EditMessage };

export type ErrorStore = {
  type: string;
  message: string;
};

export type ControlsProps = {
  id: string;
  status: boolean;
};

export type OutgoingSendMessage = {
  type: 'MSG_SEND';
  payload: {
    message: Pick<Message, 'to' | 'text'> & { from?: string };
  };
};

export type OutgoingEditMessage = {
  type: 'MSG_EDIT';
  payload: {
    message: Pick<Message, 'id' | 'text'>;
  };
};

export type OutgoingDeleteMessage = {
  type: 'MSG_DELETE';
  payload: {
    message: Pick<Message, 'id'>;
  };
};

export type OutgoingReadMessage = {
  type: 'MSG_READ';
  payload: {
    message: Pick<Message, 'id'>;
  };
};

export type OutgoingLogoutMessage = {
  type: 'USER_LOGOUT';
  payload: {
    user: {
      password: string;
      login: string;
    };
  };
};

export type OutgoingUsersListMessage = {
  type: 'USER_ACTIVE' | 'USER_INACTIVE';
  payload: null;
};

export type OutgoingMessage =
  | AuthMessage
  | GetHistoryMessage
  | OutgoingSendMessage
  | OutgoingEditMessage
  | OutgoingDeleteMessage
  | OutgoingReadMessage
  | OutgoingLogoutMessage
  | OutgoingUsersListMessage;

export type PreparedOutgoingMessage = {
  eventType: string;
  payload: Record<string, unknown>;
  requestId: string;
};
