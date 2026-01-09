'use client';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import { useEffect, useState } from 'react';
export default function Page() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const id = setTimeout(() => setMounted(true), 0);
		return () => clearTimeout(id);
	}, []);

	if (!mounted) return null;
	return (
		<div>
			<main className='min-h-screen bg-background'>
				<Navbar />
				<Hero />
				<Features />
				<Pricing />
				<Testimonials />
				<Contact />
				<CTA />
				<Footer />
			</main>
		</div>
	);
}
