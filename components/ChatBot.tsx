'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Send,
	Bot,
	User,
	Loader2,
	Plus,
	Trash2,
	MessageSquare,
	Crown,
	Lock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useConversations } from '@/hooks/useConversations';
import { useMessageLimits } from '@/hooks/useMessageLimits';
import { useSubscription, FREE_LIMITS } from '@/hooks/useSubscription';
import { useTranslations } from 'next-intl';
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

interface Message {
	role: 'user' | 'assistant';
	content: string;
}

const CHAT_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/chat`;

const ChatBot = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingHistory, setIsLoadingHistory] = useState(true);
	const scrollRef = useRef<HTMLDivElement>(null);
	const { toast } = useToast();
	const { user } = useAuth();
	const { isPro, createCheckout } = useSubscription();
	const tChat = useTranslations('chat');
	const tCommon = useTranslations('common');
	const tPricing = useTranslations('pricing');
	const {
		canSendMessage,
		canCreateConversation,
		remainingMessages,
		refetch: refetchLimits,
	} = useMessageLimits();
	const {
		conversations,
		currentConversation,
		setCurrentConversation,
		createConversation,
		deleteConversation,
		updateConversationTitle,
		clearAllConversations,
	} = useConversations();

	// Load chat history from database
	useEffect(() => {
		const loadChatHistory = async () => {
			if (!user) {
				setIsLoadingHistory(false);
				return;
			}

			if (!currentConversation) {
				setMessages([]);
				setIsLoadingHistory(false);
				return;
			}

			try {
				const { data, error } = await supabase
					.from('chat_messages')
					.select('role, content')
					.eq('user_id', user.id)
					.eq('conversation_id', currentConversation.id)
					.order('created_at', { ascending: true });

				if (error) throw error;

				if (data) {
					setMessages(
						data.map(msg => ({
							role: msg.role as 'user' | 'assistant',
							content: msg.content,
						}))
					);
				}
			} catch (error) {
				console.error('Error loading chat history:', error);
			} finally {
				setIsLoadingHistory(false);
			}
		};

		loadChatHistory();
	}, [user, currentConversation]);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	// Save message to database
	const saveMessage = async (
		role: 'user' | 'assistant',
		content: string,
		conversationId: string
	) => {
		if (!user) return;

		try {
			await supabase.from('chat_messages').insert({
				user_id: user.id,
				role,
				content,
				conversation_id: conversationId,
			});
		} catch (error) {
			console.error('Error saving message:', error);
		}
	};

	// Generate and update conversation title based on first exchange
	const generateTitle = async (
		userMessage: string,
		assistantMessage: string,
		conversationId: string
	) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-title`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
					},
					body: JSON.stringify({ userMessage, assistantMessage }),
				}
			);

			if (response.ok) {
				const data = await response.json();
				if (data.title && data.title !== 'Yangi suhbat') {
					await updateConversationTitle(conversationId, data.title);
				}
			}
		} catch (error) {
			console.error('Error generating title:', error);
		}
	};

	const streamChat = async (userMessages: Message[]): Promise<string> => {
		const resp = await fetch(CHAT_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
			},
			body: JSON.stringify({ messages: userMessages }),
		});

		if (resp.status === 429) {
			throw new Error('Rate limits exceeded, please try again later.');
		}
		if (resp.status === 402) {
			throw new Error('Payment required, please add funds.');
		}
		if (!resp.ok || !resp.body) {
			throw new Error('Failed to start stream');
		}

		const reader = resp.body.getReader();
		const decoder = new TextDecoder();
		let textBuffer = '';
		let assistantContent = '';
		let streamDone = false;

		while (!streamDone) {
			const { done, value } = await reader.read();
			if (done) break;
			textBuffer += decoder.decode(value, { stream: true });

			let newlineIndex: number;
			while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
				let line = textBuffer.slice(0, newlineIndex);
				textBuffer = textBuffer.slice(newlineIndex + 1);

				if (line.endsWith('\r')) line = line.slice(0, -1);
				if (line.startsWith(':') || line.trim() === '') continue;
				if (!line.startsWith('data: ')) continue;

				const jsonStr = line.slice(6).trim();
				if (jsonStr === '[DONE]') {
					streamDone = true;
					break;
				}

				try {
					const parsed = JSON.parse(jsonStr);
					const content = parsed.choices?.[0]?.delta?.content as
						| string
						| undefined;
					if (content) {
						assistantContent += content;
						setMessages(prev => {
							const last = prev[prev.length - 1];
							if (last?.role === 'assistant') {
								return prev.map((m, i) =>
									i === prev.length - 1
										? { ...m, content: assistantContent }
										: m
								);
							}
							return [
								...prev,
								{ role: 'assistant', content: assistantContent },
							];
						});
					}
				} catch {
					textBuffer = line + '\n' + textBuffer;
					break;
				}
			}
		}

		return assistantContent;
	};

	const handleSend = async () => {
		if (!input.trim() || isLoading) return;

		// Check message limit for free users
		if (!canSendMessage()) {
			toast({
				title: tCommon('error'),
				description: tChat('upgradeDesc'),
				variant: 'destructive',
			});
			return;
		}

		let activeConversation = currentConversation;
		const isNewConversation = !activeConversation;

		// Create new conversation if none exists
		if (!activeConversation) {
			if (!canCreateConversation()) {
				toast({
					title: tCommon('error'),
					description: tChat('upgradeDesc'),
					variant: 'destructive',
				});
				return;
			}
			activeConversation = await createConversation();
			if (!activeConversation) {
				toast({
					title: tCommon('error'),
					description: tCommon('error'),
					variant: 'destructive',
				});
				return;
			}
		}

		const userMessage: Message = { role: 'user', content: input.trim() };
		const newMessages = [...messages, userMessage];
		setMessages(newMessages);
		setInput('');
		setIsLoading(true);

		// Save user message to database
		await saveMessage('user', userMessage.content, activeConversation.id);

		try {
			const assistantContent = await streamChat(newMessages);
			// Save assistant response to database
			if (assistantContent) {
				await saveMessage('assistant', assistantContent, activeConversation.id);

				// Generate title for new conversations after first exchange
				if (isNewConversation || activeConversation.title === 'Yangi suhbat') {
					generateTitle(
						userMessage.content,
						assistantContent,
						activeConversation.id
					);
				}
			}
			// Refresh limits after sending message
			refetchLimits();
		} catch (error) {
			toast({
				title: tCommon('error'),
				description: tCommon('error'),
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleNewChat = async () => {
		if (!canCreateConversation()) {
			toast({
				title: tCommon('error'),
				description: tChat('upgradeDesc'),
				variant: 'destructive',
			});
			return;
		}
		const newConv = await createConversation();
		if (newConv) {
			setMessages([]);
			refetchLimits();
		}
	};

	const handleSelectConversation = (conv: typeof currentConversation) => {
		if (conv) {
			setCurrentConversation(conv);
			setIsLoadingHistory(true);
		}
	};

	const handleDeleteConversation = async (convId: string) => {
		await deleteConversation(convId);
		if (currentConversation?.id === convId) {
			setMessages([]);
		}
	};

	return (
		<div className='flex gap-2 sm:gap-4 h-[calc(100vh-280px)] sm:h-[calc(100vh-300px)] lg:h-125 min-h-75'>
			{/* Conversations Sidebar */}
			<div className='hidden md:flex flex-col w-48 lg:w-64 card-glass rounded-xl lg:rounded-2xl overflow-hidden shrink-0'>
				<div className='p-2 lg:p-3 border-b border-border'>
					<Button
						onClick={handleNewChat}
						className='w-full'
						variant='outline'
						size='sm'
					>
						<Plus className='w-4 h-4 mr-1 lg:mr-2' />
						<span className='text-xs lg:text-sm'>{tChat('newChat')}</span>
					</Button>
				</div>

				<ScrollArea className='flex-1 p-1 lg:p-2'>
					{conversations.length === 0 ? (
						<p className='text-xs lg:text-sm text-muted-foreground text-center py-4'>
							{tChat('noConversations')}
						</p>
					) : (
						<div className='space-y-1'>
							{conversations.map(conv => (
								<div
									key={conv.id}
									className={`group flex items-center gap-1 lg:gap-2 p-1.5 lg:p-2 rounded-lg cursor-pointer transition-colors ${
										currentConversation?.id === conv.id
											? 'bg-primary/10 text-primary'
											: 'hover:bg-secondary'
									}`}
									onClick={() => handleSelectConversation(conv)}
								>
									<MessageSquare className='w-3 h-3 lg:w-4 lg:h-4 shrink-0' />
									<span className='text-xs lg:text-sm truncate flex-1'>
										{conv.title}
									</span>
									<Button
										variant='ghost'
										size='icon'
										className='w-5 h-5 lg:w-6 lg:h-6 opacity-0 group-hover:opacity-100'
										onClick={e => {
											e.stopPropagation();
											handleDeleteConversation(conv.id);
										}}
									>
										<Trash2 className='w-2.5 h-2.5 lg:w-3 lg:h-3 text-destructive' />
									</Button>
								</div>
							))}
						</div>
					)}
				</ScrollArea>

				{conversations.length > 0 && (
					<div className='p-1.5 lg:p-2 border-t border-border'>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant='ghost'
									size='sm'
									className='w-full text-destructive hover:text-destructive text-xs lg:text-sm'
								>
									<Trash2 className='w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2' />
									{tChat('delete')}
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent className='max-w-[90vw] sm:max-w-lg'>
								<AlertDialogHeader>
									<AlertDialogTitle>{tChat('deleteAll')}</AlertDialogTitle>
									<AlertDialogDescription>
										{tChat('deleteConfirm')}
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>{tChat('cancel')}</AlertDialogCancel>
									<AlertDialogAction
										onClick={clearAllConversations}
										className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
									>
										{tChat('delete')}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				)}
			</div>

			{/* Chat Area */}
			<div className='flex-1 flex flex-col card-glass rounded-xl lg:rounded-2xl overflow-hidden min-w-0'>
				<div className='p-2 sm:p-3 lg:p-4 border-b border-border shrink-0'>
					<div className='flex items-center justify-between gap-2'>
						<div className='flex items-center gap-2 min-w-0'>
							<div className='w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center shrink-0'>
								<Bot className='w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground' />
							</div>
							<div className='min-w-0'>
								<h3 className='font-display font-semibold text-sm sm:text-base'>
									NexusAI
								</h3>
								<p className='text-xs text-muted-foreground truncate'>
									{currentConversation?.title || tChat('newChat')}
								</p>
							</div>
						</div>
						<Button
							onClick={handleNewChat}
							variant='outline'
							size='sm'
							className='md:hidden shrink-0'
						>
							<Plus className='w-4 h-4' />
						</Button>
					</div>
				</div>

				<ScrollArea ref={scrollRef} className='flex-1 p-2 sm:p-3 lg:p-4'>
					{messages.length === 0 && (
						<div className='flex flex-col items-center justify-center h-full text-center px-4'>
							<Bot className='w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mb-3 sm:mb-4' />
							<p className='text-sm text-muted-foreground'>
								{tChat('welcome')}
							</p>
						</div>
					)}

					<AnimatePresence>
						{messages.map((message, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className={`flex gap-2 sm:gap-3 mb-3 sm:mb-4 ${
									message.role === 'user' ? 'justify-end' : 'justify-start'
								}`}
							>
								{message.role === 'assistant' && (
									<div className='w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center shrink-0'>
										<Bot className='w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary-foreground' />
									</div>
								)}
								<div
									className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 ${
										message.role === 'user'
											? 'bg-primary text-primary-foreground'
											: 'bg-secondary text-secondary-foreground'
									}`}
								>
									<p className='text-xs sm:text-sm whitespace-pre-wrap wrap-break-word'>
										{message.content}
									</p>
								</div>
								{message.role === 'user' && (
									<div className='w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-muted flex items-center justify-center shrink-0'>
										<User className='w-3.5 h-3.5 sm:w-5 sm:h-5 text-muted-foreground' />
									</div>
								)}
							</motion.div>
						))}
					</AnimatePresence>

					{isLoading && messages[messages.length - 1]?.role === 'user' && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='flex gap-2 sm:gap-3'
						>
							<div className='w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center'>
								<Loader2 className='w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary-foreground animate-spin' />
							</div>
							<div className='bg-secondary rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4'>
								<p className='text-xs sm:text-sm text-muted-foreground'>
									{tCommon('loading')}
								</p>
							</div>
						</motion.div>
					)}
				</ScrollArea>

				<div className='p-2 sm:p-3 lg:p-4 border-t border-border shrink-0'>
					{!isPro && (
						<div className='flex items-center justify-between mb-2 px-1'>
							<span className='text-xs text-muted-foreground'>
								{remainingMessages === Infinity ? '∞' : remainingMessages}/
								{FREE_LIMITS.messagesPerDay}
							</span>
							<Button
								variant='ghost'
								size='sm'
								className='h-6 text-xs text-primary'
								onClick={createCheckout}
							>
								<Crown className='w-3 h-3 mr-1' />
								{tPricing('upgrade')}
							</Button>
						</div>
					)}
					<div className='flex gap-2'>
						<Input
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder={
								canSendMessage() ? tChat('placeholder') : tCommon('error')
							}
							disabled={isLoading || !canSendMessage()}
							className='flex-1 text-sm'
						/>
						<Button
							onClick={handleSend}
							disabled={!input.trim() || isLoading || !canSendMessage()}
							size='icon'
							className='shrink-0'
						>
							{!canSendMessage() ? (
								<Lock className='w-4 h-4' />
							) : (
								<Send className='w-4 h-4' />
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatBot;
