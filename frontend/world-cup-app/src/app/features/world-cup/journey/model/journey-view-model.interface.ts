import { JourneyApiResponse } from './journey-api.interface';

export interface JourneyViewModel {
  loading: boolean;
  error: boolean;
  noData: boolean;
  data: JourneyApiResponse | null;
}