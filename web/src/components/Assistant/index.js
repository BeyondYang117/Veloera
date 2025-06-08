import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, List, Spin, Avatar } from '@douyinfe/semi-ui';
import { motion, AnimatePresence } from 'framer-motion';
import { IconSend, IconUser, IconBolt } from '@douyinfe/semi-icons';
import { API } from '../../helpers';

const Assistant = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const listRef = useRef(null);

    const handleSendMessage = async () => {
        if (inputValue.trim() === '' || isLoading) return;

        const userMessage = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const res = await API.post('/api/chat/assistant', {
                model: 'gpt-3.5-turbo', // Or any other model you want to use
                messages: [...messages, userMessage],
                stream: false // For simplicity, we use non-streaming first
            });

            if (res && res.data && res.data.choices && res.data.choices[0].message) {
                const assistantMessage = res.data.choices[0].message;
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        // Scroll to the bottom of the list when new messages are added
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div style={{ padding: '20px', border: '1px solid var(--semi-color-border)', borderRadius: '12px', height: '60vh', display: 'flex', flexDirection: 'column', background: 'var(--semi-color-bg-0)' }}>
            <div ref={listRef} style={{ flexGrow: 1, overflowY: 'auto', padding: '0 12px' }}>
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -50 }}
                            transition={{ duration: 0.3 }}
                            style={{ marginBottom: '16px' }}
                        >
                            <List.Item
                                main={
                                    <div>
                                        <strong>{msg.role === 'user' ? 'You' : 'Assistant'}</strong>
                                        <div style={{ marginTop: '4px' }}>{msg.content}</div>
                                    </div>
                                }
                                extra={
                                    <Avatar size="small" style={{ backgroundColor: msg.role === 'user' ? '#87CEFA' : '#FFD700' }}>
                                        {msg.role === 'user' ? <IconUser /> : <IconBolt />}
                                    </Avatar>
                                }
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
                 {isLoading && <Spin tip="Thinking..." />}
            </div>
            <div style={{ display: 'flex', marginTop: '20px', gap: '10px' }}>
                <Input
                    value={inputValue}
                    onChange={setInputValue}
                    onEnterPress={handleSendMessage}
                    placeholder="Ask me anything..."
                    style={{ flexGrow: 1 }}
                    disabled={isLoading}
                />
                <Button
                    icon={<IconSend />}
                    onClick={handleSendMessage}
                    loading={isLoading}
                    type="primary"
                >
                    Send
                </Button>
            </div>
        </div>
    );
};

export default Assistant; 