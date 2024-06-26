import React, { useEffect, useRef, useState } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import '../../css/ChatModal.css';
import axios from "axios";

const ChatModal = ({ boardId, userInfo, onClose }) => {
    const apiInstance = axios.create({ baseURL: "http://localhost:8084/api/chat/" });
    const [socketConnected, setSocketConnected] = useState(false);
    const [stompClient, setStompClient] = useState(null);
    const webSocketUrl = "http://localhost:8084/chat/pub";

    const [timeFormatted, setTimeFormatted] = useState('');
    const [sendMsg, setSendMsg] = useState(false);
    const [message, setMessage] = useState('');
    const [items, setItems] = useState([]);

    const scrollRef = useRef();

    const [accessToken, setAccessToken] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        setUserId(userInfo.id);

        const socket = new SockJS(webSocketUrl);
        const stomp = Stomp.over(socket);

        stomp.connect({ boardId : boardId, sender : userId, createTime :  Date.now() }, () => {
            console.log('Stomp 연결 성공');
            setSocketConnected(true);

            stomp.subscribe(`/topic/${boardId}`, (message) => {
                const data = JSON.parse(message.body);
                setItems((prevItems) => [...prevItems, data.messageContent]);
            });
        });

        fetchChatHistory();
        setStompClient(stomp);
    }, [boardId]);

    const fetchChatHistory = async () => {
        try {
            const response = await apiInstance.get(boardId);
            if(response.data == '') {
                return;
            }

            let newItems = response.data.messageContentList.map((content) => (
                {
                    sender: content.sender,
                    content: content.content,
                    sendTime: content.sendTime,
                }
            ));

            setItems((prevItems) => [...prevItems, ...newItems]);
        } catch (error) {
            console.error('채팅 목록 가져오기 중 에러 발생: ', error)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (socketConnected) {
                stompClient.send(`/chat/pub/topic/${boardId}`, { boardId : boardId },
                    JSON.stringify({
                        boardId: boardId,
                        messageContent: {
                            // 추후 로그인 ID로 변경 필수
                            sender: userId,
                            content: message,
                            sendTime: Date.now()
                        },
                        type: "TALK"
                    })
                );
                setMessage('');
                setSendMsg(true);
            }
        }
    };

    const timeFormat = (time) => {
        const date = new Date(parseInt(time));
        const hour = date.getHours();
        const displayHour = hour % 12 || 12;
        const minute = date.getMinutes();
        const ampm = hour >= 12 ? '오후' : '오전';

        return `${ampm} ${displayHour}:${minute < 10 ? '0' : ''}${minute}`;
    }

    useEffect(() => {
        if (sendMsg) {
            stompClient.onmessage = (e) => {
                const data = JSON.parse(e.body);
                setItems((prevItems) => [...prevItems, data]);
            };
        }
    }, [sendMsg]);

    useEffect(() => {
        scrollToBottom();
    }, [items]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content" ref={scrollRef}>
                    {items.map((item, index) => (
                        <div className="wrap" key={ index }>
                            <div className={ item.sender === userId ? "chat me" : "chat other" }>
                                {item.sender !== userId && <div className="icon"><i className="fa-solid fa-user"></i></div>}
                                <div className="userTextbox">
                                    {item.sender !== userId && <div className="user">{ item.sender }</div>}
                                    <div className="textbox">{ item.content }</div>
                                </div>
                                <div className="time-stamp"><p>{ timeFormat(item.sendTime) }</p></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <button onClick={() => {
                        if (stompClient) {
                            stompClient.disconnect(0, {boardId: boardId});
                        }
                        onClose();
                    }}>Close</button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>
        </div>
    );
}

export default ChatModal;