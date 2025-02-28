import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { replyToMessage } from '../../../../interactions/conversationInteractions';
import { MessageRenderingProps } from '../../../../models/messageType';
import { toggleSelectedMessageId } from '../../../../state/ducks/conversations';
import { updateReactListModal } from '../../../../state/ducks/modalDialog';
import {
  getMessageContentWithStatusesSelectorProps,
  isMessageSelectionMode,
} from '../../../../state/selectors/conversations';
import { Reactions } from '../../../../util/reactions';
import { MessageAvatar } from './MessageAvatar';
import { MessageAuthorText } from './MessageAuthorText';
import { MessageContent } from './MessageContent';
import { MessageContextMenu } from './MessageContextMenu';
import { MessageReactions, StyledMessageReactions } from './MessageReactions';
import { MessageStatus } from './MessageStatus';

export type MessageContentWithStatusSelectorProps = Pick<
  MessageRenderingProps,
  'conversationType' | 'direction' | 'isDeleted'
>;

type Props = {
  messageId: string;
  ctxMenuID: string;
  isDetailView?: boolean;
  dataTestId?: string;
  enableReactions: boolean;
};

const StyledMessageContentContainer = styled.div<{ direction: 'left' | 'right' }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: ${props => (props.direction === 'left' ? 'flex-start' : 'flex-end')};
  width: 100%;

  ${StyledMessageReactions} {
    margin-right: var(--margins-md);
  }
`;

const StyledMessageWithAuthor = styled.div<{ isIncoming: boolean }>`
  max-width: ${props => (props.isIncoming ? '100%' : 'calc(100% - 17px)')};
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const MessageContentWithStatuses = (props: Props) => {
  const contentProps = useSelector(state =>
    getMessageContentWithStatusesSelectorProps(state as any, props.messageId)
  );
  const dispatch = useDispatch();

  const multiSelectMode = useSelector(isMessageSelectionMode);

  const onClickOnMessageOuterContainer = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (multiSelectMode && props?.messageId) {
        event.preventDefault();
        event.stopPropagation();
        dispatch(toggleSelectedMessageId(props?.messageId));
      }
    },
    [dispatch, props?.messageId, multiSelectMode]
  );

  const onDoubleClickReplyToMessage = (e: React.MouseEvent<HTMLDivElement>) => {
    const currentSelection = window.getSelection();
    const currentSelectionString = currentSelection?.toString() || undefined;

    if ((e.target as any).localName !== 'em-emoji-picker') {
      if (
        !currentSelectionString ||
        currentSelectionString.length === 0 ||
        !/\s/.test(currentSelectionString)
      ) {
        // if multiple word are selected, consider that this double click was actually NOT used to reply to
        // but to select
        void replyToMessage(messageId);
        currentSelection?.empty();
        e.preventDefault();
      }
    }
  };

  const { messageId, ctxMenuID, isDetailView, dataTestId, enableReactions } = props;
  const [popupReaction, setPopupReaction] = useState('');

  if (!contentProps) {
    return null;
  }
  const { conversationType, direction, isDeleted } = contentProps;
  const isIncoming = direction === 'incoming';

  const isPrivate = conversationType === 'private';
  const hideAvatar = isPrivate || direction === 'outgoing';

  const handleMessageReaction = async (emoji: string) => {
    await Reactions.sendMessageReaction(messageId, emoji);
  };

  const handlePopupClick = () => {
    dispatch(updateReactListModal({ reaction: popupReaction, messageId }));
  };

  return (
    <StyledMessageContentContainer
      direction={isIncoming ? 'left' : 'right'}
      onMouseLeave={() => {
        setPopupReaction('');
      }}
    >
      <div
        className={classNames('module-message', `module-message--${direction}`)}
        role="button"
        onClick={onClickOnMessageOuterContainer}
        onDoubleClickCapture={onDoubleClickReplyToMessage}
        data-testid={dataTestId}
      >
        <MessageAvatar messageId={messageId} hideAvatar={hideAvatar} isPrivate={isPrivate} />
        <MessageStatus
          dataTestId="msg-status-incoming"
          messageId={messageId}
          isCorrectSide={isIncoming}
        />
        <StyledMessageWithAuthor isIncoming={isIncoming}>
          <MessageAuthorText messageId={messageId} />
          <MessageContent messageId={messageId} isDetailView={isDetailView} />
        </StyledMessageWithAuthor>
        <MessageStatus
          dataTestId="msg-status-outgoing"
          messageId={messageId}
          isCorrectSide={!isIncoming}
        />
        {!isDeleted && (
          <MessageContextMenu
            messageId={messageId}
            contextMenuId={ctxMenuID}
            enableReactions={enableReactions}
          />
        )}
      </div>
      {enableReactions && (
        <MessageReactions
          messageId={messageId}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={handleMessageReaction}
          popupReaction={popupReaction}
          setPopupReaction={setPopupReaction}
          onPopupClick={handlePopupClick}
          noAvatar={hideAvatar}
        />
      )}
    </StyledMessageContentContainer>
  );
};
