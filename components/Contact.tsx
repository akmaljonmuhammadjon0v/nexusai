'use client';

import { motion } from 'framer-motion';
import ContactForm from './ContactForm';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Contact = () => {
	const t = useTranslations('contact');
	const tNav = useTranslations('nav');

	return (
		<section id='contact' className='py-24 px-4 relative'>
			<div className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(270_100%_65%/0.1)_0%,transparent_70%)]' />

			<div className='container mx-auto max-w-6xl relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className='text-center mb-16'
				>
					<span className='inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4'>
						{tNav('contact')}
					</span>

					<h2 className='text-4xl md:text-5xl font-display font-bold mb-4'>
						{t('title')}
					</h2>

					<p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
						{t('description')}
					</p>
				</motion.div>

				<div className='grid lg:grid-cols-2 gap-8'>
					{/* Contact Info */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className='space-y-8'
					>
						<div className='space-y-4'>
							{/* Email */}
							<div className='flex items-center gap-4 p-4 card-glass rounded-xl'>
								<div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
									<Mail className='w-6 h-6 text-primary' />
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>{t('email')}</p>
									<p className='font-medium'>support@nexusai.com</p>
								</div>
							</div>

							{/* Phone */}
							<div className='flex items-center gap-4 p-4 card-glass rounded-xl'>
								<div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
									<Phone className='w-6 h-6 text-primary' />
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>{t('phone')}</p>
									<p className='font-medium'>+998 90 123 45 67</p>
								</div>
							</div>

							{/* Address */}
							<div className='flex items-center gap-4 p-4 card-glass rounded-xl'>
								<div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
									<MapPin className='w-6 h-6 text-primary' />
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>
										{t('address')}
									</p>
									<p className='font-medium'>Toshkent, O&apos;zbekiston</p>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Contact Form */}
					<ContactForm />
				</div>
			</div>
		</section>
	);
};

export default Contact;
