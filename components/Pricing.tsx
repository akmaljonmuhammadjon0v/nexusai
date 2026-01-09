'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useTranslations } from 'next-intl';

const Pricing = () => {
	const router = useRouter();
	const { user } = useAuth();
	const { tier, isPro, isLoading, createCheckout, openCustomerPortal } =
		useSubscription();
	const t = useTranslations('pricing');
	const tNav = useTranslations('nav');

	const plans = [
		{
			id: 'free',
			name: t('free.name'),
			price: '$0',
			period: '/forever',
			description: t('free.description'),
			features: [
				t('free.features.messages'),
				t('free.features.history'),
				t('free.features.support'),
			],
			popular: false,
		},
		{
			id: 'pro',
			name: 'PRO', // Agar kerak bo'lsa, t('pro.name') deb ham qo'yish mumkin
			price: '$19',
			period: '/month',
			description: t('pro.description'),
			features: [
				t('pro.features.messages'),
				t('pro.features.history'),
				t('pro.features.support'),
				t('pro.features.analytics'),
				t('pro.features.api'),
			],
			popular: true,
		},
	];

	const handlePlanClick = async (planId: string) => {
		if (!user) {
			router.push('/auth');
			return;
		}

		if (planId === 'free') {
			router.push('/dashboard');
			return;
		}

		if (isPro) {
			await openCustomerPortal();
		} else {
			await createCheckout();
		}
	};

	const getButtonText = (planId: string) => {
		if (!user) return planId === 'pro' ? t('upgrade') : t('choosePlan');

		if (planId === 'free') {
			if (tier === 'free') return t('currentPlan');
			return tNav('dashboard'); // Agar nav sohasidan tarjima kerak bo'lsa, alohida olish kerak
		}

		if (planId === 'pro') {
			if (isPro) return t('manage');
			return t('upgrade');
		}

		return t('choosePlan');
	};

	const isCurrentPlan = (planId: string) => {
		if (!user) return false;
		return tier === planId;
	};

	return (
		<section id='pricing' className='py-24 px-4 relative'>
			<div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(190_100%_50%/0.05)_0%,transparent_60%)]' />

			<div className='container mx-auto max-w-6xl relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='text-center mb-16'
				>
					<h2 className='font-display text-4xl md:text-5xl font-bold mb-4'>
						{t('title')}
					</h2>
					<p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
						{t('description')}
					</p>
				</motion.div>

				<div className='grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto'>
					{plans.map((plan, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.15 }}
							className={plan.popular ? 'md:-mt-4 md:mb-4' : ''}
						>
							<Card
								variant={plan.popular ? 'glow' : 'glass'}
								className={`h-full relative ${
									plan.popular ? 'border-primary/50' : ''
								} ${isCurrentPlan(plan.id) ? 'ring-2 ring-primary' : ''}`}
							>
								{plan.popular && (
									<div className='absolute -top-4 left-1/2 -translate-x-1/2'>
										<div className='flex items-center gap-1 px-4 py-1.5 rounded-full bg-linear-to-r from-primary to-accent text-primary-foreground text-sm font-medium'>
											<Star className='w-4 h-4 fill-current' />
											{t('pro.popular')}
										</div>
									</div>
								)}

								{isCurrentPlan(plan.id) && (
									<div className='absolute -top-3 right-4'>
										<div className='px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium'>
											{t('currentPlan')}
										</div>
									</div>
								)}

								<CardHeader className='pb-4'>
									<CardTitle className='text-xl'>{plan.name}</CardTitle>
									<p className='text-muted-foreground text-sm'>
										{plan.description}
									</p>
								</CardHeader>

								<CardContent className='space-y-6'>
									<div className='flex items-baseline gap-1'>
										<span className='text-5xl font-bold font-display gradient-text'>
											{plan.price}
										</span>
										<span className='text-muted-foreground'>{plan.period}</span>
									</div>

									<ul className='space-y-3'>
										{plan.features.map((feature, i) => (
											<li key={i} className='flex items-center gap-3'>
												<div className='w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0'>
													<Check className='w-3 h-3 text-primary' />
												</div>
												<span className='text-sm text-muted-foreground'>
													{feature}
												</span>
											</li>
										))}
									</ul>

									<Button
										variant={plan.popular ? 'hero' : 'heroOutline'}
										className='w-full'
										size='lg'
										onClick={() => handlePlanClick(plan.id)}
										disabled={
											isLoading ||
											(isCurrentPlan(plan.id) && plan.id === 'free')
										}
									>
										{isLoading ? (
											<Loader2 className='w-4 h-4 animate-spin' />
										) : (
											getButtonText(plan.id)
										)}
									</Button>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Pricing;
