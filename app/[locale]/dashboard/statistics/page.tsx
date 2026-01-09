'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { useStats } from '@/hooks/useStats';
import { Button } from '@/components/ui/button';

import {
	Zap,
	LogOut,
	MessageSquare,
	BarChart3,
	TrendingUp,
	Clock,
	Calendar,
	Loader2,
} from 'lucide-react';

import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
} from 'recharts';

export default function Statistics() {
	const t = useTranslations('statistics');
	const router = useRouter();
	const pathname = usePathname();

	const locale = pathname.split('/')[1];

	const { user, loading, signOut } = useAuth();
	const {
		totalMessages,
		todayMessages,
		totalConversations,
		weeklyData,
		isLoading: statsLoading,
	} = useStats();

	useEffect(() => {
		if (!loading && !user) {
			router.push(`/${locale}/auth`);
		}
	}, [user, loading, router, locale]);

	const handleSignOut = async () => {
		await signOut();
		router.push(`/${locale}`);
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center'>
				<div className='animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full' />
			</div>
		);
	}

	if (!user) return null;

	// Faol kunlar soni
	const activeDays = weeklyData.filter(d => d.messages > 0).length;

	return (
		<div className='min-h-screen bg-background'>
			{/* Mobil sarlavha */}
			<header className='lg:hidden fixed top-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-b border-border p-4 z-50'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<div className='w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center'>
							<Zap className='w-5 h-5 text-primary-foreground' />
						</div>
						<span className='font-display font-bold'>NexusAI</span>
					</div>
					<Button variant='ghost' size='icon' onClick={handleSignOut}>
						<LogOut className='w-5 h-5' />
					</Button>
				</div>
			</header>

			{/* Asosiy kontent */}
			<main className='p-4 pt-20 lg:pt-4 pb-24 lg:pb-4'>
				<div className='max-w-6xl ml-auto'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<h1 className='text-3xl font-display font-bold mb-2'>
							{t('title')}
						</h1>
						<p className='text-muted-foreground mb-8'>{t('subtitle')}</p>

						{/* Statistika umumiy ko‘rinishi */}
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
							<div className='card-glass rounded-xl p-4'>
								<div className='flex items-center gap-3 mb-2'>
									<div className='w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center'>
										<MessageSquare className='w-5 h-5 text-primary' />
									</div>
									<span className='text-sm text-muted-foreground'>
										{t('totalMessages')}
									</span>
								</div>
								{statsLoading ? (
									<Loader2 className='w-6 h-6 animate-spin' />
								) : (
									<>
										<p className='text-3xl font-display font-bold'>
											{totalMessages}
										</p>
										<p className='text-xs text-green-500 flex items-center gap-1 mt-1'>
											<TrendingUp className='w-3 h-3' /> +{todayMessages}{' '}
											{t('todayCount')}
										</p>
									</>
								)}
							</div>

							<div className='card-glass rounded-xl p-4'>
								<div className='flex items-center gap-3 mb-2'>
									<div className='w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center'>
										<Clock className='w-5 h-5 text-accent' />
									</div>
									<span className='text-sm text-muted-foreground'>
										{t('todayMessages')}
									</span>
								</div>
								{statsLoading ? (
									<Loader2 className='w-6 h-6 animate-spin' />
								) : (
									<>
										<p className='text-3xl font-display font-bold'>
											{todayMessages}
										</p>
										<p className='text-xs text-muted-foreground mt-1'>
											{t('today')}
										</p>
									</>
								)}
							</div>

							<div className='card-glass rounded-xl p-4'>
								<div className='flex items-center gap-3 mb-2'>
									<div className='w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center'>
										<BarChart3 className='w-5 h-5 text-green-500' />
									</div>
									<span className='text-sm text-muted-foreground'>
										{t('activeDays')}
									</span>
								</div>
								{statsLoading ? (
									<Loader2 className='w-6 h-6 animate-spin' />
								) : (
									<>
										<p className='text-3xl font-display font-bold'>
											{activeDays}
										</p>
										<p className='text-xs text-muted-foreground mt-1'>
											{t('last7Days')}
										</p>
									</>
								)}
							</div>

							<div className='card-glass rounded-xl p-4'>
								<div className='flex items-center gap-3 mb-2'>
									<div className='w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center'>
										<Calendar className='w-5 h-5 text-purple-500' />
									</div>
									<span className='text-sm text-muted-foreground'>
										{t('conversations')}
									</span>
								</div>
								{statsLoading ? (
									<Loader2 className='w-6 h-6 animate-spin' />
								) : (
									<>
										<p className='text-3xl font-display font-bold'>
											{totalConversations}
										</p>
										<p className='text-xs text-muted-foreground mt-1'>
											{t('totalConversations')}
										</p>
									</>
								)}
							</div>
						</div>

						{/* Grafikalar */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							<div className='card-glass rounded-xl p-6'>
								<h3 className='text-lg font-display font-semibold mb-4'>
									{t('weeklyActivity')}
								</h3>
								<div className='h-64'>
									{statsLoading ? (
										<div className='h-full flex items-center justify-center'>
											<Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
										</div>
									) : (
										<ResponsiveContainer width='100%' height='100%'>
											<BarChart data={weeklyData}>
												<CartesianGrid
													strokeDasharray='3 3'
													stroke='var(--border)'
												/>
												<XAxis
													dataKey='name'
													stroke='var(--muted-foreground)'
												/>
												<YAxis stroke='var(--muted-foreground)' />
												<Tooltip
													contentStyle={{
														backgroundColor: 'var(--card)',
														border: '1px solid var(--border)',
														borderRadius: '8px',
													}}
												/>
												<Bar
													dataKey='messages'
													fill='var(--primary)'
													radius={[4, 4, 0, 0]}
												/>
											</BarChart>
										</ResponsiveContainer>
									)}
								</div>
							</div>

							<div className='card-glass rounded-xl p-6'>
								<h3 className='text-lg font-display font-semibold mb-4'>
									{t('weeklyTrend')}
								</h3>
								<div className='h-64'>
									{statsLoading ? (
										<div className='h-full flex items-center justify-center'>
											<Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
										</div>
									) : (
										<ResponsiveContainer width='100%' height='100%'>
											<AreaChart data={weeklyData}>
												<CartesianGrid
													strokeDasharray='3 3'
													stroke='var(--border)'
												/>
												<XAxis
													dataKey='name'
													stroke='var(--muted-foreground)'
												/>
												<YAxis stroke='var(--muted-foreground)' />
												<Tooltip
													contentStyle={{
														backgroundColor: 'var(--card)',
														border: '1px solid var(--border)',
														borderRadius: '8px',
													}}
												/>
												<Area
													type='monotone'
													dataKey='messages'
													stroke='var(--accent)'
													fill='var(--accent)'
													fillOpacity={0.2}
												/>
											</AreaChart>
										</ResponsiveContainer>
									)}
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</main>
		</div>
	);
}
