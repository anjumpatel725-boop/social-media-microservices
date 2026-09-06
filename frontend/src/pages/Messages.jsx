import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import AppLayout from "../components/AppLayout";

import {
    userAPI
} from "../services/userService";

import {
    chatAPI
} from "../services/chatService";


function Messages() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [
        search,
        setSearch
    ] = useState("");

    const [
        showNewMessage,
        setShowNewMessage
    ] = useState(false);

    const [
        personSearch,
        setPersonSearch
    ] = useState("");

    const [
        people,
        setPeople
    ] = useState([]);

    const [
        conversations,
        setConversations
    ] = useState([]);

    const [
        unreadMessages,
        setUnreadMessages
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        loadingConversations,
        setLoadingConversations
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");


    // =====================================================
    // CURRENT USER
    // =====================================================

    const getCurrentUser = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(storedUser);

        } catch (err) {

            console.error(
                "CURRENT USER ERROR:",
                err
            );

            return null;
        }
    };


    // =====================================================
    // LOAD ALL USERS
    // Used for NEW MESSAGE modal
    // =====================================================

    const loadUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const currentUser =
                getCurrentUser();

            if (!currentUser) {

                setError(
                    "Please login again."
                );

                return;
            }


            const currentUserId =
                Number(
                    currentUser.userId ??
                    currentUser.id
                );


            console.log(
                "CURRENT USER ID:",
                currentUserId
            );


            const response =
                await userAPI.getAllUsers();


            console.log(
                "ALL USERS FROM DATABASE:",
                response
            );


            const users =
                Array.isArray(response)
                    ? response
                    : Array.isArray(response?.data)
                        ? response.data
                        : [];


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
                            id !== currentUserId
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
                                String(username)
                                    .charAt(0)
                                    .toUpperCase(),

                            online: false
                        };
                    });


            console.log(
                "FORMATTED USERS:",
                formattedUsers
            );


            setPeople(
                formattedUsers
            );


        } catch (err) {

            console.error(
                "LOAD USERS ERROR:",
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
                "Unable to load users."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD ACTUAL CONVERSATIONS
    // =====================================================

    const loadConversations = async () => {

        try {

            setLoadingConversations(
                true
            );


            const currentUser =
                getCurrentUser();


            if (!currentUser) {
                return;
            }


            const currentUserId =
                Number(
                    currentUser.userId ??
                    currentUser.id
                );


            console.log(
                "LOADING CONVERSATIONS FOR:",
                currentUserId
            );


            const response =
                await chatAPI.getConversations(
                    currentUserId
                );


            console.log(
                "CONVERSATION USER IDS:",
                response
            );


            const ids =
                Array.isArray(response)
                    ? response
                    : [];


            const conversationIds =
                ids.map(
                    (id) => Number(id)
                );


            const conversationUsers =
                people.filter(
                    (person) =>
                        conversationIds.includes(
                            Number(person.id)
                        )
                );


            console.log(
                "ACTUAL CONVERSATIONS:",
                conversationUsers
            );


            setConversations(
                conversationUsers
            );


        } catch (err) {

            console.error(
                "LOAD CONVERSATIONS ERROR:",
                err
            );

            setConversations([]);

        } finally {

            setLoadingConversations(
                false
            );
        }
    };


    // =====================================================
    // LOAD UNREAD MESSAGES
    // =====================================================

    const loadUnreadMessages = async () => {

        try {

            const currentUser =
                getCurrentUser();


            if (!currentUser) {
                return;
            }


            const currentUserId =
                Number(
                    currentUser.userId ??
                    currentUser.id
                );


            const response =
                await chatAPI.getUnreadMessages(
                    currentUserId
                );


            console.log(
                "UNREAD MESSAGES:",
                response
            );


            const unread =
                Array.isArray(response)
                    ? response
                    : [];


            setUnreadMessages(
                unread
            );


        } catch (err) {

            console.error(
                "LOAD UNREAD ERROR:",
                err
            );

            setUnreadMessages([]);
        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadUsers();
        loadUnreadMessages();


        const interval =
            setInterval(() => {

                loadUnreadMessages();

            }, 3000);


        const handleUnreadUpdate =
            () => {

                loadUnreadMessages();
                loadConversations();
            };


        window.addEventListener(
            "unreadCountUpdated",
            handleUnreadUpdate
        );


        return () => {

            clearInterval(
                interval
            );

            window.removeEventListener(
                "unreadCountUpdated",
                handleUnreadUpdate
            );
        };

    }, []);


    // =====================================================
    // LOAD CONVERSATIONS AFTER USERS ARE LOADED
    // =====================================================

    useEffect(() => {

        if (people.length > 0) {

            loadConversations();

        } else {

            const currentUser =
                getCurrentUser();

            if (!currentUser) {
                setLoadingConversations(false);
            }
        }

    }, [people]);


    // =====================================================
    // UNREAD COUNT FOR USER
    // =====================================================

    const getUnreadCountForPerson =
        (personId) => {

            const currentUser =
                getCurrentUser();


            if (!currentUser) {
                return 0;
            }


            const currentUserId =
                Number(
                    currentUser.userId ??
                    currentUser.id
                );


            return unreadMessages.filter(
                (message) => {

                    const senderId =
                        Number(
                            message.senderId
                        );

                    const receiverId =
                        Number(
                            message.receiverId
                        );


                    return (

                        senderId ===
                        Number(personId)

                        &&

                        receiverId ===
                        currentUserId

                        &&

                        (
                            message.isRead === false
                            ||
                            message.isRead === undefined
                        )
                    );
                }
            ).length;
        };


    // =====================================================
    // TOTAL UNREAD
    // =====================================================

    const totalUnreadMessages =
        unreadMessages.filter(
            (message) =>
                message.isRead === false
                ||
                message.isRead === undefined
        ).length;


    // =====================================================
    // SEARCH CONVERSATIONS
    // =====================================================

    const filteredConversations =
        useMemo(() => {

            const text =
                search
                    .trim()
                    .toLowerCase();


            if (!text) {

                return conversations;
            }


            return conversations.filter(
                (person) =>
                    person.name
                        .toLowerCase()
                        .includes(text)

                    ||

                    person.username
                        .toLowerCase()
                        .includes(text)
            );

        }, [
            conversations,
            search
        ]);


    // =====================================================
    // SEARCH PEOPLE FOR NEW MESSAGE
    // =====================================================

    const filteredPeople =
        useMemo(() => {

            const text =
                personSearch
                    .trim()
                    .toLowerCase();


            if (!text) {
                return people;
            }


            return people.filter(
                (person) =>
                    person.name
                        .toLowerCase()
                        .includes(text)

                    ||

                    person.username
                        .toLowerCase()
                        .includes(text)
            );

        }, [
            people,
            personSearch
        ]);


    // =====================================================
    // OPEN CHAT
    // =====================================================

    const openChat =
        (userId) => {

            navigate(
                `/chat/${userId}`
            );
        };


    // =====================================================
    // START NEW MESSAGE
    // =====================================================

    const startConversation =
        (person) => {

            setShowNewMessage(false);
            setPersonSearch("");

            navigate(
                `/chat/${person.id}`
            );
        };


    // =====================================================
    // UI
    // =====================================================

    return (

        <AppLayout>

            <div className="page-container messages-page">


                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="page-heading">

                    <div>

                        <p className="eyebrow">
                            DIRECT MESSAGES
                        </p>

                        <h1>
                            Messages
                        </h1>

                        <p className="page-description">
                            Chat with users registered on the platform.
                        </p>

                    </div>


                    <button
                        className="primary-button"
                        onClick={() =>
                            setShowNewMessage(true)
                        }
                    >
                        + New message
                    </button>

                </div>


                {/* =========================================
                    MESSAGE LAYOUT
                ========================================= */}

                <div className="messages-layout card">


                    {/* =====================================
                        LEFT SIDE
                    ===================================== */}

                    <section className="conversation-panel">


                        {/* SEARCH */}

                        <div className="conversation-search">

                            <span>
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Search conversations"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* HEADER */}

                        <div className="conversation-header">

                            <h3>
                                Conversations
                            </h3>

                            <span>
                                {conversations.length}
                            </span>

                        </div>


                        {/* LIST */}

                        <div className="conversation-list">


                            {/* LOADING */}

                            {loadingConversations && (

                                <div className="no-conversations">

                                    Loading conversations...

                                </div>

                            )}


                            {/* EMPTY */}

                            {!loadingConversations &&
                                filteredConversations.length === 0 && (

                                    <div className="no-conversations">

                                        <p>
                                            No conversations yet.
                                        </p>

                                        <small>
                                            Click "New message" to start chatting.
                                        </small>

                                    </div>

                                )}


                            {/* CONVERSATIONS */}

                            {!loadingConversations &&

                                filteredConversations.map(
                                    (person) => {

                                        const unreadCount =
                                            getUnreadCountForPerson(
                                                person.id
                                            );


                                        return (

                                            <button
                                                className="conversation"
                                                key={person.id}
                                                onClick={() =>
                                                    openChat(
                                                        person.id
                                                    )
                                                }
                                            >


                                                {/* AVATAR */}

                                                <div className="conversation-avatar">

                                                    <div className="avatar">

                                                        {
                                                            person.avatar
                                                        }

                                                    </div>

                                                </div>


                                                {/* INFO */}

                                                <div className="conversation-info">

                                                    <div className="conversation-top">

                                                        <strong>
                                                            {
                                                                person.name
                                                            }
                                                        </strong>

                                                    </div>


                                                    <div className="conversation-bottom">

                                                        <p>
                                                            @
                                                            {
                                                                person.username
                                                            }
                                                        </p>


                                                        {unreadCount > 0 && (

                                                            <span
                                                                className="nav-badge message-unread-badge"
                                                            >
                                                                {
                                                                    unreadCount
                                                                }
                                                            </span>

                                                        )}

                                                    </div>

                                                </div>

                                            </button>

                                        );
                                    }
                                )}

                        </div>

                    </section>


                    {/* =====================================
                        RIGHT SIDE
                    ===================================== */}

                    <section className="message-empty">

                        <div className="empty-chat-icon">
                            💬
                        </div>

                        <h2>
                            Your messages
                        </h2>

                        <p>
                            Select a conversation from the left
                            or start a new message.
                        </p>

                        <button
                            className="primary-button"
                            onClick={() =>
                                setShowNewMessage(true)
                            }
                        >
                            Start a conversation
                        </button>

                    </section>

                </div>


                {/* =========================================
                    NEW MESSAGE MODAL
                ========================================= */}

                {showNewMessage && (

                    <div
                        className="new-message-overlay"
                        onClick={() =>
                            setShowNewMessage(false)
                        }
                    >

                        <div
                            className="new-message-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >


                            {/* HEADER */}

                            <div className="new-message-header">

                                <div>

                                    <p className="eyebrow">
                                        NEW MESSAGE
                                    </p>

                                    <h2>
                                        Start a conversation
                                    </h2>

                                </div>


                                <button
                                    className="modal-close"
                                    onClick={() =>
                                        setShowNewMessage(false)
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            {/* SEARCH */}

                            <div className="new-message-search">

                                <span>
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search people..."
                                    value={personSearch}
                                    onChange={(e) =>
                                        setPersonSearch(
                                            e.target.value
                                        )
                                    }
                                    autoFocus
                                />

                            </div>


                            {/* PEOPLE */}

                            <div className="new-message-people">

                                <p className="people-title">
                                    USERS FROM DATABASE
                                </p>


                                {loading ? (

                                    <div className="no-people">
                                        Loading users...
                                    </div>

                                ) : filteredPeople.length === 0 ? (

                                    <div className="no-people">
                                        No people found.
                                    </div>

                                ) : (

                                    filteredPeople.map(
                                        (person) => (

                                            <button
                                                className="message-person"
                                                key={person.id}
                                                onClick={() =>
                                                    startConversation(
                                                        person
                                                    )
                                                }
                                            >

                                                <div className="person-avatar-wrapper">

                                                    <div className="avatar">

                                                        {
                                                            person.avatar
                                                        }

                                                    </div>

                                                </div>


                                                <div className="person-info">

                                                    <strong>
                                                        {
                                                            person.name
                                                        }
                                                    </strong>

                                                    <span>
                                                        @
                                                        {
                                                            person.username
                                                        }
                                                    </span>

                                                </div>


                                                <span className="chat-arrow">
                                                    →
                                                </span>

                                            </button>

                                        )
                                    )

                                )}

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </AppLayout>
    );
}


export default Messages;