export interface RivalItem {
  id: string;
  name: string;
}


export interface RivalsApiResponse {
  serverTime: string;
  data: RivalItem[]; 
  responseMessage: {
    messageCode: string;
    message: string;
  };
  success: boolean;
}