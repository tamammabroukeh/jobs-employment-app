"use client";

import { useState, useEffect } from "react";
import { ICoachSession, ICoachMessage } from "@/apis/services/coach/interface";
import {
  createSessionAction,
  getSessionsAction,
  getSessionMessagesAction,
  deleteSessionAction,
  chatAction,
} from "@/apis/services/coach/actions";
import { useCoachTranslations } from "@/hooks/use-translations";
import SessionSidebar from "./SessionSidebar";
import ChatWindow from "./ChatWindow";
import { toast } from "sonner";

const ACTIVE_SESSION_KEY = "coach_active_session_id";

export default function CoachClient() {
  const t = useCoachTranslations();

  // State
  const [sessions, setSessions] = useState<ICoachSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ICoachMessage[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist active session ID to localStorage
  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
    } else {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  }, [activeSessionId]);

  // Load messages when active session changes
  useEffect(() => {
    if (activeSessionId) {
      loadSessionMessages(activeSessionId);
    } else {
      setMessages([]);
    }
  }, [activeSessionId]);
  console.log('activeSessionId', activeSessionId)
  /**
   * Load all sessions
   */
  const loadSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const result = await getSessionsAction();
      if (result?.data) {
        setSessions(result.data);
        
        // Try to restore the last active session from localStorage
        const savedSessionId = localStorage.getItem(ACTIVE_SESSION_KEY);
        
        if (savedSessionId && result.data.some(s => s.id === savedSessionId)) {
          // If saved session exists in the list, restore it
          setActiveSessionId(savedSessionId);
        } else if (result.data.length > 0) {
          // Otherwise, select the most recent session
          setActiveSessionId(result.data[0].id);
        }
      }
    } catch (error) {
      console.error("Load sessions error:", error);
      toast.error(t("toast.loadError"));
    } finally {
      setIsLoadingSessions(false);
    }
  };

  /**
   * Load messages for a specific session
   */
  const loadSessionMessages = async (sessionId: string) => {
    setIsLoadingMessages(true);
    try {
      const result = await getSessionMessagesAction({ sessionId });
      if (result?.data?.success && Array.isArray(result.data.data)) {
        console.log('result.data.data', result.data.data)
        setMessages(result.data.data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Load messages error:", error);
      toast.error(t("toast.loadError"));
      setMessages([]); // Reset to empty array on error
    } finally {
      setIsLoadingMessages(false);
    }
  };

  /**
   * Create a new session
   */
  const handleNewSession = async () => {
    try {
      const result = await createSessionAction({
        title: t("sidebar.newChat"),
      });

      if (result?.data?.success && result.data.data) {
        const newSession = result.data.data;
        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        setMessages([]);
        toast.success(t("toast.sessionCreated"));
      }
    } catch (error) {
      console.error("Create session error:", error);
      toast.error(t("toast.createError"));
    }
  };

  /**
   * Select a session
   */
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  /**
   * Delete a session
   */
  const handleDeleteSession = async (sessionId: string) => {
    try {
      const result = await deleteSessionAction({ sessionId });

      if (result?.data?.success) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));

        // If deleting active session, clear it
        if (activeSessionId === sessionId) {
          setActiveSessionId(null);
          setMessages([]);
        }
        setDeleteDialogOpen(false);
        setSessionToDelete(null);
        setIsDeleting(false);
        toast.success(t("toast.sessionDeleted"));
      }
    } catch (error) {
      console.error("Delete session error:", error);
      toast.error(t("toast.deleteError"));
    }
  };

  /**
   * Send a message to the AI coach
   */
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Validate message length
    if (message.length > 1000) {
      toast.error(t("validation.messageTooLong"));
      return;
    }

    // Add user message to UI immediately (optimistic update)
    const userMessage: ICoachMessage = {
      role: "user",
      message: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => {
      // Safety check: ensure prev is an array
      const currentMessages = Array.isArray(prev) ? prev : [];
      return [...currentMessages, userMessage];
    });
    setIsSending(true);

    try {
      const result = await chatAction({
        message,
        session_id: activeSessionId || undefined,
      });

      if (result?.data?.success) {
        const { response, session_id } = result.data;

        // Add assistant message
        const assistantMessage: ICoachMessage = {
          role: "assistant",
          message: response,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => {
          const currentMessages = Array.isArray(prev) ? prev : [];
          return [...currentMessages, assistantMessage];
        });

        // If this is a new session (first message without active session)
        if (!activeSessionId && session_id) {
          // Create a temporary session object and add to list
          const newSession: ICoachSession = {
            id: session_id,
            title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          setSessions((prev) => [newSession, ...prev]);
          setActiveSessionId(session_id);
        } else if (session_id) {
          // Update existing session's updated_at timestamp
          setSessions((prev) => {
            const updatedSessions = prev.map((s) =>
              s.id === session_id
                ? { ...s, updated_at: new Date().toISOString() }
                : s
            );
            
            // Move the active session to the top
            const activeSession = updatedSessions.find((s) => s.id === session_id);
            const otherSessions = updatedSessions.filter((s) => s.id !== session_id);
            return activeSession ? [activeSession, ...otherSessions] : updatedSessions;
          });
        }
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(t("toast.sendError"));

      // Remove the optimistic user message on error
      setMessages((prev) => {
        const currentMessages = Array.isArray(prev) ? prev : [];
        return currentMessages.filter((m) => m !== userMessage);
      });
    } finally {
      setIsSending(false);
    }
  };
  console.log('messages', messages)
  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <SessionSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        isLoading={isLoadingSessions}
        sessionToDelete={sessionToDelete}
        setSessionToDelete={setSessionToDelete}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
      />

      {/* Chat Window */}
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoadingMessages}
        isSending={isSending}
        hasActiveSession={activeSessionId !== null}
      />
    </div>
  );
}
