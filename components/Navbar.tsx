'use client';

import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
	const router = useRouter();
	const pathname = usePathname();
	const { user, signOut } = useAuth();
	const t = useTranslations('nav');

	const locale = pathname.split('/')[1];

	const goHome = () => {
		router.push(`/${locale}`);
	};

	const goDashboard = () => {
		router.push(`/${locale}/dashboard`);
	};

	const goAuth = () => {
		router.push(`/${locale}/auth`);
	};

	const handleAuthClick = () => {
		if (user) {
			goDashboard();
		} else {
			goAuth();
		}
	};

	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<motion.nav
			initial={false}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='fixed top-0 left-0 right-0 z-50 px-4 py-4'
		>
			<div className='container mx-auto max-w-6xl'>
				<div className='flex items-center justify-between px-6 py-3 rounded-2xl bg-card/80 backdrop-blur-xl border border-border'>
					{/* Logo */}
					<div
						className='flex items-center gap-2 cursor-pointer'
						onClick={goHome}
					>
						<div className='w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center'>
							<Zap className='w-5 h-5 text-primary-foreground' />
						</div>
						<span className='font-display font-bold text-xl'>NexusAI</span>
					</div>

					{/* Nav Links */}
					<div className='hidden md:flex items-center gap-8'>
						{[
							{ key: 'features', label: t('features') },
							{ key: 'pricing', label: t('pricing') },
							{ key: 'about', label: t('about') },
							{ key: 'contact', label: t('contact') },
						].map(link => (
							<a
								key={link.key}
								href={`#${link.key}`}
								className='text-sm text-muted-foreground hover:text-foreground transition-colors'
							>
								{link.label}
							</a>
						))}
					</div>

					{/* CTA */}
					<div className='flex items-center gap-3'>
						<LanguageSwitcher />

						{user ? (
							<>
								<Button
									variant='ghost'
									size='sm'
									className='hidden sm:inline-flex'
									onClick={handleSignOut}
								>
									{t('logout')}
								</Button>

								<Button variant='default' size='sm' onClick={goDashboard}>
									{t('dashboard')}
								</Button>
							</>
						) : (
							<>
								<Button
									variant='ghost'
									size='sm'
									className='hidden sm:inline-flex'
									onClick={handleAuthClick}
								>
									{t('login')}
								</Button>

								<Button variant='default' size='sm' onClick={handleAuthClick}>
									{t('start')}
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</motion.nav>
	);
};

export default Navbar;
