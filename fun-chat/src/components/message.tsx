import { Context } from '@/app';
import { deleteMessage, sendEditedMessage } from '@/helpers/messages';
import React from '@/react';
import type { ControlsProps, Message, OutgoingMessage } from '@/types';

export function MessageElement({
  message,
  hasControls,
  changeControlsStatus,
}: {
  message: Message;
  hasControls: ControlsProps;
  changeControlsStatus: (status: boolean, id?: string) => void;
}): React.JSX.Element {
  const { currentUserRef, sendMessage } = React.useContext(Context);

  const [isEdit, setIsEdit] = React.useState(false);
  const [editedMessage, setEditedMessage] = React.useState(message.text);
  const [contextMenu, setContextMenu] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  const messageRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  function messageMenu(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    name: string,
    id: string
  ): void {
    e.preventDefault();
    if (currentUserRef.current?.login === name) {
      if (hasControls.id === id) {
        changeControlsStatus(false);
      } else {
        changeControlsStatus(true, id);
      }
    }
    if (messageRef.current) {
      const chatRect = messageRef.current.getBoundingClientRect();
      const clickX = e.clientX - chatRect.left;
      const clickY = e.clientY - chatRect.top;
      setContextMenu({ x: clickX, y: clickY });
    }
  }

  React.useLayoutEffect(() => {
    const message = messageRef.current;
    const menu = menuRef.current;
    if (contextMenu && menu && message) {
      requestAnimationFrame(() => {
        const chatRect = message.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();

        let correctedX = contextMenu.x;
        let correctedY = contextMenu.y;

        if (contextMenu.x + menuRect.width > chatRect.width) {
          correctedX = chatRect.width - menuRect.width;
        }
        if (contextMenu.y + menuRect.height > chatRect.height) {
          correctedY = chatRect.height - menuRect.height;
        }

        if (correctedX !== contextMenu.x || correctedY !== contextMenu.y) {
          setContextMenu((prev) =>
            prev ? { ...prev, x: correctedX, y: correctedY } : null
          );
        }
      });
    }
  }, [contextMenu]);

  function confirmEdit(
    sendMessage: (message: OutgoingMessage) => void,
    id: string,
    editedMessage: string
  ): void {
    sendEditedMessage(sendMessage, id, editedMessage);
    setIsEdit(false);
  }

  function editMessage(): void {
    setIsEdit(true);
    changeControlsStatus(false);
    setEditedMessage(message.text);
  }

  function cancelEdit(): void {
    setIsEdit(false);
    setEditedMessage('');
  }

  function deleteEvent(id: string): void {
    changeControlsStatus(false);
    deleteMessage(sendMessage, id);
  }

  return (
    <div
      key={message.id}
      className={`flex overflow-hidden ${
        message.from === currentUserRef.current?.login
          ? 'justify-end'
          : 'justify-start'
      } mb-4 relative`}
    >
      <div
        className={`relative max-w-xs rounded-lg px-3 pt-3 pb-6 shadow-md ${
          message.from === currentUserRef.current?.login
            ? 'bg-blue-500 text-white cursor-pointer'
            : 'bg-gray-200 text-black'
        }`}
        ref={messageRef}
        onContextMenu={(e) => messageMenu(e, message.from, message.id)}
      >
        <div className="flex items-center justify-between mb-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {message.from === currentUserRef.current?.login
                ? 'You'
                : message.from}
            </span>
            <div className="flex gap-2 items-center">
              <span
                className={`text-xs ${
                  message.from === currentUserRef.current?.login
                    ? 'text-white/70'
                    : 'text-gray-400'
                }`}
              >
                {new Date(message.datetime).toLocaleTimeString()}
              </span>
            </div>
            {message.from === currentUserRef.current?.login && (
              <span
                className={`text-xs font-medium ${
                  message.status.isDelivered
                    ? 'text-green-300'
                    : 'text-yellow-200'
                }`}
              >
                {message.status.isDelivered ? 'Delivered' : 'Sending...'}
              </span>
            )}
          </div>
        </div>
        <div>
          {isEdit ? (
            <div className="relative w-full">
              <label>
                <input
                  className="w-full pr-24 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                ></input>
              </label>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <button
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  onClick={() =>
                    confirmEdit(sendMessage, message.id, editedMessage)
                  }
                >
                  Confirm
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="break-words pr-8">{message.text}</p>
          )}
        </div>
        <div className="flex justify-end mt-2 text-xs">
          {message.status.isEdited ? (
            <span
              className={
                message.from === currentUserRef.current?.login
                  ? 'text-white/70'
                  : 'text-gray-400'
              }
            >
              Edited
            </span>
          ) : (
            message.from === currentUserRef.current?.login && (
              <span className="text-white/70">
                {message.status.isReaded ? 'Read' : 'Unread'}
              </span>
            )
          )}
        </div>
        {!isEdit && hasControls.id === message.id && (
          <div
            className="flex gap-2 bg-white/70 px-3 py-2 rounded-2xl"
            style={{
              position: 'absolute',
              top: `${contextMenu?.y}px`,
              left: `${contextMenu?.x}px`,
            }}
            ref={menuRef}
          >
            <button
              className="text-green-400 bg-blue-400/70 px-2 py-1 rounded hover:bg-blue-500/70 duration-300 ease-in-out cursor-pointer"
              onClick={editMessage}
              style={{
                textShadow:
                  '1px 1px 0 #666666, -1px 1px 0 #666666, 1px -1px 0 #666666, -1px -1px 0 #666666',
              }}
            >
              Edit
            </button>
            <button
              className="text-red-400 bg-blue-400/70 px-2 py-1 rounded hover:bg-blue-500/70 duration-300 ease-in-out cursor-pointer"
              onClick={() => deleteEvent(message.id)}
              style={{
                textShadow:
                  '1px 1px 0 #666666, -1px 1px 0 #666666, 1px -1px 0 #666666, -1px -1px 0 #666666',
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
