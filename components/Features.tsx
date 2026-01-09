import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Zap, Shield, BarChart3, Users, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Features = () => {
	const t = useTranslations('features');

	const features = [
		{
			icon: Brain,
			title: t('smartChat.title'),
			description: t('smartChat.description'),
		},
		{
			icon: Zap,
			title: t('lightning.title'),
			description: t('lightning.description'),
		},
		{
			icon: Shield,
			title: t('security.title'),
			description: t('security.description'),
		},
		{
			icon: BarChart3,
			title: t('analytics.title'),
			description: t('analytics.description'),
		},
		{
			icon: Users,
			title: t('multilingual.title'),
			description: t('multilingual.description'),
		},
		{
			icon: Clock,
			title: t('integration.title'),
			description: t('integration.description'),
		},
	];

	return (
		<section id='features' className='py-24 px-4 relative'>
			<div className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(270_100%_65%/0.05)_0%,transparent_60%)]' />

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

				<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{features.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<Card variant='glow' className='h-full group cursor-pointer'>
								<CardContent className='p-6'>
									<div className='w-12 h-12 rounded-lg bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
										<feature.icon className='w-6 h-6 text-primary' />
									</div>
									<h3 className='font-display text-xl font-semibold mb-2'>
										{feature.title}
									</h3>
									<p className='text-muted-foreground'>{feature.description}</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Features;
