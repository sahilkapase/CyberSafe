import { toast } from "sonner";

export interface UserSummary {
    id: number;
    username: string;
    email: string;
    full_name?: string;
    role?: string;
    avatar_url?: string;
    has_red_tag: boolean;
    is_blocked: boolean;
}

export interface FriendRequestDetail {
    id: number;
    status: "pending" | "accepted" | "rejected";
    created_at: string;
    sender: UserSummary;
    receiver: UserSummary;
}


export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
export const BASE_URL = API_BASE_URL.replace('/api/v1', '');

export const getAssetUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Helper to get token
const getToken = () => localStorage.getItem("token");

// Helper for headers
const getHeaders = (isMultipart = false) => {
    const headers: HeadersInit = {};
    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    if (!isMultipart) {
        headers["Content-Type"] = "application/json";
    }
    return headers;
};

// Generic request handler
const request = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = getHeaders(options.body instanceof FormData);

    const config = {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        // Handle 401 Unauthorized (logout)
        if (response.status === 401) {
            localStorage.removeItem("token");
            // Optional: Redirect to login if not already there
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
            throw new Error("Session expired. Please login again.");
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Something went wrong");
        }

        return data;
    } catch (error: any) {
        console.error(`API Error (${endpoint}):`, error);
        // Don't toast for 401 as we handle it above, unless it's login page
        if (error.message !== "Session expired. Please login again." || window.location.pathname.includes("/login")) {
            toast.error(error.message);
        }
        throw error;
    }
};

export const apiClient = {
    // Auth
    login: async (email: string, password: string) => {
        const formData = new FormData();
        formData.append("username", email); // FastAPI OAuth2 expects 'username'
        formData.append("password", password);

        const data = await request("/auth/login", {
            method: "POST",
            // FormData automatically sets Content-Type to multipart/form-data with boundary
            // We need to override the default JSON header behavior for this specific call
            body: formData,
        });

        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
        }
        return data;
    },

    socialLogin: async (email: string, username: string, provider: string, avatarUrl?: string) => {
        const data = await request("/auth/social-login", {
            method: "POST",
            body: JSON.stringify({
                email,
                username,
                provider,
                avatar_url: avatarUrl
            }),
        });

        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
        }
        return data;
    },

    signup: async (userData: any) => {
        return request("/auth/signup", {
            method: "POST",
            body: JSON.stringify(userData),
        });
    },

    getMe: async () => {
        return request("/auth/me");
    },

    // Friends
    getFriendsList: async () => {
        return request("/friends/list");
    },

    getFriends: async () => {
        return request("/friends/list");
    },

    getReceivedFriendRequests: async () => {
        return request("/friends/requests/received");
    },

    getFriendRequests: async () => {
        return request("/friends/requests");
    },

    searchUsers: async (query: string) => {
        return request(`/friends/search?query=${encodeURIComponent(query)}`);
    },

    sendFriendRequest: async (receiverId: number) => {
        return request("/friends/request", {
            method: "POST",
            body: JSON.stringify({ receiver_id: receiverId }),
        });
    },

    addFriend: async (userId: number) => {
        return apiClient.sendFriendRequest(userId);
    },

    respondToFriendRequest: async (requestId: number, status: "accepted" | "rejected") => {
        return request(`/friends/request/${requestId}`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        });
    },

    acceptFriendRequest: async (requestId: number) => {
        return apiClient.respondToFriendRequest(requestId, "accepted");
    },

    // Messages
    getConversations: async () => {
        return request("/messages/conversations");
    },

    getConversation: async (userId: number) => {
        return request(`/messages/conversation/${userId}`);
    },

    getMessages: async (userId: number) => {
        return apiClient.getConversation(userId);
    },

    sendMessage: async (receiverId: number, content: string, messageType: "text" | "image" = "text", fileUrl?: string) => {
        return request("/messages/send", {
            method: "POST",
            body: JSON.stringify({
                receiver_id: receiverId,
                content,
                message_type: messageType,
                file_url: fileUrl
            }),
        });
    },

    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return request("/messages/upload-image", {
            method: "POST",
            body: formData,
        });
    },

    // Support & Reporting
    getMentalHealthResources: async () => {
        return request("/support/resources");
    },

    chatWithCounselor: async (message: string) => {
        return request("/support/chat", {
            method: "POST",
            body: JSON.stringify({ message, history: [] }),
        });
    },

    mentalHealthChat: async (message: string) => {
        return apiClient.chatWithCounselor(message);
    },

    reportIncident: async (data: { reported_user_id: number; reason: string; description: string; message_id?: number }) => {
        return request("/support/report", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    // Utils
    setToken: (token: string | null) => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    },

    // Placeholder for missing backend endpoint
    blockUserDirectly: async (userId: number) => {
        return request(`/users/block/${userId}`, {
            method: "POST",
        });
    },

    // Admin
    getUsers: async () => {
        return request("/admin/users");
    },
    blockUser: async (userId: number) => {
        return request(`/admin/users/${userId}/block`, {
            method: "POST"
        });
    },
    unblockUser: async (userId: number) => {
        return request(`/admin/users/${userId}/unblock`, {
            method: "POST"
        });
    },
    getReports: async () => {
        return request("/admin/reports");
    },
    resolveReport: async (reportId: number) => {
        return request(`/admin/reports/${reportId}/resolve`, {
            method: "POST"
        });
    },
    getIncidents: async () => {
        return request("/admin/incidents");
    }
};

export default apiClient;
