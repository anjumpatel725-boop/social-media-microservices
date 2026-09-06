import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";

import AppLayout from "../components/AppLayout";

import {
    chatAPI
} from "../services/chatService";

import {
    userAPI
} from "../services/userService";


function Chat() {

    const {
        userId
    } = useParams();

    const navigate =
        useNavigate();


    // =====================================================
    // CURRENT USER
    // =====================================================

    const currentUser =
        useMemo(() => {

            try {

                const storedUser =
                    localStorage.getItem("user");

                if (!storedUser) {
                    return null;
                }

                return JSON.parse(
                    storedUser
                );

            } catch (err) {

                console.error(
                    "CURRENT USER ERROR:",
                    err
                );

                return null;
            }

        }, []);


    const currentUserId =
        Number(
            currentUser?.userId ??
            currentUser?.id
        );


    const selectedUserId =
        Number(userId);


    // =====================================================
    // STATE
    // =====================================================

    const [
        people,
        setPeople
    ] = useState([]);


    const [
        messages,
        setMessages
    ] = useState([]);


    const [
        message,
        setMessage
    ] = useState("");


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        loadingUsers,
        setLoadingUsers
    ] = useState(true);


    const [
        sending,
        setSending
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    // =====================================================
    // LOAD USERS FROM DATABASE
    // =====================================================

    useEffect(() => {

        const loadUsers = async () => {

            try {

                setLoadingUsers(true);


                if (!currentUser) {

                    setPeople([]);

                    return;
                }


                const response =
                    await userAPI.getAllUsers();


                console.log(
                    "CHAT USERS FROM DATABASE:",
                    response
                );


                // -----------------------------------------
                // Handle response.data OR direct array
                // -----------------------------------------

                const users =
                    Array.isArray(response)
                        ? response
                        : Array.isArray(response?.data)
                            ? response.data
                            : [];


                const currentId =
                    Number(
                        currentUser?.userId ??
                        currentUser?.id
                    );


                // -----------------------------------------
                // FORMAT USERS
                // -----------------------------------------

                const formattedUsers =
                    users

                        // Remove logged-in user
                        .filter((user) => {

                            const id =
                                Number(
                                    user.userId ??
                                    user.id
                                );


                            return (
                                id &&
                                id !== currentId
                            );

                        })

                        .map((user) => {

                            const id =
                                Number(
                                    user.userId ??
                                    user.id
                                );


                            const username =
                                user.username ??
                                user.name ??
                                user.email ??
                                `user${id}`;


                            return {

                                id,

                                name:
                                    user.username ??
                                    user.name ??
                                    user.email ??
                                    `User ${id}`,

                                username,

                                avatar:
                                    String(
                                        username
                                    )
                                        .charAt(0)
                                        .toUpperCase(),

                                online: false
                            };

                        });


                console.log(
                    "FORMATTED CHAT USERS:",
                    formattedUsers
                );


                setPeople(
                    formattedUsers
                );


            } catch (err) {

                console.error(
                    "LOAD CHAT USERS ERROR:",
                    err
                );


                console.log(
                    "STATUS:",
                    err.response?.status
                );


                console.log(
                    "DATA:",
                    err.response?.data
                );


                setPeople([]);

            } finally {

                setLoadingUsers(false);
            }

        };


        loadUsers();

    }, [
        currentUser
    ]);


    // =====================================================
    // SELECTED USER
    // =====================================================

    const selectedConversation =
        people.find(
            (person) =>
                Number(person.id) ===
                selectedUserId
        );


    // =====================================================
    // LOAD CONVERSATION
    // =====================================================

    useEffect(() => {

        const loadMessages = async () => {

            // -----------------------------------------
            // Validate users
            // -----------------------------------------

            if (
                !currentUserId ||
                !selectedUserId
            ) {

                setMessages([]);

                setLoading(false);

                return;
            }


            try {

                setLoading(true);

                setError("");


                console.log(
                    "================================="
                );

                console.log(
                    "LOADING CHAT"
                );

                console.log(
                    "CURRENT USER:",
                    currentUserId
                );

                console.log(
                    "SELECTED USER:",
                    selectedUserId
                );

                console.log(
                    "================================="
                );


                // -----------------------------------------
                // GET CONVERSATION
                // -----------------------------------------

                const response =
                    await chatAPI.getConversation(
                        currentUserId,
                        selectedUserId
                    );


                console.log(
                    "CHAT RESPONSE:",
                    response
                );


                const conversationMessages =
                    Array.isArray(response)
                        ? response
                        : [];


                // -----------------------------------------
                // SET MESSAGES
                // -----------------------------------------

                setMessages(
                    conversationMessages
                );


                // =================================================
                // MARK RECEIVED UNREAD MESSAGES AS READ
                // =================================================

                const unreadForThisConversation =
                    conversationMessages.filter(
                        (msg) => {

                            const senderId =
                                Number(
                                    msg.senderId
                                );

                            const receiverId =
                                Number(
                                    msg.receiverId
                                );


                            const isUnread =
                                msg.isRead === false ||
                                msg.isRead === undefined;


                            return (

                                senderId ===
                                selectedUserId

                                &&

                                receiverId ===
                                currentUserId

                                &&

                                isUnread
                            );
                        }
                    );


                console.log(
                    "UNREAD IN THIS CHAT:",
                    unreadForThisConversation
                );


                // -----------------------------------------
                // Mark every unread message as read
                // -----------------------------------------

                if (
                    unreadForThisConversation.length > 0
                ) {

                    await Promise.all(
                        unreadForThisConversation.map(
                            async (msg) => {

                                try {

                                    await chatAPI.markAsRead(
                                        msg.id
                                    );

                                } catch (readError) {

                                    console.error(
                                        "MARK AS READ ERROR:",
                                        msg.id,
                                        readError
                                    );
                                }

                            }
                        )
                    );


                    // -----------------------------------------
                    // Update local messages immediately
                    // -----------------------------------------

                    setMessages(
                        (currentMessages) =>
                            currentMessages.map(
                                (msg) => {

                                    const isReceivedUnread =
                                        Number(
                                            msg.senderId
                                        ) ===
                                        selectedUserId
                                        &&
                                        Number(
                                            msg.receiverId
                                        ) ===
                                        currentUserId
                                        &&
                                        (
                                            msg.isRead === false ||
                                            msg.isRead === undefined
                                        );


                                    if (
                                        isReceivedUnread
                                    ) {

                                        return {
                                            ...msg,
                                            isRead: true
                                        };
                                    }


                                    return msg;
                                }
                            )
                    );


                    // -----------------------------------------
                    // Notify Messages + Navbar
                    // -----------------------------------------

                    window.dispatchEvent(
                        new Event(
                            "unreadCountUpdated"
                        )
                    );
                }


            } catch (err) {

                console.error(
                    "GET CHAT ERROR:",
                    err
                );


                console.log(
                    "STATUS:",
                    err.response?.status
                );


                console.log(
                    "DATA:",
                    err.response?.data
                );


                setError(
                    err.response?.data?.message ||
                    "Unable to load chat."
                );


                setMessages([]);

            } finally {

                setLoading(false);
            }

        };


        loadMessages();

    }, [
        currentUserId,
        selectedUserId
    ]);


    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const handleSend = async () => {

        const text =
            message.trim();


        // -----------------------------------------
        // Empty message
        // -----------------------------------------

        if (!text) {
            return;
        }


        // -----------------------------------------
        // Login validation
        // -----------------------------------------

        if (!currentUserId) {

            alert(
                "Please login again."
            );

            return;
        }


        // -----------------------------------------
        // Selected user validation
        // -----------------------------------------

        if (!selectedUserId) {

            alert(
                "Invalid user."
            );

            return;
        }


        try {

            setSending(true);


            setError("");


            const messageData = {

                senderId:
                    currentUserId,

                receiverId:
                    selectedUserId,

                message:
                    text

            };


            console.log(
                "SEND MESSAGE:",
                messageData
            );


            // -----------------------------------------
            // SEND TO BACKEND
            // -----------------------------------------

            const savedMessage =
                await chatAPI.sendMessage(
                    messageData
                );


            console.log(
                "MESSAGE SAVED:",
                savedMessage
            );


            // -----------------------------------------
            // Add message immediately to UI
            // -----------------------------------------

            setMessages(
                (currentMessages) => [
                    ...currentMessages,
                    savedMessage
                ]
            );


            // -----------------------------------------
            // Clear input
            // -----------------------------------------

            setMessage("");


            // -----------------------------------------
            // Notify Messages page
            // -----------------------------------------

            window.dispatchEvent(
                new Event(
                    "unreadCountUpdated"
                )
            );


        } catch (err) {

            console.error(
                "SEND MESSAGE ERROR:",
                err
            );


            console.log(
                "STATUS:",
                err.response?.status
            );


            console.log(
                "DATA:",
                err.response?.data
            );


            setError(
                err.response?.data?.message ||
                "Unable to send message."
            );


        } finally {

            setSending(false);
        }

    };


    // =====================================================
    // ENTER TO SEND
    // =====================================================

    const handleKeyDown = (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            handleSend();
        }

    };


    // =====================================================
    // INVALID CHAT USER
    // =====================================================

    if (!selectedUserId) {

        return (

            <AppLayout>

                <div className="page-container">

                    <div className="page-heading">

                        <div>

                            <p className="eyebrow">
                                MESSAGES
                            </p>

                            <h1>
                                Chat
                            </h1>

                        </div>

                    </div>


                    <div className="card">

                        <div
                            style={{
                                padding: "40px",
                                textAlign: "center"
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "50px",
                                    marginBottom: "15px"
                                }}
                            >
                                ⚠️
                            </div>


                            <h2>
                                Invalid chat user
                            </h2>


                            <p
                                style={{
                                    color: "#777",
                                    marginBottom: "20px"
                                }}
                            >
                                The selected user could not be found.
                            </p>


                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate("/messages")
                                }
                            >
                                Back to Messages
                            </button>

                        </div>

                    </div>

                </div>

            </AppLayout>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <AppLayout>

            <div className="page-container">


                {/* =========================================
                    PAGE HEADER
                ========================================= */}

                <div className="page-heading">

                    <div>

                        <p className="eyebrow">
                            MESSAGES
                        </p>


                        <h1>
                            Chat
                        </h1>


                        <p className="page-description">
                            Chat with users on the platform.
                        </p>

                    </div>


                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate("/messages")
                        }
                    >
                        ← Messages
                    </button>

                </div>


                {/* =========================================
                    CHAT LAYOUT
                ========================================= */}

                <div
                    className="chat-layout card"
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "300px 1fr",
                        minHeight: "600px",
                        overflow: "hidden"
                    }}
                >


                    {/* =====================================
                        LEFT SIDE - USERS
                    ===================================== */}

                    <div
                        className="chat-conversations"
                        style={{
                            borderRight:
                                "1px solid #eee",
                            overflowY:
                                "auto"
                        }}
                    >


                        {/* HEADER */}

                        <div
                            style={{
                                padding: "20px",
                                borderBottom:
                                    "1px solid #eee"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center"
                                }}
                            >

                                <h3
                                    style={{
                                        margin: 0
                                    }}
                                >
                                    Users
                                </h3>


                                <span
                                    style={{
                                        fontSize:
                                            "13px",
                                        color:
                                            "#888"
                                    }}
                                >
                                    {
                                        people.length
                                    }
                                </span>

                            </div>

                        </div>


                        {/* LOADING USERS */}

                        {loadingUsers ? (

                            <p
                                style={{
                                    padding: "20px",
                                    color: "#888"
                                }}
                            >
                                Loading users...
                            </p>

                        ) : people.length === 0 ? (

                            <div
                                style={{
                                    padding: "20px",
                                    textAlign: "center",
                                    color: "#888"
                                }}
                            >

                                <div
                                    style={{
                                        fontSize: "30px",
                                        marginBottom: "10px"
                                    }}
                                >
                                    👥
                                </div>

                                <p>
                                    No other users found.
                                </p>

                            </div>

                        ) : (

                            people.map(
                                (person) => (

                                    <button
                                        key={
                                            person.id
                                        }

                                        onClick={() =>
                                            navigate(
                                                `/chat/${person.id}`
                                            )
                                        }

                                        style={{
                                            width: "100%",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap:
                                                "12px",
                                            padding:
                                                "16px",
                                            border:
                                                "none",
                                            borderBottom:
                                                "1px solid #f1f1f1",
                                            background:
                                                selectedUserId ===
                                                Number(
                                                    person.id
                                                )
                                                    ? "#f0edff"
                                                    : "white",
                                            cursor:
                                                "pointer",
                                            textAlign:
                                                "left"
                                        }}
                                    >


                                        {/* AVATAR */}

                                        <div
                                            className="avatar"
                                            style={{
                                                flexShrink:
                                                    0
                                            }}
                                        >
                                            {
                                                person.avatar
                                            }
                                        </div>


                                        {/* USER INFO */}

                                        <div
                                            style={{
                                                minWidth: 0
                                            }}
                                        >

                                            <strong
                                                style={{
                                                    display:
                                                        "block",
                                                    overflow:
                                                        "hidden",
                                                    textOverflow:
                                                        "ellipsis",
                                                    whiteSpace:
                                                        "nowrap"
                                                }}
                                            >
                                                {
                                                    person.name
                                                }
                                            </strong>


                                            <div
                                                style={{
                                                    fontSize:
                                                        "13px",
                                                    color:
                                                        "#888",
                                                    marginTop:
                                                        "4px",
                                                    overflow:
                                                        "hidden",
                                                    textOverflow:
                                                        "ellipsis",
                                                    whiteSpace:
                                                        "nowrap"
                                                }}
                                            >

                                                @
                                                {
                                                    person.username
                                                }

                                            </div>

                                        </div>

                                    </button>

                                )
                            )

                        )}

                    </div>


                    {/* =====================================
                        RIGHT SIDE - CHAT
                    ===================================== */}

                    <div
                        className="chat-window"
                        style={{
                            display:
                                "flex",
                            flexDirection:
                                "column",
                            minWidth:
                                0
                        }}
                    >


                        {/* =================================
                            CHAT HEADER
                        ================================= */}

                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap:
                                    "12px",
                                padding:
                                    "18px 22px",
                                borderBottom:
                                    "1px solid #eee"
                            }}
                        >


                            {/* BACK BUTTON MOBILE / GENERAL */}

                            <button
                                onClick={() =>
                                    navigate("/messages")
                                }
                                style={{
                                    border: "none",
                                    background:
                                        "transparent",
                                    cursor:
                                        "pointer",
                                    fontSize:
                                        "20px"
                                }}
                            >
                                ←
                            </button>


                            {/* AVATAR */}

                            <div className="avatar">

                                {
                                    selectedConversation
                                        ?.avatar ||
                                    "U"
                                }

                            </div>


                            {/* USER INFO */}

                            <div
                                style={{
                                    minWidth: 0
                                }}
                            >

                                <strong
                                    style={{
                                        display:
                                            "block",
                                        overflow:
                                            "hidden",
                                        textOverflow:
                                            "ellipsis",
                                        whiteSpace:
                                            "nowrap"
                                    }}
                                >

                                    {
                                        selectedConversation
                                            ?.name ||
                                        `User ${selectedUserId}`
                                    }

                                </strong>


                                <div
                                    style={{
                                        fontSize:
                                            "13px",
                                        color:
                                            "#888",
                                        marginTop:
                                            "3px"
                                    }}
                                >

                                    @
                                    {
                                        selectedConversation
                                            ?.username ||
                                        `user${selectedUserId}`
                                    }

                                </div>

                            </div>

                        </div>


                        {/* =================================
                            ERROR
                        ================================= */}

                        {error && !loading && (

                            <div
                                style={{
                                    margin:
                                        "15px 20px",
                                    padding:
                                        "12px 15px",
                                    background:
                                        "#fff5f5",
                                    color:
                                        "#d63031",
                                    borderRadius:
                                        "10px",
                                    fontSize:
                                        "14px"
                                }}
                            >
                                {error}
                            </div>

                        )}


                        {/* =================================
                            MESSAGES
                        ================================= */}

                        <div
                            style={{
                                flex: 1,
                                padding:
                                    "25px",
                                overflowY:
                                    "auto",
                                display:
                                    "flex",
                                flexDirection:
                                    "column",
                                gap:
                                    "12px"
                            }}
                        >


                            {/* LOADING */}

                            {loading ? (

                                <div
                                    style={{
                                        textAlign:
                                            "center",
                                        marginTop:
                                            "100px",
                                        color:
                                            "#888"
                                    }}
                                >

                                    <div
                                        style={{
                                            fontSize:
                                                "30px",
                                            marginBottom:
                                                "10px"
                                        }}
                                    >
                                        ⏳
                                    </div>

                                    <p>
                                        Loading messages...
                                    </p>

                                </div>

                            ) : messages.length === 0 ? (

                                /* EMPTY CHAT */

                                <div
                                    style={{
                                        textAlign:
                                            "center",
                                        marginTop:
                                            "100px",
                                        color:
                                            "#888"
                                    }}
                                >

                                    <div
                                        style={{
                                            fontSize:
                                                "45px",
                                            marginBottom:
                                                "15px"
                                        }}
                                    >
                                        💬
                                    </div>


                                    <h3
                                        style={{
                                            marginBottom:
                                                "8px",
                                            color:
                                                "#555"
                                        }}
                                    >
                                        No messages yet
                                    </h3>


                                    <p>
                                        Send the first message!
                                    </p>

                                </div>

                            ) : (

                                /* MESSAGE LIST */

                                messages.map(
                                    (msg, index) => {

                                        const isMine =
                                            Number(
                                                msg.senderId
                                            ) ===
                                            currentUserId;


                                        return (

                                            <div
                                                key={
                                                    msg.id ??
                                                    index
                                                }

                                                style={{
                                                    alignSelf:
                                                        isMine
                                                            ? "flex-end"
                                                            : "flex-start",

                                                    background:
                                                        isMine
                                                            ? "#6c5ce7"
                                                            : "#f1f1f5",

                                                    color:
                                                        isMine
                                                            ? "white"
                                                            : "#222",

                                                    padding:
                                                        "12px 16px",

                                                    borderRadius:
                                                        isMine
                                                            ? "16px 16px 4px 16px"
                                                            : "16px 16px 16px 4px",

                                                    maxWidth:
                                                        "65%",

                                                    wordBreak:
                                                        "break-word",

                                                    boxShadow:
                                                        "0 1px 2px rgba(0,0,0,0.05)"
                                                }}
                                            >

                                                {
                                                    msg.message
                                                }

                                            </div>

                                        );

                                    }
                                )

                            )}

                        </div>


                        {/* =================================
                            MESSAGE INPUT
                        ================================= */}

                        <div
                            style={{
                                display:
                                    "flex",
                                gap:
                                    "10px",
                                padding:
                                    "18px",
                                borderTop:
                                    "1px solid #eee",
                                background:
                                    "#fff"
                            }}
                        >

                            <textarea

                                value={
                                    message
                                }

                                onChange={(e) =>
                                    setMessage(
                                        e.target.value
                                    )
                                }

                                onKeyDown={
                                    handleKeyDown
                                }

                                placeholder={
                                    "Write a message..."
                                }

                                rows="1"

                                disabled={
                                    sending
                                }

                                style={{
                                    flex: 1,
                                    resize:
                                        "none",
                                    padding:
                                        "12px 15px",
                                    border:
                                        "1px solid #ddd",
                                    borderRadius:
                                        "12px",
                                    outline:
                                        "none",
                                    fontFamily:
                                        "inherit",
                                    fontSize:
                                        "14px"
                                }}

                            />


                            <button

                                className="primary-button"

                                onClick={
                                    handleSend
                                }

                                disabled={
                                    sending ||
                                    !message.trim()
                                }
                            >

                                {
                                    sending
                                        ? "Sending..."
                                        : "Send →"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </AppLayout>
    );
}


export default Chat;