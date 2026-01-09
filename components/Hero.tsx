import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Hero = () => {
	const t = useTranslations('hero');

	return (
		<section className='relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20'>
			{/* Background Effects */}
			<div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(190_100%_50%/0.1)_0%,transparent_50%)]' />
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-[radial-gradient(circle,hsl(270_100%_65%/0.08)_0%,transparent_60%)]' />

			{/* Floating Elements */}
			<motion.div
				className='absolute top-20 left-[10%] w-20 h-20 rounded-full bg-linear-to-br from-primary/20 to-accent/20 blur-xl'
				animate={{ y: [0, -30, 0] }}
				transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
			/>
			<motion.div
				className='absolute bottom-40 right-[15%] w-32 h-32 rounded-full bg-linear-to-br from-accent/20 to-primary/20 blur-xl'
				animate={{ y: [0, 20, 0] }}
				transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
			/>

			<div className='container mx-auto max-w-6xl relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='text-center'
				>
					{/* Badge */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2 }}
						className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8'
					>
						<Sparkles className='w-4 h-4 text-primary' />
						<span className='text-sm text-muted-foreground'>{t('badge')}</span>
					</motion.div>

					{/* Main Heading */}
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.8 }}
						className='font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6'
					>
						{t('title')}
						<br />
						<span className='gradient-text'>{t('titleHighlight')}</span>
					</motion.h1>

					{/* Description */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.8 }}
						className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10'
					>
						{t('description')}
					</motion.p>

					{/* CTA Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7, duration: 0.8 }}
						className='flex flex-col sm:flex-row gap-4 justify-center items-center'
					>
						<Button variant='hero' size='xl'>
							{t('startFree')}
							<ArrowRight className='w-5 h-5' />
						</Button>
						<Button variant='heroOutline' size='xl'>
							<Zap className='w-5 h-5' />
							{t('learnMore')}
						</Button>
					</motion.div>

					{/* Stats */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.9, duration: 0.8 }}
						className='mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto'
					>
						{[
							{ value: '50K+', label: t('stats.users') },
							{ value: '99.9%', label: t('stats.satisfaction') },
							{ value: '10x', label: t('stats.conversations') },
						].map((stat, index) => (
							<div key={index} className='text-center'>
								<div className='text-3xl md:text-4xl font-bold font-display gradient-text'>
									{stat.value}
								</div>
								<div className='text-sm text-muted-foreground mt-1'>
									{stat.label}
								</div>
							</div>
						))}
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default Hero;
