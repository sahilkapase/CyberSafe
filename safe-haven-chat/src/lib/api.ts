import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

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
    getFriends: async () => {
        return request("/friends");
    },

    searchUsers: async (query: string) => {
        return request(`/friends/search?query=${encodeURIComponent(query)}`);
    },

    addFriend: async (userId: number) => {
        return request(`/friends/request/${userId}`, { method: "POST" });
    },

    acceptFriendRequest: async (requestId: number) => {
        return request(`/friends/accept/${requestId}`, { method: "POST" });
    },

    // Messages
    getConversations: async () => {
        return request("/messages/conversations");
    },

    getMessages: async (userId: number) => {
        return request(`/messages/conversation/${userId}`);
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

    // Support
    getMentalHealthResources: async () => {
        return request("/support/resources");
    },

    chatWithCounselor: async (message: string) => {
        return request("/support/chat", {
            method: "POST",
            body: JSON.stringify({ message }),
        });
    }
};
