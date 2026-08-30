"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import NewSessionDialog from "./NewSessionDialog";
import { toast } from "sonner";

export default function CoachClient() {
  const t = useCoachTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

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
  const [isNewSessionDialogOpen, setIsNewSessionDialogOpen] = useState(false);

  // Get session ID from URL params
  useEffect(() => {
    const sessionId = searchParams.get("session");
    if (sessionId) {
      setActiveSessionId(sessionId);
    }
  }, [searchParams]);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load messages when active session changes
  useEffect(() => {
    if (activeSessionId) {
      loadSessionMessages(activeSessionId);
    } else {
      setMessages([]);
    }
  }, [activeSessionId]);
  /**
   * Load all sessions
   */
  const loadSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const result = await getSessionsAction();
      if (result?.data) {
        setSessions(result.data);
        
        // Get session ID from URL params
        const urlSessionId = searchParams.get("session");
        
        if (urlSessionId && result.data.some(s => s.id === urlSessionId)) {
          // If URL session exists in the list, use it
          setActiveSessionId(urlSessionId);
        } else if (!urlSessionId && result.data.length > 0) {
          // If no URL session but sessions exist, select the most recent
          const mostRecentSession = result.data[0];
          setActiveSessionId(mostRecentSession.id);
          // Update URL with the selected session
          router.push(`/resume-coach?session=${mostRecentSession.id}`, { scroll: false });
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
   * Open new session dialog
   */
  const handleOpenNewSessionDialog = () => {
    setIsNewSessionDialogOpen(true);
  };

  /**
   * Create a new session
   */
  const handleCreateNewSession = async (title?: string) => {
    try {
      const result = await createSessionAction({
        title: title || t("sidebar.newChat"),
      });

      if (result?.data?.success && result.data.data) {
        const newSession = result.data.data;
        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        setMessages([]);
        
        // Update URL with new session
        router.push(`/resume-coach?session=${newSession.id}`, { scroll: false });
        
        toast.success(t("toast.sessionCreated"));
      }
    } catch (error) {
      console.error("Create session error:", error);
      toast.error(t("toast.createError"));
      throw error; // Re-throw to handle in dialog
    }
  };

  /**
   * Select a session
   */
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    // Update URL with selected session
    router.push(`/resume-coach?session=${sessionId}`, { scroll: false });
  };

  /**
   * Delete a session
   */
  const handleDeleteSession = async (sessionId: string) => {
    try {
      const result = await deleteSessionAction({ sessionId });

      if (result?.data?.success) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));

        // If deleting active session, clear it and URL params
        if (activeSessionId === sessionId) {
          setActiveSessionId(null);
          setMessages([]);
          router.push('/resume-coach', { scroll: false });
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
          
          // Update URL with new session
          router.push(`/resume-coach?session=${session_id}`, { scroll: false });
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

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <SessionSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleOpenNewSessionDialog}
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

      {/* New Session Dialog */}
      <NewSessionDialog
        isOpen={isNewSessionDialogOpen}
        setIsOpen={setIsNewSessionDialogOpen}
        onCreateSession={handleCreateNewSession}
      />
    </div>
  );
}
