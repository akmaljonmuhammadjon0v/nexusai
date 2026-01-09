import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Stats {
	totalMessages: number;
	todayMessages: number;
	totalConversations: number;
	weeklyData: { name: string; messages: number }[];
	isLoading: boolean;
}

export const useStats = () => {
	const { user } = useAuth();
	const [stats, setStats] = useState<Stats>({
		totalMessages: 0,
		todayMessages: 0,
		totalConversations: 0,
		weeklyData: [],
		isLoading: true,
	});

	useEffect(() => {
		const fetchStats = async () => {
			if (!user) {
				setStats(prev => ({ ...prev, isLoading: false }));
				return;
			}

			try {
				// Get total messages
				const { count: totalMessages } = await supabase
					.from('chat_messages')
					.select('*', { count: 'exact', head: true })
					.eq('user_id', user.id);

				// Get today's messages
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				const { count: todayMessages } = await supabase
					.from('chat_messages')
					.select('*', { count: 'exact', head: true })
					.eq('user_id', user.id)
					.gte('created_at', today.toISOString());

				// Get total conversations
				const { count: totalConversations } = await supabase
					.from('conversations')
					.select('*', { count: 'exact', head: true })
					.eq('user_id', user.id);

				// Get weekly data
				const weekDays = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
				const weeklyData: { name: string; messages: number }[] = [];

				for (let i = 6; i >= 0; i--) {
					const date = new Date();
					date.setDate(date.getDate() - i);
					date.setHours(0, 0, 0, 0);

					const nextDate = new Date(date);
					nextDate.setDate(nextDate.getDate() + 1);

					const { count } = await supabase
						.from('chat_messages')
						.select('*', { count: 'exact', head: true })
						.eq('user_id', user.id)
						.gte('created_at', date.toISOString())
						.lt('created_at', nextDate.toISOString());

					weeklyData.push({
						name: weekDays[date.getDay()],
						messages: count || 0,
					});
				}

				setStats({
					totalMessages: totalMessages || 0,
					todayMessages: todayMessages || 0,
					totalConversations: totalConversations || 0,
					weeklyData,
					isLoading: false,
				});
			} catch (error) {
				console.error('Error fetching stats:', error);
				setStats(prev => ({ ...prev, isLoading: false }));
			}
		};

		fetchStats();
	}, [user]);

	return stats;
};
