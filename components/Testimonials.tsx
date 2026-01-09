import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Testimonial = {
	name: string;
	role: string;
	content: string;
};

const Testimonials = () => {
	const t = useTranslations('testimonials');

	const testimonials = t.raw('items') as Testimonial[];

	const getInitials = (name: string) =>
		name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);

	return (
		<section className='py-24 px-4 relative'>
			<div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(190_100%_50%/0.08)_0%,transparent_50%)]' />

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
						<span className='gradient-text'> {t('titleHighlight')}</span>
					</h2>

					<p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
						{t('description')}
					</p>
				</motion.div>

				<div className='grid md:grid-cols-3 gap-6'>
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<Card variant='glass' className='h-full'>
								<CardContent className='p-6'>
									<div className='flex gap-1 mb-4'>
										{Array.from({ length: 5 }).map((_, i) => (
											<Star
												key={i}
												className='w-4 h-4 text-primary fill-primary'
											/>
										))}
									</div>

									{/* ✅ CONTENT — TO‘G‘RISI */}
									<p className='text-muted-foreground mb-6 leading-relaxed'>
										{testimonial.content}
									</p>

									<div className='flex items-center gap-3'>
										<div className='w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm'>
											{getInitials(testimonial.name)}
										</div>

										<div>
											<div className='font-semibold'>{testimonial.name}</div>
											<div className='text-sm text-muted-foreground'>
												{testimonial.role}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
