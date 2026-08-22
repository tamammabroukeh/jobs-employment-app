"use client";

import { useState, useEffect } from 'react';
import { Alert, Card } from 'antd';
import { GoogleOutlined, DisconnectOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ReusableButton, Typography, Flex } from '@/components/Reusable-Components';
import { useMeetingsTranslations } from '@/hooks/use-translations';
import {
  getGoogleStatusAction,
  getGoogleConnectUrlAction,
  disconnectGoogleAction,
} from '@/apis/services/google/actions';
import { toast } from 'sonner';

export default function GoogleIntegrationCard() {
  const t = useMeetingsTranslations();
  const [isConnected, setIsConnected] = useState(false);
  const [email, setEmail] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const result = await getGoogleStatusAction();
      if (result?.data?.success) {
        setIsConnected(result.data.data.connected);
        setEmail(result.data.data.email);
      }
    } catch (error) {
      console.error('Error fetching Google status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const result = await getGoogleConnectUrlAction();
      if (result?.data?.success && result.data.data.auth_url) {
        // Open OAuth popup
        const popup = window.open(
          result.data.data.auth_url,
          'Google OAuth',
          'width=500,height=600,left=100,top=100'
        );

        // Poll for completion
        const interval = setInterval(async () => {
          try {
            // Check if popup is closed
            if (popup?.closed) {
              clearInterval(interval);
              setIsConnecting(false);
              // Check status after popup closes
              await fetchStatus();
              return;
            }

            // Check connection status
            const statusResult = await getGoogleStatusAction();
            if (statusResult?.data?.success && statusResult.data.data.connected) {
              clearInterval(interval);
              popup?.close();
              setIsConnected(true);
              setEmail(statusResult.data.data.email);
              toast.success(t('google.connectSuccess'));
              setIsConnecting(false);
            }
          } catch (error) {
            // Ignore errors during polling
          }
        }, 1000);

        // Stop polling after 5 minutes
        setTimeout(() => {
          clearInterval(interval);
          setIsConnecting(false);
        }, 5 * 60 * 1000);
      }
    } catch (error) {
      console.error('Error connecting Google:', error);
      toast.error(t('google.connectError'));
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const result = await disconnectGoogleAction();
      if (result?.data?.success) {
        setIsConnected(false);
        setEmail(undefined);
        toast.success(t('google.disconnectSuccess'));
      }
    } catch (error) {
      console.error('Error disconnecting Google:', error);
      toast.error(t('google.disconnectError'));
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (isLoading) {
    return (
      <Card loading={true}>
        <div className="h-32" />
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <Flex classes="flex-col gap-4">
        <Flex classes="items-center gap-3">
          <GoogleOutlined className="text-2xl text-primary" />
          <div>
            <Typography variant="h3" className="text-lg font-semibold">
              {t('google.title')}
            </Typography>
            <Typography variant="text" className="text-muted-foreground text-sm">
              {t('google.description')}
            </Typography>
          </div>
        </Flex>

        {isConnected ? (
          <>
            <Alert
              type="success"
              icon={<CheckCircleOutlined />}
              message={t('google.connected')}
              description={
                <Flex classes="flex-col gap-1">
                  <Typography variant="text" className="text-sm">
                    {email}
                  </Typography>
                  <Typography variant="text" className="text-xs text-muted-foreground">
                    {t('google.connectedDescription')}
                  </Typography>
                </Flex>
              }
              showIcon
            />

            <ReusableButton
              icon={<DisconnectOutlined />}
              btnText={t('google.disconnect')}
              onClick={handleDisconnect}
              variant="default"
              danger
              isLoading={isDisconnecting}
              disabled={isDisconnecting}
            />
          </>
        ) : (
          <>
            <Alert
              type="info"
              message={t('google.notConnected')}
              description={t('google.notConnectedDescription')}
              showIcon
            />

            <ReusableButton
              icon={<GoogleOutlined />}
              btnText={t('google.connect')}
              onClick={handleConnect}
              variant="primary"
              isLoading={isConnecting}
              disabled={isConnecting}
            />
          </>
        )}
      </Flex>
    </Card>
  );
}
