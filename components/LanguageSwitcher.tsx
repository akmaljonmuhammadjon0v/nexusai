'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const languages = [
	{ code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
	{ code: 'en', name: 'English', flag: 'EN' },
	{ code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

const LanguageSwitcher = () => {
	const router = useRouter();
	const pathname = usePathname();

	// Hozirgi tilni URL'dan olish
	const currentLocale =
		languages.find(lang => pathname.startsWith(`/${lang.code}`))?.code || 'uz';

	const changeLanguage = (code: string) => {
		// URL'dagi hozirgi tilni yangi til bilan almashtiramiz
		let newPath = pathname;

		if (currentLocale) {
			newPath = pathname.replace(`/${currentLocale}`, `/${code}`);
		} else {
			newPath = `/${code}${pathname}`;
		}

		// Yangi URLga o'tish
		router.push(newPath);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='sm' className='gap-2'>
					<Globe className='h-4 w-4' />
					<span className='hidden sm:inline'>
						{languages.find(lang => lang.code === currentLocale)?.flag}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{languages.map(lang => (
					<DropdownMenuItem
						key={lang.code}
						onClick={() => changeLanguage(lang.code)}
						className={currentLocale === lang.code ? 'bg-accent' : ''}
					>
						<span className='mr-2'>{lang.flag}</span>
						{lang.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default LanguageSwitcher;
