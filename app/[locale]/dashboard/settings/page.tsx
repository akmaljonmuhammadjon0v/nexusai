'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useConversations } from '@/hooks/useConversations';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

import { toast } from 'sonner';

import {
	Zap,
	LogOut,
	User,
	MessageSquare,
	Bell,
	Shield,
	Palette,
	Globe,
	Trash2,
	Loader2,
} from 'lucide-react';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SettingsPage() {
	const t = useTranslations('settings');
	const tCommon = useTranslations('common');
	const router = useRouter();
	const pathname = usePathname();

	const { user, loading, signOut } = useAuth();
	const { profile, isLoading: profileLoading, updateProfile } = useProfile();
	const { clearAllConversations } = useConversations();
	const { theme, setTheme } = useTheme();

	const [fullName, setFullName] = useState('');
	const [notifications, setNotifications] = useState(true);
	const [language, setLanguage] = useState('uz');
	const [isSaving, setIsSaving] = useState(false);
	const [isClearing, setIsClearing] = useState(false);

	useEffect(() => {
		if (!loading && !user) {
			router.replace('/auth');
		}
	}, [user, loading, router]);

	const fullNames = profile?.full_name || user?.user_metadata?.full_name || '';

	const handleSignOut = async () => {
		await signOut();
		router.replace('/');
	};

	const handleSaveProfile = async () => {
		if (!fullNames.trim()) {
			toast.error(tCommon('error'));
			return;
		}

		setIsSaving(true);
		await updateProfile({ full_name: fullName.trim() });
		setIsSaving(false);
		toast.success(tCommon('success'));
	};

	const handleClearChat = async () => {
		setIsClearing(true);
		await clearAllConversations();
		toast.success(tCommon('success'));
		setIsClearing(false);
	};

	const handleDeleteAccount = async () => {
		toast.error('support@nexusai.com');
	};

	const handleLanguageChange = (lang: string) => {
		setLanguage(lang);

		router.replace(`/${lang}${pathname.substring(3)}`);
	};

	if (loading || profileLoading) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center'>
				<div className='animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full' />
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className='min-h-screen bg-background'>
			{/* Sidebar */}

			{/* Mobile Header */}
			<header className='lg:hidden fixed top-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-b border-border p-4 z-50'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<div className='w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center'>
							<Zap className='w-5 h-5 text-primary-foreground' />
						</div>
						<span className='font-display font-bold'>NexusAI</span>
					</div>
					<Button variant='ghost' size='icon' onClick={handleSignOut}>
						<LogOut className='w-5 h-5' />
					</Button>
				</div>
			</header>

			{/* Main Content */}
			<main className='lg:ml-64 p-4 pt-20 lg:pt-4 pb-24 lg:pb-4'>
				<div className='max-w-2xl mx-auto'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<h1 className='text-3xl font-display font-bold mb-2'>
							{t('title')}
						</h1>
						<p className='text-muted-foreground mb-8'>{t('subtitle')}</p>

						{/* Profile Settings */}
						<div className='card-glass rounded-xl p-6 mb-6'>
							<div className='flex items-center gap-3 mb-4'>
								<User className='w-5 h-5 text-primary' />
								<h2 className='text-lg font-display font-semibold'>
									{t('profile')}
								</h2>
							</div>

							<div className='space-y-4'>
								<div>
									<Label htmlFor='fullName'>{t('fullName')}</Label>
									<Input
										id='fullName'
										value={fullNames}
										onChange={e => setFullName(e.target.value)}
										placeholder={t('fullNamePlaceholder')}
										className='mt-1'
									/>
								</div>

								<div>
									<Label htmlFor='email'>{t('email')}</Label>
									<Input
										id='email'
										value={user.email || ''}
										disabled
										className='mt-1 bg-muted'
									/>
									<p className='text-xs text-muted-foreground mt-1'>
										{t('emailCantChange')}
									</p>
								</div>

								<Button
									onClick={handleSaveProfile}
									disabled={isSaving}
									className='w-full sm:w-auto'
								>
									{isSaving ? (
										<>
											<Loader2 className='w-4 h-4 mr-2 animate-spin' />
											{t('saving')}
										</>
									) : (
										t('save')
									)}
								</Button>
							</div>
						</div>

						{/* Chat Settings */}
						<div className='card-glass rounded-xl p-6 mb-6'>
							<div className='flex items-center gap-3 mb-4'>
								<MessageSquare className='w-5 h-5 text-primary' />
								<h2 className='text-lg font-display font-semibold'>
									{t('chat')}
								</h2>
							</div>

							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='font-medium'>{t('clearHistory')}</p>
										<p className='text-sm text-muted-foreground'>
											{t('clearHistoryDesc')}
										</p>
									</div>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant='destructive'
												size='sm'
												disabled={isClearing}
											>
												{isClearing ? (
													<Loader2 className='w-4 h-4 animate-spin' />
												) : (
													<>
														<Trash2 className='w-4 h-4 mr-2' />
														{t('clear')}
													</>
												)}
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													{t('clearConfirmTitle')}
												</AlertDialogTitle>
												<AlertDialogDescription>
													{t('clearConfirmDesc')}
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>
													{tCommon('cancel')}
												</AlertDialogCancel>
												<AlertDialogAction
													onClick={handleClearChat}
													className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
												>
													{tCommon('delete')}
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						</div>

						{/* Notification Settings */}
						<div className='card-glass rounded-xl p-6 mb-6'>
							<div className='flex items-center gap-3 mb-4'>
								<Bell className='w-5 h-5 text-primary' />
								<h2 className='text-lg font-display font-semibold'>
									{t('notifications')}
								</h2>
							</div>

							<div className='flex items-center justify-between'>
								<div>
									<p className='font-medium'>{t('emailNotifications')}</p>
									<p className='text-sm text-muted-foreground'>
										{t('emailNotificationsDesc')}
									</p>
								</div>
								<Switch
									checked={notifications}
									onCheckedChange={setNotifications}
								/>
							</div>
						</div>

						{/* Appearance Settings */}
						<div className='card-glass rounded-xl p-6 mb-6'>
							<div className='flex items-center gap-3 mb-4'>
								<Palette className='w-5 h-5 text-primary' />
								<h2 className='text-lg font-display font-semibold'>
									{t('appearance')}
								</h2>
							</div>

							<div className='flex items-center justify-between'>
								<div>
									<p className='font-medium'>{t('darkMode')}</p>
									<p className='text-sm text-muted-foreground'>
										{t('darkModeDesc')}
									</p>
								</div>
								<Switch
									checked={theme === 'dark'}
									onCheckedChange={checked =>
										setTheme(checked ? 'dark' : 'light')
									}
								/>
							</div>
						</div>

						{/* Language Settings */}
						<div className='card-glass rounded-xl p-6 mb-6'>
							<div className='flex items-center gap-3 mb-4'>
								<Globe className='w-5 h-5 text-primary' />
								<h2 className='text-lg font-display font-semibold'>
									{t('language')}
								</h2>
							</div>

							<div className='flex gap-2 flex-wrap'>
								<Button
									variant={language === 'uz' ? 'default' : 'outline'}
									onClick={() => handleLanguageChange('uz')}
								>
									O{`'`}zbekcha
								</Button>
								<Button
									variant={language === 'ru' ? 'default' : 'outline'}
									onClick={() => handleLanguageChange('ru')}
								>
									Русский
								</Button>
								<Button
									variant={language === 'en' ? 'default' : 'outline'}
									onClick={() => handleLanguageChange('en')}
								>
									English
								</Button>
							</div>
						</div>

						{/* Security Settings */}
						<div className='card-glass rounded-xl p-6'>
							<div className='flex items-center gap-3 mb-4'>
								<Shield className='w-5 h-5 text-primary' />
								<h2 className='text-lg font-display font-semibold'>
									{t('security')}
								</h2>
							</div>

							<div className='space-y-4'>
								<Button variant='outline' className='w-full sm:w-auto'>
									{t('changePassword')}
								</Button>

								<Separator />

								<div>
									<p className='font-medium text-destructive'>
										{t('deleteAccount')}
									</p>
									<p className='text-sm text-muted-foreground mb-2'>
										{t('deleteAccountDesc')}
									</p>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant='destructive' size='sm'>
												{t('deleteAccount')}
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													{t('deleteConfirmTitle')}
												</AlertDialogTitle>
												<AlertDialogDescription>
													{t('deleteConfirmDesc')}
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>
													{tCommon('cancel')}
												</AlertDialogCancel>
												<AlertDialogAction
													onClick={handleDeleteAccount}
													className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
												>
													{tCommon('delete')}
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</main>
		</div>
	);
}
