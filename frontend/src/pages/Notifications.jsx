import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import AppLayout from "../components/AppLayout";

import {
    notificationAPI
} from "../services/notificationService";

import {
    userAPI
} from "../services/userService";

import {
    useAuth
} from "../context/AuthContext";

import {
    useNavigate
} from "react-router-dom";


function Notifications() {

    const { user } = useAuth();

    const navigate =
        useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [
        notifications,
        setNotifications
    ] = useState([]);

    const [
        users,
        setUsers
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);


    // =====================================================
    // LOAD NOTIFICATIONS + USERS
    // =====================================================

    useEffect(() => {

        if (user?.userId) {

            loadData();

        }

    }, [
        user?.userId
    ]);


    const loadData = async () => {

        try {

            setLoading(true);


            // =================================================
            // LOAD NOTIFICATIONS
            // =================================================

            const notificationData =
                await notificationAPI.getNotifications(
                    user.userId
                );


            // =================================================
            // LOAD USERS
            // =================================================

            const userData =
                await userAPI.getAllUsers();


            // -------------------------------------------------
            // Handle response.data OR direct array
            // -------------------------------------------------

            const notificationList =
                Array.isArray(notificationData)
                    ? notificationData
                    : Array.isArray(
                        notificationData?.data
                    )
                        ? notificationData.data
                        : [];


            const userList =
                Array.isArray(userData)
                    ? userData
                    : Array.isArray(
                        userData?.data
                    )
                        ? userData.data
                        : [];


            console.log(
                "NOTIFICATIONS:",
                notificationList
            );


            console.log(
                "USERS:",
                userList
            );


            setNotifications(
                notificationList
            );


            setUsers(
                userList
            );


        } catch (error) {

            console.error(
                "NOTIFICATION LOAD ERROR:",
                error
            );


            setNotifications([]);

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FIND SENDER NAME
    // =====================================================

    const getSenderName = (
        senderId
    ) => {

        const sender =
            users.find(
                (u) => {

                    const id =
                        Number(
                            u.userId ??
                            u.id
                        );


                    return (
                        id ===
                        Number(senderId)
                    );

                }
            );


        if (!sender) {

            return "Someone";

        }


        return (
            sender.username ??
            sender.name ??
            sender.email ??
            "Someone"
        );

    };


    // =====================================================
    // GROUP NOTIFICATIONS
    // =====================================================

    const groupedNotifications =
        useMemo(() => {

            const result = [];

            const messageGroups =
                new Map();


            notifications.forEach(
                (notification) => {

                    // =================================================
                    // MESSAGE NOTIFICATIONS
                    // =================================================

                    if (
                        notification.type ===
                        "MESSAGE"
                        &&
                        notification.senderId
                    ) {

                        const senderId =
                            Number(
                                notification.senderId
                            );


                        const groupKey =
                            `MESSAGE_${senderId}`;


                        // ---------------------------------------------
                        // First message from this sender
                        // ---------------------------------------------

                        if (
                            !messageGroups.has(
                                groupKey
                            )
                        ) {

                            const group = {

                                id:
                                    groupKey,

                                type:
                                    "MESSAGE",

                                senderId:
                                    senderId,

                                notifications: [
                                    notification
                                ],

                                count:
                                    1,

                                unreadCount:
                                    notification.read
                                        ? 0
                                        : 1,

                                latestCreatedAt:
                                    notification.createdAt,

                                latestMessage:
                                    notification.message

                            };


                            messageGroups.set(
                                groupKey,
                                group
                            );


                            result.push(
                                group
                            );

                        }

                        // ---------------------------------------------
                        // Existing sender group
                        // ---------------------------------------------

                        else {

                            const group =
                                messageGroups.get(
                                    groupKey
                                );


                            group.notifications.push(
                                notification
                            );


                            group.count =
                                group.count + 1;


                            if (
                                !notification.read
                            ) {

                                group.unreadCount =
                                    group.unreadCount + 1;

                            }


                            // -----------------------------------------
                            // Keep latest notification
                            // -----------------------------------------

                            const currentDate =
                                new Date(
                                    notification.createdAt
                                );


                            const latestDate =
                                new Date(
                                    group.latestCreatedAt
                                );


                            if (
                                currentDate >
                                latestDate
                            ) {

                                group.latestCreatedAt =
                                    notification.createdAt;

                                group.latestMessage =
                                    notification.message;

                            }

                        }


                    } else {

                        // =================================================
                        // NON-MESSAGE NOTIFICATIONS
                        // Keep them individually
                        // =================================================

                        result.push({

                            id:
                                `NOTIFICATION_${notification.id}`,

                            type:
                                notification.type,

                            senderId:
                                notification.senderId,

                            notifications: [
                                notification
                            ],

                            count:
                                1,

                            unreadCount:
                                notification.read
                                    ? 0
                                    : 1,

                            latestCreatedAt:
                                notification.createdAt,

                            latestMessage:
                                notification.message

                        });

                    }

                }
            );


            // =================================================
            // SORT BY LATEST NOTIFICATION
            // =================================================

            result.sort(
                (a, b) => {

                    return (
                        new Date(
                            b.latestCreatedAt
                        ) -
                        new Date(
                            a.latestCreatedAt
                        )
                    );

                }
            );


            console.log(
                "GROUPED NOTIFICATIONS:",
                result
            );


            return result;

        }, [
            notifications
        ]);


    // =====================================================
    // DELETE NOTIFICATION GROUP + OPEN CHAT
    // =====================================================

    const handleNotificationClick =
        async (group) => {

            try {

                // =================================================
                // MESSAGE GROUP
                // =================================================

                if (
                    group.type ===
                    "MESSAGE"
                ) {

                    const notificationIds =
                        group.notifications
                            .map(
                                (notification) =>
                                    notification.id
                            );


                    // ---------------------------------------------
                    // Remove group immediately from UI
                    // ---------------------------------------------

                    setNotifications(
                        currentNotifications =>
                            currentNotifications.filter(
                                notification =>
                                    !notificationIds.includes(
                                        notification.id
                                    )
                            )
                    );


                    // ---------------------------------------------
                    // Delete all grouped notifications
                    // ---------------------------------------------

                    await Promise.all(
                        notificationIds.map(
                            (id) =>
                                notificationAPI
                                    .deleteNotification(
                                        id
                                    )
                        )
                    );


                    // ---------------------------------------------
                    // Update navbar unread count
                    // ---------------------------------------------

                    window.dispatchEvent(
                        new Event(
                            "unreadCountUpdated"
                        )
                    );


                    // ---------------------------------------------
                    // Open sender's chat
                    // ---------------------------------------------

                    if (
                        group.senderId
                    ) {

                        navigate(
                            `/chat/${group.senderId}`
                        );

                    }


                    return;
                }


                // =================================================
                // NORMAL NOTIFICATION
                // =================================================

                const notification =
                    group.notifications[0];


                // ---------------------------------------------
                // Remove from UI immediately
                // ---------------------------------------------

                setNotifications(
                    current =>
                        current.filter(
                            item =>
                                item.id !==
                                notification.id
                        )
                );


                // ---------------------------------------------
                // Delete from database
                // ---------------------------------------------

                await notificationAPI
                    .deleteNotification(
                        notification.id
                    );


                // ---------------------------------------------
                // Update navbar unread count
                // ---------------------------------------------

                window.dispatchEvent(
                    new Event(
                        "unreadCountUpdated"
                    )
                );


                // ---------------------------------------------
                // MESSAGE fallback
                // ---------------------------------------------

                if (
                    notification.type ===
                    "MESSAGE"
                    &&
                    notification.senderId
                ) {

                    navigate(
                        `/chat/${notification.senderId}`
                    );

                }


            } catch (error) {

                console.error(
                    "DELETE NOTIFICATION ERROR:",
                    error
                );


                // Reload if something failed
                loadData();

            }

        };


    // =====================================================
    // ICON
    // =====================================================

    const getNotificationIcon =
        (type) => {

            switch (type) {

                case "LIKE":
                    return "❤️";

                case "COMMENT":
                    return "💬";

                case "FOLLOW":
                    return "👤";

                case "MESSAGE":
                    return "✉️";

                default:
                    return "🔔";

            }

        };


    // =====================================================
    // MESSAGE TEXT
    // =====================================================

    const getNotificationMessage =
        (group) => {

            // =================================================
            // MESSAGE GROUP
            // =================================================

            if (
                group.type ===
                "MESSAGE"
            ) {

                if (
                    group.count === 1
                ) {

                    // One message
                    return (
                        group.latestMessage ||
                        "You received a new message"
                    );

                }


                // Multiple messages
                return (
                    `You received ${group.count} new messages`
                );

            }


            // =================================================
            // NORMAL NOTIFICATION
            // =================================================

            return (
                group.latestMessage ||
                "You have a new notification"
            );

        };


    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate =
        (date) => {

            if (!date) {
                return "";
            }


            return new Date(
                date
            ).toLocaleString(
                "en-IN",
                {
                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric",

                    hour:
                        "2-digit",

                    minute:
                        "2-digit"
                }
            );

        };


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
                            ACTIVITY
                        </p>


                        <h1>
                            Notifications
                        </h1>


                        <p className="page-description">
                            Stay updated with what's happening around your account.
                        </p>

                    </div>

                </div>


                {/* =========================================
                    NOTIFICATION CARD
                ========================================= */}

                <div className="card">

                    {loading ? (

                        // =================================================
                        // LOADING
                        // =================================================

                        <div className="empty-state">

                            Loading notifications...

                        </div>

                    ) : groupedNotifications.length === 0 ? (

                        // =================================================
                        // EMPTY
                        // =================================================

                        <div className="empty-state">

                            <div className="empty-icon">
                                🔔
                            </div>


                            <h3>
                                No notifications
                            </h3>


                            <p>
                                You're all caught up.
                            </p>

                        </div>

                    ) : (

                        // =================================================
                        // NOTIFICATIONS
                        // =================================================

                        groupedNotifications.map(
                            (group) => {

                                const senderName =
                                    group.type ===
                                    "MESSAGE"

                                        ? getSenderName(
                                            group.senderId
                                        )

                                        : group.type ||
                                          "Notification";


                                const isUnread =
                                    group.unreadCount >
                                    0;


                                return (

                                    <div
                                        key={
                                            group.id
                                        }

                                        className={
                                            `notification-item ${
                                                isUnread
                                                    ? "unread"
                                                    : ""
                                            }`
                                        }

                                        onClick={() =>
                                            handleNotificationClick(
                                                group
                                            )
                                        }
                                    >


                                        {/* =================================
                                            ICON
                                        ================================= */}

                                        <div className="notification-icon">

                                            {
                                                getNotificationIcon(
                                                    group.type
                                                )
                                            }

                                        </div>


                                        {/* =================================
                                            CONTENT
                                        ================================= */}

                                        <div className="notification-content">


                                            {/* SENDER */}

                                            <strong>
                                                {
                                                    senderName
                                                }
                                            </strong>


                                            {/* MESSAGE */}

                                            <p>

                                                {
                                                    getNotificationMessage(
                                                        group
                                                    )
                                                }

                                            </p>


                                            {/* DATE */}

                                            <span>

                                                {
                                                    formatDate(
                                                        group.latestCreatedAt
                                                    )
                                                }

                                            </span>

                                        </div>


                                        {/* =================================
                                            UNREAD DOT
                                        ================================= */}

                                        {isUnread && (

                                            <span
                                                className="unread-dot"
                                            />

                                        )}

                                    </div>

                                );

                            }
                        )

                    )}

                </div>

            </div>

        </AppLayout>
    );
}


export default Notifications;