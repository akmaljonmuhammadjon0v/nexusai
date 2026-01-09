import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type SubscriptionTier = 'free' | 'pro';

interface SubscriptionState {
	tier: SubscriptionTier;
	subscribed: boolean;
	subscriptionEnd: string | null;
	isLoading: boolean;
}

// Free tier limits
export const FREE_LIMITS = {
	messagesPerDay: 10,
	maxConversations: 1,
};

export const useSubscription = () => {
	const { user, session } = useAuth();
	const [state, setState] = useState<SubscriptionState>({
		tier: 'free',
		subscribed: false,
		subscriptionEnd: null,
		isLoading: true,
	});

	const checkSubscription = useCallback(async () => {
		if (!session?.access_token) {
			setState(prev => ({ ...prev, isLoading: false }));
			return;
		}

		try {
			const { data, error } = await supabase.functions.invoke(
				'check-subscription',
				{
					headers: {
						Authorization: `Bearer ${session.access_token}`,
					},
				}
			);

			if (error) throw error;

			setState({
				tier: data.tier || 'free',
				subscribed: data.subscribed || false,
				subscriptionEnd: data.subscription_end,
				isLoading: false,
			});
		} catch (error) {
			console.error('Error checking subscription:', error);
			setState(prev => ({ ...prev, isLoading: false }));
		}
	}, [session?.access_token]);

	useEffect(() => {
		if (user) {
			checkSubscription();
		} else {
			setState({
				tier: 'free',
				subscribed: false,
				subscriptionEnd: null,
				isLoading: false,
			});
		}
	}, [user, checkSubscription]);

	// Refresh subscription status periodically
	useEffect(() => {
		if (!user) return;

		const interval = setInterval(checkSubscription, 60000); // Every minute
		return () => clearInterval(interval);
	}, [user, checkSubscription]);

	const createCheckout = async () => {
		if (!session?.access_token) {
			toast.error('Iltimos, avval tizimga kiring');
			return;
		}

		try {
			const { data, error } = await supabase.functions.invoke(
				'create-checkout',
				{
					headers: {
						Authorization: `Bearer ${session.access_token}`,
					},
				}
			);

			if (error) throw error;

			if (data?.url) {
				window.open(data.url, '_blank');
			}
		} catch (error) {
			console.error('Error creating checkout:', error);
			toast.error("To'lov sahifasini ochishda xatolik");
		}
	};

	const openCustomerPortal = async () => {
		if (!session?.access_token) {
			toast.error('Iltimos, avval tizimga kiring');
			return;
		}

		try {
			const { data, error } = await supabase.functions.invoke(
				'customer-portal',
				{
					headers: {
						Authorization: `Bearer ${session.access_token}`,
					},
				}
			);

			if (error) throw error;

			if (data?.url) {
				window.open(data.url, '_blank');
			}
		} catch (error) {
			console.error('Error opening customer portal:', error);
			toast.error('Obuna boshqaruv sahifasini ochishda xatolik');
		}
	};

	const isPro = state.tier === 'pro';

	return {
		...state,
		isPro,
		checkSubscription,
		createCheckout,
		openCustomerPortal,
	};
};
