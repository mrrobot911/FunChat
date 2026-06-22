import type { Message, OutgoingMessage, User } from '@/types';

type FilteredResult = {
  filteredMessages: Record<string, Record<string, Message[]>>;
  unreadCounts: Record<string, number>;
};

type Params = {
  messages: Record<string, Message[]>;
  autoReadEnabled: boolean;
  talker: User | null;
  currentUserLogin?: string;
  sendMessage: (payload: OutgoingMessage) => void;
  activateChatEvent: () => void;
};

export function filterMessages({
  messages,
  autoReadEnabled,
  talker,
  currentUserLogin,
  sendMessage,
  activateChatEvent,
}: Params): FilteredResult {
  const filteredMessages: Record<string, Record<string, Message[]>> = {};
  const unreadCounts: Record<string, number> = {};
  for (const user in messages) {
    const unread: Message[] = [];
    const read: Message[] = [];

    for (const message of messages[user]) {
      if (message.status.isReaded || message.from === currentUserLogin) {
        read.push(message);
      } else {
        if (autoReadEnabled && message.from === talker?.login) {
          message.status.isReaded = true;
          sendMessage({
            type: 'MSG_READ',
            payload: {
              message: {
                id: message.id,
              },
            },
          });
          read.push(message);
        } else {
          unread.push(message);
        }
      }
    }
    if (
      unread.length === 0 &&
      !autoReadEnabled &&
      talker &&
      talker.login === user
    ) {
      activateChatEvent();
    }

    filteredMessages[user] = { unread, read };
    unreadCounts[user] = unread.length;
  }
  return { filteredMessages, unreadCounts };
}
