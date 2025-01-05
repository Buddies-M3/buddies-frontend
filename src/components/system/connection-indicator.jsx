import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';

const ConnectionIndicator = ({ siteId }) => {
  const [isConnected, setIsConnected] = useState(null);
  const [connectionId, setConnectionId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch the connection status from the API
    const checkConnectionStatus = async () => {
      const formData = new FormData();
      formData.append("siteid", siteId);
      try {
        const response = await fetch('/projects/api/is_connected', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data) {
          if (data.status === 'connected') {
            setIsConnected(true);
            setConnectionId(data.data.id);
          } else {
            setIsConnected(false);
            setConnectionId(null);
          }
        }
      } catch (error) {
        console.error('Error fetching connection status:', error);
      }
    };

    checkConnectionStatus();
  }, [siteId]);

  const handleDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect?')) {
      const formData = new FormData();
      formData.append("connectionid", connectionId);
      try {
        const response = await fetch('/projects/api/unconnect', {
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          const data = await response.json();
          if (data.status == 'deleted'){
            setIsConnected(false);
          }
        } else {
          console.error('Error disconnecting:', response.statusText);
        }
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    }
  };

  const handleConnect = () => {
    router.push(`/projects/connect/${siteId}`);
  };

  const indicatorStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px',
  };

  const iconStyles = {
    color: isConnected === null ? 'gray' : isConnected ? 'green' : 'red',
    fontSize: '30px',
    cursor: 'pointer',
  };

  return (
    <div style={indicatorStyles}>
      {isConnected === null ? (
        <div style={{ ...iconStyles, color: 'gray', fontSize: '14px'}}>Loading...</div>
      ) : isConnected ? (
        <LinkIcon style={iconStyles} titleAccess="Connected" onClick={handleDisconnect} />
      ) : (
        <LinkOffIcon style={iconStyles} titleAccess="Unconnected" onClick={handleConnect} />
      )}
    </div>
  );
};

export default ConnectionIndicator;