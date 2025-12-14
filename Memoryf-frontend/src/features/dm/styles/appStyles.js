export const getAppStyles = (theme) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: theme.primary,
  transition: 'background-color 0.3s ease',
});

export const getMobileFrameStyle = () => ({
  width: '900px',
  height: '700px',
  borderRadius: '25px',
  overflow: 'hidden',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
});
