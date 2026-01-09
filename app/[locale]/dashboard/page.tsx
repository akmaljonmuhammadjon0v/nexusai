'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useStats } from '@/hooks/useStats';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import ChatBot from '@/components/ChatBot';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

const Dashboard = () => {
	const { user, loading } = useAuth();
	const {
		totalMessages,
		todayMessages,
		totalConversations,
		isLoading: statsLoading,
	} = useStats();
	const { profile } = useProfile();
	const { checkSubscription } = useSubscription();

	const router = useRouter();
	const searchParams = useSearchParams();
	const t = useTranslations('dashboard');
	const tCommon = useTranslations('common');
	const tAuth = useTranslations('auth');
	const tChat = useTranslations('chat');
	const tHero = useTranslations('hero');

	useEffect(() => {
		if (!loading && !user) {
			router.push('/auth');
		}
	}, [user, loading, router]);

	useEffect(() => {
		const success = searchParams.get('success');
		const canceled = searchParams.get('canceled');

		if (success === 'true') {
			toast.success(tCommon('success'));
			checkSubscription();
			router.replace('/dashboard');
		}

		if (canceled === 'true') {
			toast.info(tCommon('cancel'));
			router.replace('/dashboard');
		}
	}, [searchParams, checkSubscription, t, router]);

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full' />
			</div>
		);
	}

	if (!user) return null;

	const displayName =
		profile?.full_name ||
		user.user_metadata?.full_name ||
		t('settings.profile');

	return (
		<div className='flex-1 overflow-y-auto p-4 max-sm:pb-8 lg:p-6'>
			<div className='max-sm:min-h-screen sm:h-auto bg-background'>
				<div className='max-w-6xl ml-auto'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<h1 className='text-2xl lg:text-3xl font-display font-bold mb-1'>
							{tAuth('welcomeBack')}, {displayName}!
						</h1>
						<p className='text-muted-foreground mb-6'>{tChat('welcome')}</p>

						{/* Stats */}
						<div className='grid grid-cols-3 gap-2 sm:gap-4 mb-6'>
							<div className='card-glass rounded-xl p-3 sm:p-4'>
								<p className='text-xs sm:text-sm text-muted-foreground'>
									{tHero('stats.conversations')}
								</p>
								{statsLoading ? (
									<Loader2 className='w-4 h-4 sm:w-5 sm:h-5 animate-spin mt-1' />
								) : (
									<p className='text-lg sm:text-2xl font-display font-bold'>
										{todayMessages}
									</p>
								)}
							</div>
							<div className='card-glass rounded-xl p-3 sm:p-4'>
								<p className='text-xs sm:text-sm text-muted-foreground'>
									{tChat('conversations')}
								</p>
								{statsLoading ? (
									<Loader2 className='w-4 h-4 sm:w-5 sm:h-5 animate-spin mt-1' />
								) : (
									<p className='text-lg sm:text-2xl font-display font-bold'>
										{totalConversations}
									</p>
								)}
							</div>
							<div className='card-glass rounded-xl p-3 sm:p-4'>
								<p className='text-xs sm:text-sm text-muted-foreground'>
									{tHero('stats.users')}
								</p>
								{statsLoading ? (
									<Loader2 className='w-4 h-4 sm:w-5 sm:h-5 animate-spin mt-1' />
								) : (
									<p className='text-lg sm:text-2xl font-display font-bold gradient-text'>
										{totalMessages}
									</p>
								)}
							</div>
						</div>

						{/* Chat */}
						<ChatBot />
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
