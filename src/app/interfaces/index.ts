// User interfaces
export interface User {
  id_usuario: number;
  username: string;
  email: string;
  name: string | null;
  bio: string | null;
  profile_pic: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Game interfaces (IGDB)
export interface Game {
  id: number;
  name: string;
  slug?: string;
  summary?: string;
  storyline?: string;
  rating?: number;
  rating_count?: number;
  first_release_date?: number;
  release_date?: string | null;
  cover?: string | null;
  genres?: string[];
  platforms?: string[];
  developers?: string[];
  library_count?: number;
  log_count?: number;
}

export interface Genre {
  id: number;
  name: string;
  slug?: string;
}

export interface Platform {
  id: number;
  name: string;
  abbreviation?: string;
}

export interface InvolvedCompany {
  id: number;
  company: Company;
  developer?: boolean;
  publisher?: boolean;
}

export interface Company {
  id: number;
  name: string;
}

export interface Screenshot {
  id: number;
  image_id: string;
  url?: string;
}

export interface Video {
  id: number;
  video_id: string;
  name?: string;
}

// Game Log interfaces
export interface GameLog {
  id_log: number;
  user_id: number;
  igdb_game_id: number;
  comment: string | null;
  play_date: string | null;
  hours: number | null;
  created_at?: string;
  username?: string;
  profile_pic?: string | null;
  game?: Game;
  participants?: LogParticipant[];
}

export interface CreateLogRequest {
  igdb_game_id: number;
  comment?: string;
  play_date?: string;
  hours?: number;
  participant_ids?: number[];
}

export interface UpdateLogRequest {
  comment?: string;
  play_date?: string;
  hours?: number;
}

export interface LogParticipant {
  id: number;
  log_id: number;
  user_id: number;
  status: 'pending' | 'accepted';
  created_at: string;
  username?: string;
  profile_pic?: string | null;
}

export interface PendingParticipation {
  id: number;
  log_id: number;
  user_id: number;
  status: 'pending';
  created_at: string;
  log?: GameLog;
}

// Library interfaces
export interface LibraryItem {
  id: number;
  user_id: number;
  igdb_game_id: number;
  added_at: string;
  game?: Game;
}

export interface AddToLibraryRequest {
  igdb_game_id: number;
}

// Friends interfaces
export interface Friend {
  id: number;
  status: 'pending' | 'accepted';
  created_at: string;
  id_usuario: number;
  username: string;
  name: string | null;
  profile_pic: string | null;
}

export interface FriendRequest {
  id: number;
  user_id: number;
  friend_id: number;
  status: 'pending';
  created_at: string;
  user?: User;
}

// API Response wrappers
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  limit?: number;
  offset?: number;
}
