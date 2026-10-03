import { apiService } from './api.service'

export interface LeaderboardUser {
  id: string
  name: string
  points: number
  tier: string
  totalReports: number
  verifiedReports: number
  rank?: number
}

export const leaderboardService = {
  subscribeToLeaderboard: (callback: (users: LeaderboardUser[]) => void) => {
    // Instead of Firestore onSnapshot (which fails security rules for citizens),
    // we poll the secure backend API endpoint every 30 seconds.
    let isSubscribed = true;

    const fetchLeaderboard = async () => {
      try {
        const users = await apiService.get<LeaderboardUser[]>('/leaderboard');
        if (isSubscribed) {
          callback(users);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }
}
