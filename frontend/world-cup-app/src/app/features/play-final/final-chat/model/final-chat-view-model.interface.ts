import { FinalChatApiResponse, FinalChatTeamsPreviewApiResponse,MatchStrategyApiItem,MatchFormationApiItem } from './final-chat-api.interface';

export interface FinalChatViewModel {
  lang: 'es' | 'en';
  loading: boolean;
  starting: boolean;
  sending: boolean;
  changingTactic: boolean; 
  errorMessage: string;
  actionErrorMessage: string;
  showNoFinalState: boolean;
  data: FinalChatApiResponse | null;
  teamsPreview: FinalChatTeamsPreviewApiResponse | null;
  // Catálogos cargados desde el backend
  availableStrategies: MatchStrategyApiItem[]; // <-- NUEVO
  availableFormations: MatchFormationApiItem[]; // <-- NUEVO
}
