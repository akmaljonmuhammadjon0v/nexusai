import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useSubscription, FREE_LIMITS } from './useSubscription';

export const useMessageLimits = () => {
	const { user } = useAuth();
	const { isPro } = useSubscription();
	const [todayMessageCount, setTodayMessageCount] = useState(0);
	const [conversationCount, setConversationCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	const fetchCounts = async () => {
		if (!user) {
			setIsLoading(false);
			return;
		}

		try {
			// Get today's message count
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const { count: messageCount } = await supabase
				.from('chat_messages')
				.select('*', { count: 'exact', head: true })
				.eq('user_id', user.id)
				.eq('role', 'user')
				.gte('created_at', today.toISOString());

			// Get conversation count
			const { count: convCount } = await supabase
				.from('conversations')
				.select('*', { count: 'exact', head: true })
				.eq('user_id', user.id);

			setTodayMessageCount(messageCount || 0);
			setConversationCount(convCount || 0);
		} catch (error) {
			console.error('Error fetching limits:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCounts();
	}, [user]);

	const canSendMessage = () => {
		if (isPro) return true;
		return todayMessageCount < FREE_LIMITS.messagesPerDay;
	};

	const canCreateConversation = () => {
		if (isPro) return true;
		return conversationCount < FREE_LIMITS.maxConversations;
	};

	const remainingMessages = isPro
		? Infinity
		: Math.max(0, FREE_LIMITS.messagesPerDay - todayMessageCount);

	const remainingConversations = isPro
		? Infinity
		: Math.max(0, FREE_LIMITS.maxConversations - conversationCount);

	return {
		todayMessageCount,
		conversationCount,
		canSendMessage,
		canCreateConversation,
		remainingMessages,
		remainingConversations,
		isLoading,
		refetch: fetchCounts,
	};
};
