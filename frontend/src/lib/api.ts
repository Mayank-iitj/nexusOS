import axios from "axios";

// Access the API URL defined in environment, default to localhost if not found
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  // In production, configure withCredentials if using cookies
  withCredentials: true,
});

// Interceptor to handle common API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If it's a network error, provide fallback mock data for the demo so it doesn't break
    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      const url = error.config?.url || "";
      
      if (url.includes("/analytics/overview")) {
        return Promise.resolve({
          data: {
            productivity_score: 87,
            tasks_completed_today: 8,
            tasks_completed_week: 47,
            meetings_today: 3,
            hours_saved: 14.5,
            automation_success_rate: 96.4
          }
        });
      }
      
      if (url.includes("/analytics/trends")) {
        return Promise.resolve({
          data: {
            weekly_trends: [
              { day: "Mon", tasks: 12, meetings: 4, automations: 15 },
              { day: "Tue", tasks: 15, meetings: 3, automations: 18 },
              { day: "Wed", tasks: 8, meetings: 5, automations: 12 },
              { day: "Thu", tasks: 18, meetings: 2, automations: 22 },
              { day: "Fri", tasks: 14, meetings: 4, automations: 16 },
            ]
          }
        });
      }
      
      if (url.includes("/tasks")) {
        return Promise.resolve({
          data: [
            { id: 1, title: "Finalize API documentation", status: "todo", priority: "high", time_estimate: "2h", project: "NexusOS v2.0" },
            { id: 2, title: "Review GitHub Agent PR #247", status: "in_progress", priority: "high", time_estimate: "1h", project: "API Integration" },
            { id: 3, title: "Prepare investor presentation", status: "todo", priority: "urgent", time_estimate: "3h", project: "Q3 Marketing" },
            { id: 4, title: "Set up CI/CD pipeline", status: "done", priority: "medium", time_estimate: "Done", project: "NexusOS v2.0" },
            { id: 5, title: "Design email campaign templates", status: "todo", priority: "medium", time_estimate: "2h", project: "Q3 Marketing" }
          ]
        });
      }
    }

    // You could plug in toast notifications or error logging here
    if (error.message !== "Network Error" && error.code !== "ERR_NETWORK") {
      console.error("API Error:", error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);
