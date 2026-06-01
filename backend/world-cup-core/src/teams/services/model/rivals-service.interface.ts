
export interface HistoricalRivalApiItem {
  id: string;
  name: string
}

export interface EnrichedRivalApiItem extends HistoricalRivalApiItem {
  group: string;               
  footballAssociation: string; 
  rating: number;              
  coach: string;               
  captain: string;             
  strategy: string;            
  formation: string;           
  creationDate?: string;       
  lastUpdate?: string;         
}