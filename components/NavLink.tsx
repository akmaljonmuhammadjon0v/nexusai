'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

import { AnchorHTMLAttributes } from 'react';

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	to: string;
	activeClassName?: string;
	pendingClassName?: string;
	children: ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
	(
		{
			to,
			className,
			activeClassName = 'active',
			// pendingClassName = 'pending',
			children,
			...props
		},
		ref
	) => {
		const pathname = usePathname();

		// "pending" uchun biz o'zgartirish holatini oddiy tarzda handle qilishimiz kerak,
		// lekin Next.js standartda routing "pending" state bermaydi,
		// shuning uchun bu faqat klassik "active" holatni beradi.

		const isActive = pathname === to;

		return (
			<Link
				href={to}
				{...props}
				ref={ref}
				className={cn(className, isActive ? activeClassName : undefined)}
			>
				{children}
			</Link>
		);
	}
);

NavLink.displayName = 'NavLink';

export { NavLink };
