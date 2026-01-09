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

import { useTranslations } from 'next-intl';

const ContactForm = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const { toast } = useToast();
	const t = useTranslations('contact');
	const tForm = useTranslations('contact.form');
	const tCommon = useTranslations('common');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

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
