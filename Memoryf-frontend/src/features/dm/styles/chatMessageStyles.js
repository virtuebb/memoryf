export const getChatMessageStyles = (theme) => ({
  messageContainer: {
    display: 'flex',
    marginBottom: '15px',
    alignItems: 'flex-end',
  },
  messageContainerOwn: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '10px 15px',
    borderRadius: '18px',
    wordWrap: 'break-word',
    fontSize: '14px',
    backgroundColor: '#E0E0E0',
    color: '#333333',
  },
  messageBubbleOwn: {
    backgroundColor: theme.primary,
    color: '#333333',
    borderBottomRightRadius: '4px',
  },
  timestamp: {
    fontSize: '12px',
    color: '#999999',
    marginTop: '5px',
    marginLeft: '10px',
  },
  timestampOwn: {
    marginLeft: 'auto',
    marginRight: '10px',
  },
});
