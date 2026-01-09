import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const CTA = () => {
	const t = useTranslations('cta');

	return (
		<section className='py-24 px-4 relative overflow-hidden'>
			{/* Background */}
			<div className='absolute inset-0 bg-linear-to-b from-background via-primary/5 to-background' />
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[radial-gradient(circle,hsl(190_100%_50%/0.15)_0%,transparent_60%)]' />

			<div className='container mx-auto max-w-4xl relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='text-center'
				>
					<h2 className='font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6'>
						{t('title')}
					</h2>

					<p className='text-lg text-muted-foreground max-w-2xl mx-auto mb-10'>
						{t('description')}
					</p>

					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Button variant='hero' size='xl'>
							{t('startFree')}
							<ArrowRight className='w-5 h-5' />
						</Button>
						<Button variant='heroOutline' size='xl'>
							{t('scheduleDemo')}
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default CTA;
