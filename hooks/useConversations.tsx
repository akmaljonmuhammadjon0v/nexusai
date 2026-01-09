import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Conversation {
	id: string;
	user_id: string;
	title: string;
	created_at: string;
	updated_at: string;
}

export const useConversations = () => {
	const { user } = useAuth();
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [currentConversation, setCurrentConversation] =
		useState<Conversation | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchConversations = async () => {
		if (!user) {
			setIsLoading(false);
			return;
		}

		try {
			const { data, error } = await supabase
				.from('conversations')
				.select('*')
				.eq('user_id', user.id)
				.order('updated_at', { ascending: false });

			if (error) throw error;

			setConversations(data || []);

			// Set current conversation to the most recent one
			if (data && data.length > 0 && !currentConversation) {
				setCurrentConversation(data[0]);
			}
		} catch (error) {
			console.error('Error fetching conversations:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchConversations();
	}, [user]);

	const createConversation = async (title: string = 'Yangi suhbat') => {
		if (!user) return null;

		try {
			const { data, error } = await supabase
				.from('conversations')
				.insert({ user_id: user.id, title })
				.select()
				.single();

			if (error) throw error;

			setConversations(prev => [data, ...prev]);
			setCurrentConversation(data);
			return data;
		} catch (error) {
			console.error('Error creating conversation:', error);
			return null;
		}
	};

	const deleteConversation = async (conversationId: string) => {
		try {
			const { error } = await supabase
				.from('conversations')
				.delete()
				.eq('id', conversationId);

			if (error) throw error;

			setConversations(prev => prev.filter(c => c.id !== conversationId));

			if (currentConversation?.id === conversationId) {
				const remaining = conversations.filter(c => c.id !== conversationId);
				setCurrentConversation(remaining[0] || null);
			}
		} catch (error) {
			console.error('Error deleting conversation:', error);
		}
	};

	const updateConversationTitle = async (
		conversationId: string,
		title: string
	) => {
		try {
			const { error } = await supabase
				.from('conversations')
				.update({ title })
				.eq('id', conversationId);

			if (error) throw error;

			setConversations(prev =>
				prev.map(c => (c.id === conversationId ? { ...c, title } : c))
			);

			if (currentConversation?.id === conversationId) {
				setCurrentConversation(prev => (prev ? { ...prev, title } : null));
			}
		} catch (error) {
			console.error('Error updating conversation:', error);
		}
	};

	const clearAllConversations = async () => {
		if (!user) return;

		try {
			const { error } = await supabase
				.from('conversations')
				.delete()
				.eq('user_id', user.id);

			if (error) throw error;

			setConversations([]);
			setCurrentConversation(null);
		} catch (error) {
			console.error('Error clearing conversations:', error);
		}
	};

	return {
		conversations,
		currentConversation,
		setCurrentConversation,
		isLoading,
		createConversation,
		deleteConversation,
		updateConversationTitle,
		clearAllConversations,
		refetch: fetchConversations,
	};
};
