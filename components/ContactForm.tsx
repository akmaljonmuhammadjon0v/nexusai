'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, User, MessageSquare, Send } from 'lucide-react';
import { z, ZodError } from 'zod';
import { useTranslations } from 'next-intl';

const ContactForm = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<{
		name?: string;
		email?: string;
		message?: string;
	}>({});
	const { toast } = useToast();
	const t = useTranslations('contact');
	const tForm = useTranslations('contact.form');
	const tCommon = useTranslations('common');

	const contactSchema = z.object({
		name: z.string().trim().min(1, tCommon('error')).max(100, tCommon('error')),
		email: z.string().trim().email(tCommon('error')).max(255, tCommon('error')),
		message: z
			.string()
			.trim()
			.min(1, tCommon('error'))
			.max(1000, tCommon('error')),
	});

	const validateForm = () => {
		const result = contactSchema.safeParse({ name, email, message });
		if (!result.success) {
			const newErrors: { name?: string; email?: string; message?: string } = {};
			const zodError = result.error as z.ZodError<{
				name: string;
				email: string;
				message: string;
			}>;
			zodError.errors.forEach(err => {
				const field = err.path[0] as 'name' | 'email' | 'message';
				newErrors[field] = err.message;
			});
			setErrors(newErrors);
			return false;
		}
		setErrors({});
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setLoading(true);

		try {
			const { error } = await supabase
				.from('contact_messages')
				.insert([
					{ name: name.trim(), email: email.trim(), message: message.trim() },
				]);

			if (error) throw error;

			toast({
				title: tCommon('success'),
				description: tCommon('success'),
			});

			setName('');
			setEmail('');
			setMessage('');
		} catch (error) {
			toast({
				title: tCommon('error'),
				description: tCommon('error'),
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			className='card-glass rounded-2xl p-8'
		>
			<h3 className='text-2xl font-display font-bold mb-6'>{t('title')}</h3>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='name'>{tForm('name')}</Label>
					<div className='relative'>
						<User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
						<Input
							id='name'
							type='text'
							placeholder={tForm('name')}
							value={name}
							onChange={e => setName(e.target.value)}
							className='pl-10'
						/>
					</div>
					{errors.name && (
						<p className='text-sm text-destructive'>{errors.name}</p>
					)}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='contactEmail'>{tForm('email')}</Label>
					<div className='relative'>
						<Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
						<Input
							id='contactEmail'
							type='email'
							placeholder='email@example.com'
							value={email}
							onChange={e => setEmail(e.target.value)}
							className='pl-10'
						/>
					</div>
					{errors.email && (
						<p className='text-sm text-destructive'>{errors.email}</p>
					)}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='message'>{tForm('message')}</Label>
					<div className='relative'>
						<MessageSquare className='absolute left-3 top-3 w-4 h-4 text-muted-foreground' />
						<Textarea
							id='message'
							placeholder={tForm('message')}
							value={message}
							onChange={e => setMessage(e.target.value)}
							className='pl-10 min-h-30'
						/>
					</div>
					{errors.message && (
						<p className='text-sm text-destructive'>{errors.message}</p>
					)}
				</div>

				<Button type='submit' className='w-full' disabled={loading}>
					{loading ? (
						tForm('sending')
					) : (
						<>
							<Send className='w-4 h-4 mr-2' />
							{tForm('send')}
						</>
					)}
				</Button>
			</form>
		</motion.div>
	);
};

export default ContactForm;
