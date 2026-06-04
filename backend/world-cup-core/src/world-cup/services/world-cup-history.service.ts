import { Injectable } from '@nestjs/common'; 
import { AdminService } from '../../admin/admin.service'; 
import { AbstractBaseService } from '../../basic/abstract-base.service'; 

@Injectable()
export class WorldCupHistoryService extends AbstractBaseService {

  constructor(adminService: AdminService) {
    super(adminService);
  }

  async getHistory() {
    const lang = this.resolveLang(); 

    return {
      success: true,
      responseMessage: {
        messageCode: "0000",
        message: lang === 'es' ? "Historial cargado con éxito" : "History loaded successfully"
      },
      data: {
        teamId: "tun",
        name: lang === 'es' ? "Túnez" : "Tunisia",
        topScorer: "Wahbi Khazri",
        appearances: 6,
        history: [
          { year: 2022, host: "Qatar", maxStage: "Fase de Grupos", position: 21, gamesWon: 1, gamesDrawn: 1, gamesLost: 1, goalsFor: 1, goalsAgainst: 1 },
          { year: 2018, host: "Rusia", maxStage: "Fase de Grupos", position: 24, gamesWon: 1, gamesDrawn: 0, gamesLost: 2, goalsFor: 2, goalsAgainst: 4 },
          { year: 2006, host: "Alemania", maxStage: "Fase de Grupos", position: 27, gamesWon: 0, gamesDrawn: 1, gamesLost: 2, goalsFor: 3, goalsAgainst: 9 },
          { year: 2002, host: "Corea-Japón", maxStage: "Fase de Grupos", position: 29, gamesWon: 0, gamesDrawn: 1, gamesLost: 2, goalsFor: 1, goalsAgainst: 5 },
          { year: 1998, host: "Francia", maxStage: "Fase de Grupos", position: 26, gamesWon: 0, gamesDrawn: 1, gamesLost: 2, goalsFor: 1, goalsAgainst: 4 },
          { year: 1978, host: "Argentina", maxStage: "Fase de Grupos", position: 9, gamesWon: 1, gamesDrawn: 1, gamesLost: 1, goalsFor: 3, goalsAgainst: 2 }
        ]
      }
    };
  }
}