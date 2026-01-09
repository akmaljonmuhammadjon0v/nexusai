'use client';

import { Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Footer = () => {
	const t = useTranslations('footer');

	// Linklarni object ko‘rinishida olish uchun
	const sections = [
		{
			title: t('product'),
			links: [
				t('productLinks.features'),
				t('productLinks.pricing'),
				t('productLinks.integrations'),
				t('productLinks.changelog'),
			],
		},
		{
			title: t('company'),
			links: [
				t('companyLinks.about'),
				t('companyLinks.blog'),
				t('companyLinks.careers'),
				t('companyLinks.press'),
			],
		},
		{
			title: t('resources'),
			links: [
				t('resourcesLinks.documentation'),
				t('resourcesLinks.helpCenter'),
				t('resourcesLinks.apiReference'),
				t('resourcesLinks.community'),
			],
		},
		{
			title: t('legal'),
			links: [
				t('legalLinks.privacy'),
				t('legalLinks.terms'),
				t('legalLinks.security'),
				t('legalLinks.cookies'),
			],
		},
	];

	const socials = [
		t('socials.twitter'),
		t('socials.linkedin'),
		t('socials.github'),
	];

	return (
		<footer className='border-t border-border py-16 px-4'>
			<div className='container mx-auto max-w-6xl'>
				<div className='grid grid-cols-2 md:grid-cols-5 gap-8 mb-12'>
					{/* Brand */}
					<div className='col-span-2 md:col-span-1'>
						<div className='flex items-center gap-2 mb-4'>
							<div className='w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center'>
								<Zap className='w-5 h-5 text-primary-foreground' />
							</div>
							<span className='font-display font-bold text-xl'>NexusAI</span>
						</div>
						<p className='text-sm text-muted-foreground'>{t('tagline')}</p>
					</div>

					{/* Links */}
					{sections.map(({ title, links }) => (
						<div key={title}>
							<h4 className='font-semibold text-foreground mb-4'>{title}</h4>
							<ul className='space-y-2'>
								{links.map(link => (
									<li key={link}>
										<a
											href='#'
											className='text-sm text-muted-foreground hover:text-foreground transition-colors'
										>
											{link}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom */}
				<div className='pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4'>
					<p className='text-sm text-muted-foreground'>
						© 2024 NexusAI. {t('allRights')}
					</p>
					<div className='flex items-center gap-4'>
						{socials.map(social => (
							<a
								key={social}
								href='#'
								className='text-sm text-muted-foreground hover:text-foreground transition-colors'
							>
								{social}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
