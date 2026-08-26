"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Popover, Spin, Empty } from "antd";
import { Typography, ReusableButton, Flex } from "@/components/Reusable-Components";
import { BellOutlined } from "@ant-design/icons";
import NotificationItem from "./NotificationItem";
import {
  getNotificationsAction,
  getUnreadCountAction,
  markAllAsReadAction,
  markAsReadAction,
} from "@/apis/services/notifications/actions";
import type { INotification } from "@/apis/services/notifications/interface";
import { toast } from "sonner";
import { useTypedTranslations } from "@/hooks/use-translations";

export default function NotificationsPopover() {
  const t = useTypedTranslations('notifications');
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const result = await getUnreadCountAction();
      if (result?.data) {
        setUnreadCount(result.data.unread_count);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  }, []);

  // Initial load of unread count
  useEffect(() => {
    fetchUnreadCount();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Fetch notifications when popover opens
  const fetchNotifications = useCallback(
    async (page: number = 1, append: boolean = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const result = await getNotificationsAction({
          page,
          per_page: 15,
        });

        if (result?.data?.data) {
          const newNotifications = result.data.data.data;
          
          if (append) {
            setNotifications((prev) => [...prev, ...newNotifications]);
          } else {
            setNotifications(newNotifications);
          }

          setHasMore(result.data.data.next_page !== null);
          setCurrentPage(page);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        toast.error(t("messages.loadError"));
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [t]
  );

  // Load notifications when opening popover
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      fetchNotifications(1, false);
    }
  }, [isOpen, fetchNotifications, notifications.length]);

  // Handle scroll for infinite loading
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isLoadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    // Load more when user scrolls to bottom (with 50px buffer)
    if (scrollHeight - scrollTop - clientHeight < 50) {
      fetchNotifications(currentPage + 1, true);
    }
  }, [currentPage, fetchNotifications, hasMore, isLoadingMore]);

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const result = await markAllAsReadAction();
      
      if (result?.data?.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) => ({
            ...notif,
            read_at: new Date().toISOString(),
          }))
        );
        setUnreadCount(0);
        toast.success(t("messages.markAllSuccess"));
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error(t("messages.markAllError"));
    }
  };

  // Mark single notification as read
  const handleNotificationClick = async (notification: INotification) => {
    if (!notification.read_at) {
      try {
        const result = await markAsReadAction({
          notificationId: notification.id,
        });

        if (result?.data?.success) {
          // Update local state
          setNotifications((prev) =>
            prev.map((notif) =>
              notif.id === notification.id
                ? { ...notif, read_at: new Date().toISOString() }
                : notif
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    }

    // TODO: Navigate to related entity if needed
    // Based on notification.related_entity_type and notification.related_entity_id
  };

  // Popover content
  const popoverContent = (
    <div className="w-[400px] max-w-[90vw]">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Flex classes="items-center justify-between">
          <Typography variant="h4" className="font-semibold">
            {t("title")}
          </Typography>
          {unreadCount > 0 && (
            <ReusableButton
              btnText={t("markAllAsRead")}
              onClick={handleMarkAllAsRead}
              variant="text"
              className="text-xs text-primary"
            />
          )}
        </Flex>
      </div>

      {/* Notifications List */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="max-h-[500px] overflow-y-auto bg-background"
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center">
                  <Typography variant="text" className="text-muted-foreground">
                    {t("empty.title")}
                  </Typography>
                  <Typography
                    variant="p"
                    className="text-sm text-muted-foreground mt-1"
                  >
                    {t("empty.description")}
                  </Typography>
                </div>
              }
            />
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))}
            
            {/* Loading More Indicator */}
            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <Spin size="small" />
              </div>
            )}

            {/* No More Notifications */}
            {!hasMore && notifications.length > 0 && (
              <div className="text-center py-4">
                <Typography
                  variant="text"
                  className="text-xs text-muted-foreground"
                >
                  {t("empty.description")}
                </Typography>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      open={isOpen}
      onOpenChange={setIsOpen}
      placement="bottomRight"
      overlayClassName="notifications-popover"
    >
      <div className="relative cursor-pointer">
        <BellOutlined className="text-xl text-foreground hover:text-primary transition-colors" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-destructive text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
      </div>
    </Popover>
  );
}
