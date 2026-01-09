'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Zap, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

const authSchema = z.object({
	email: z.string().email("Noto'g'ri email format"),
	password: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
});

const Auth = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [fullName, setFullName] = useState('');
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{}
	);
	const [mounted, setMounted] = useState(false);

	const { signIn, signUp, user } = useAuth();
	const { toast } = useToast();
	const router = useRouter();
	const { t } = useTranslation();

	useEffect(() => {
		if (user) {
			router.push('/dashboard');
		}
	}, [user, router]);

	const validateForm = () => {
		try {
			authSchema.parse({ email, password });
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: { email?: string; password?: string } = {};
				error.issues.forEach(err => {
					if (err.path[0] === 'email') newErrors.email = err.message;
					if (err.path[0] === 'password') newErrors.password = err.message;
				});
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setLoading(true);

		try {
			if (isLogin) {
				const { error } = await signIn(email, password);
				if (error) {
					if (error.message.includes('Invalid login credentials')) {
						toast({
							title: 'Xatolik',
							description: "Email yoki parol noto'g'ri",
							variant: 'destructive',
						});
					} else {
						toast({
							title: 'Xatolik',
							description: error.message,
							variant: 'destructive',
						});
					}
				} else {
					toast({
						title: 'Muvaffaqiyatli',
						description: 'Tizimga kirdingiz!',
					});
				}
			} else {
				const { error } = await signUp(email, password, fullName);
				if (error) {
					if (error.message.includes('User already registered')) {
						toast({
							title: 'Xatolik',
							description: "Bu email allaqachon ro'yxatdan o'tgan",
							variant: 'destructive',
						});
					} else {
						toast({
							title: 'Xatolik',
							description: error.message,
							variant: 'destructive',
						});
					}
				} else {
					toast({
						title: 'Muvaffaqiyatli',
						description: "Ro'yxatdan o'tdingiz!",
					});
				}
			}
		} catch (error) {
			toast({
				title: 'Xatolik',
				description: 'Kutilmagan xatolik yuz berdi',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const id = setTimeout(() => setMounted(true), 0);
		return () => clearTimeout(id);
	}, []);

	if (!mounted) return null;

	return (
		<div className='min-h-screen bg-background flex items-center justify-center p-4'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='w-full max-w-md'
			>
				<div className='mb-6'>
					<Button
						variant='ghost'
						onClick={() => router.push('/')}
						className='text-muted-foreground hover:text-foreground'
					>
						<ArrowLeft className='w-4 h-4 mr-2' />
						{t('common.back')}
					</Button>
				</div>

				<div className='card-glass rounded-2xl p-8 shadow-card'>
					{/* Logo */}
					<div className='flex items-center justify-center gap-2 mb-8'>
						<div className='w-10 h-10 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center'>
							<Zap className='w-6 h-6 text-primary-foreground' />
						</div>
						<span className='font-display font-bold text-2xl'>NexusAI</span>
					</div>

					<h1 className='text-2xl font-display font-bold text-center mb-2'>
						{isLogin ? t('auth.login') : t('auth.signup')}
					</h1>
					<p className='text-muted-foreground text-center mb-8'>
						{isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
					</p>

					<form onSubmit={handleSubmit} className='space-y-4'>
						{!isLogin && (
							<div className='space-y-2'>
								<Label htmlFor='fullName'>{t('auth.fullName')}</Label>
								<div className='relative'>
									<User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
									<Input
										id='fullName'
										type='text'
										placeholder={t('auth.fullName')}
										value={fullName}
										onChange={e => setFullName(e.target.value)}
										className='pl-10'
									/>
								</div>
							</div>
						)}

						<div className='space-y-2'>
							<Label htmlFor='email'>{t('auth.email')}</Label>
							<div className='relative'>
								<Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
								<Input
									id='email'
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
							<Label htmlFor='password'>{t('auth.password')}</Label>
							<div className='relative'>
								<Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
								<Input
									id='password'
									type='password'
									placeholder='••••••••'
									value={password}
									onChange={e => setPassword(e.target.value)}
									className='pl-10'
								/>
							</div>
							{errors.password && (
								<p className='text-sm text-destructive'>{errors.password}</p>
							)}
						</div>

						<Button type='submit' className='w-full' disabled={loading}>
							{loading
								? t('common.loading')
								: isLogin
								? t('auth.loginButton')
								: t('auth.signupButton')}
						</Button>
					</form>

					<div className='mt-6 text-center'>
						<button
							type='button'
							onClick={() => setIsLogin(!isLogin)}
							className='text-sm text-muted-foreground hover:text-primary transition-colors'
						>
							{isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
						</button>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default Auth;
