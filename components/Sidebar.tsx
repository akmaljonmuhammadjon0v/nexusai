'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	Zap,
	LogOut,
	User,
	MessageSquare,
	BarChart3,
	Settings,
	Crown,
	CreditCard,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const Sidebar = () => {
	const { user, signOut } = useAuth();
	const { profile } = useProfile();
	const { isPro, createCheckout, openCustomerPortal } = useSubscription();
	const t = useTranslations('nav');
	const tPricing = useTranslations('pricing');
	const tPricingFree = useTranslations('pricing.free');
	const tStatistics = useTranslations('statistics');
	const tSettings = useTranslations('settings');
	const tChat = useTranslations('chat');
	const featuresAnalytics = useTranslations('features.analytics');

	const router = useRouter();
	const pathname = usePathname();

	const locale = pathname.split('/')[1] || 'uz';

	const handleSignOut = async () => {
		await signOut();
		router.push(`/${locale}`);
	};

	const displayName =
		profile?.full_name ||
		user?.user_metadata?.full_name ||
		tSettings('profile');

	const isActive = (href: string) => pathname === href;

	return (
		<>
			<aside className='hidden fixed top-0 left-0 h-screen lg:flex flex-col w-64 bg-card border-r border-border p-4 shrink-0'>
				{/* Logo */}
				<div className='flex items-center gap-2 mb-8'>
					<div className='w-10 h-10 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center'>
						<Zap className='w-6 h-6 text-primary-foreground' />
					</div>
					<span className='font-display font-bold text-xl'>NexusAI</span>
				</div>

				{/* Navigation */}
				<nav className='space-y-3 flex flex-col flex-1'>
					<Link href={`/${locale}/dashboard`} passHref>
						<Button
							variant={isActive(`/${locale}/dashboard`) ? 'secondary' : 'ghost'}
							className={`w-full justify-start ${
								isActive(`/${locale}/dashboard`) ? '' : 'text-muted-foreground'
							}`}
						>
							<MessageSquare className='w-4 h-4 mr-2' />
							{tChat('conversations')}
						</Button>
					</Link>

					<Link href={`/${locale}/dashboard/statistics`} passHref>
						<Button
							variant={
								isActive(`/${locale}/dashboard/statistics`)
									? 'secondary'
									: 'ghost'
							}
							className={`w-full justify-start ${
								isActive(`/${locale}/dashboard/statistics`)
									? ''
									: 'text-muted-foreground'
							}`}
						>
							<BarChart3 className='w-4 h-4 mr-2' />
							{featuresAnalytics('title')}
						</Button>
					</Link>

					<Link href={`/${locale}/dashboard/settings`} passHref>
						<Button
							variant={
								isActive(`/${locale}/dashboard/settings`)
									? 'secondary'
									: 'ghost'
							}
							className={`w-full justify-start ${
								isActive(`/${locale}/dashboard/settings`)
									? ''
									: 'text-muted-foreground'
							}`}
						>
							<Settings className='w-4 h-4 mr-2' />
							{tSettings('title')}
						</Button>
					</Link>
				</nav>

				{/* Bottom Section */}
				<div className='space-y-3'>
					<div
						className={`rounded-xl p-3 ${
							isPro
								? 'bg-linear-to-r from-primary/20 to-accent/20 border border-primary/30'
								: 'card-glass'
						}`}
					>
						<div className='flex items-center gap-2 mb-2'>
							<Crown
								className={`w-4 h-4 ${
									isPro ? 'text-primary' : 'text-muted-foreground'
								}`}
							/>
							<span className='text-sm font-medium'>
								{isPro ? 'PRO' : tPricingFree('name')}
							</span>
						</div>

						{isPro ? (
							<Button
								variant='outline'
								size='sm'
								className='w-full text-xs'
								onClick={openCustomerPortal}
							>
								<CreditCard className='w-3 h-3 mr-1' />
								{tPricing('manage')}
							</Button>
						) : (
							<Button
								variant='hero'
								size='sm'
								className='w-full text-xs'
								onClick={createCheckout}
							>
								<Crown className='w-3 h-3 mr-1' />
								{tPricing('upgrade')}
							</Button>
						)}
					</div>

					{/* User info */}
					<div className='card-glass rounded-xl p-4'>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center shrink-0'>
								{profile?.avatar_url ? (
									<Image
										src={profile.avatar_url}
										alt='Avatar'
										width={40}
										height={40}
										className='rounded-full object-cover'
									/>
								) : (
									<User className='w-5 h-5 text-primary-foreground' />
								)}
							</div>

							<div className='flex-1 min-w-0'>
								<p className='text-sm font-medium truncate'>{displayName}</p>
								<p className='text-xs text-muted-foreground truncate'>
									{user?.email}
								</p>
							</div>
						</div>
					</div>

					<Button
						variant='ghost'
						className='w-full justify-start text-muted-foreground hover:text-destructive'
						onClick={handleSignOut}
					>
						<LogOut className='w-4 h-4 mr-2' />
						{t('logout')}
					</Button>
				</div>
			</aside>
			{/* Mobil navigatsiya */}
			<nav className='lg:hidden fixed z-50 bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border p-2'>
				<div className='flex justify-around'>
					{/* Chat */}
					<Button
						size='sm'
						variant={isActive(`/${locale}/dashboard`) ? 'secondary' : 'ghost'}
						className='flex-col h-auto py-2'
						asChild
					>
						<Link href={`/${locale}/dashboard`}>
							<MessageSquare className='w-5 h-5' />
							<span className='text-xs mt-1'>{tStatistics('chat')}</span>
						</Link>
					</Button>

					{/* Statistics */}
					<Button
						size='sm'
						variant={
							isActive(`/${locale}/dashboard/statistics`)
								? 'secondary'
								: 'ghost'
						}
						className='flex-col h-auto py-2'
						asChild
					>
						<Link href={`/${locale}/dashboard/statistics`}>
							<BarChart3 className='w-5 h-5' />
							<span className='text-xs mt-1'>{tStatistics('statistics')}</span>
						</Link>
					</Button>

					{/* Settings */}
					<Button
						size='sm'
						variant={
							isActive(`/${locale}/dashboard/settings`) ? 'secondary' : 'ghost'
						}
						className='flex-col h-auto py-2'
						asChild
					>
						<Link href={`/${locale}/dashboard/settings`}>
							<Settings className='w-5 h-5' />
							<span className='text-xs mt-1'>{tStatistics('settings')}</span>
						</Link>
					</Button>
				</div>
			</nav>
		</>
	);
};

export default Sidebar;
