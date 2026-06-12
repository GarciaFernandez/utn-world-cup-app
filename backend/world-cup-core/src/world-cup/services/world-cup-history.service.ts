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
        message:
          lang === 'es'
            ? "Historial cargado con éxito"
            : "History loaded successfully"
      },

      data: {
        teamId: "tun",
        name:
          lang === 'es'
            ? "Túnez"
            : "Tunisia",

        fifaCode: "TUN",

        appearances: 6,

        bestResult:
          lang === 'es'
            ? "Fase de Grupos"
            : "Group Stage",

        topScorer: {
          name: "Wahbi Khazri",
          goals: 3
        },

        totalStats: {
          matchesPlayed: 18,
          wins: 3,
          draws: 5,
          losses: 10,
          goalsFor: 14,
          goalsAgainst: 26
        },

        history: [
          {
            year: 1978,
            host: lang === 'es' ? "Argentina" : "Argentina",
            maxStage: lang === 'es' ? "Fase de Grupos" : "Group Stage",
            position: 9,
            gamesWon: 1,
            gamesDrawn: 1,
            gamesLost: 1,
            goalsFor: 3,
            goalsAgainst: 2,
            matches: [
              { opponent: lang === 'es' ? "México" : "Mexico", result: "3-1", outcome: "win" },
              { opponent: lang === 'es' ? "Polonia" : "Poland", result: "0-1", outcome: "loss" },
              { opponent: lang === 'es' ? "Alemania Federal" : "West Germany", result: "0-0", outcome: "draw" }
            ]
          },
          {
            year: 1998,
            host: lang === 'es' ? "Francia" : "France",
            maxStage: lang === 'es' ? "Fase de Grupos" : "Group Stage",
            position: 26,
            gamesWon: 0,
            gamesDrawn: 1,
            gamesLost: 2,
            goalsFor: 1,
            goalsAgainst: 4,
            matches: [
              { opponent: lang === 'es' ? "Inglaterra" : "England", result: "0-2", outcome: "loss" },
              { opponent: lang === 'es' ? "Colombia" : "Colombia", result: "0-1", outcome: "loss" },
              { opponent: lang === 'es' ? "Rumania" : "Romania", result: "1-1", outcome: "draw" }
            ]
          },
          {
            year: 2002,
            host: lang === 'es' ? "Corea-Japón" : "Korea-Japan",
            maxStage: lang === 'es' ? "Fase de Grupos" : "Group Stage",
            position: 29,
            gamesWon: 0,
            gamesDrawn: 1,
            gamesLost: 2,
            goalsFor: 1,
            goalsAgainst: 5,
            matches: [
              { opponent: lang === 'es' ? "Rusia" : "Russia", result: "0-2", outcome: "loss" },
              { opponent: lang === 'es' ? "Bélgica" : "Belgium", result: "1-1", outcome: "draw" },
              { opponent: lang === 'es' ? "Japón" : "Japan", result: "0-2", outcome: "loss" }
            ]
          },
          {
            year: 2006,
            host: lang === 'es' ? "Alemania" : "Germany",
            maxStage: lang === 'es' ? "Fase de Grupos" : "Group Stage",
            position: 27,
            gamesWon: 0,
            gamesDrawn: 1,
            gamesLost: 2,
            goalsFor: 3,
            goalsAgainst: 6,
            matches: [
              { opponent: lang === 'es' ? "Arabia Saudita" : "Saudi Arabia", result: "2-2", outcome: "draw" },
              { opponent: lang === 'es' ? "España" : "Spain", result: "1-3", outcome: "loss" },
              { opponent: lang === 'es' ? "Ucrania" : "Ukraine", result: "0-1", outcome: "loss" }
            ]
          },
          {
            year: 2018,
            host: lang === 'es' ? "Rusia" : "Russia",
            maxStage: lang === 'es' ? "Fase de Grupos" : "Group Stage",
            position: 24,
            gamesWon: 1,
            gamesDrawn: 0,
            gamesLost: 2,
            goalsFor: 5,
            goalsAgainst: 8,
            matches: [
              { opponent: lang === 'es' ? "Inglaterra" : "England", result: "1-2", outcome: "loss" },
              { opponent: lang === 'es' ? "Bélgica" : "Belgium", result: "2-5", outcome: "loss" },
              { opponent: lang === 'es' ? "Panamá" : "Panama", result: "2-1", outcome: "win" }
            ]
          },
          {
            year: 2022,
            host: lang === 'es' ? "Qatar" : "Qatar",
            maxStage: lang === 'es' ? "Fase de Grupos" : "Group Stage",
            position: 21,
            gamesWon: 1,
            gamesDrawn: 1,
            gamesLost: 1,
            goalsFor: 1,
            goalsAgainst: 1,
            matches: [
              { opponent: lang === 'es' ? "Dinamarca" : "Denmark", result: "0-0", outcome: "draw" },
              { opponent: lang === 'es' ? "Australia" : "Australia", result: "0-1", outcome: "loss" },
              { opponent: lang === 'es' ? "Francia" : "France", result: "1-0", outcome: "win" }
            ]
          }
        ]
      }
    };
  }
}
