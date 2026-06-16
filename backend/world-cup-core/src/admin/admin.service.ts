import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LanguageEnum } from '../basic/model/language.enum';
import { WorldCupApiService } from '../basic/world-cup-api.service';
import { getTeamTheme, TeamTheme } from './team-themes.config';

interface WorldCupResponse<T> {
  data: T;
}

@Injectable()
export class AdminService {
  private currentTeamId: string;
  private currentLang: LanguageEnum;

  constructor(
    private readonly configService: ConfigService,
    private readonly worldCupApiService: WorldCupApiService,
  ) {
    this.currentTeamId = this.configService.get<string>('TEAM_ID', 'tun').toLowerCase();
    this.currentLang = this.configService.get<LanguageEnum>('APP_LANG', LanguageEnum.DEFAULT);
  }

  public getCurrentTeamId(): string {
    return this.currentTeamId;
  }

  public getCurrentLang(): LanguageEnum {
    return this.currentLang;
  }

  public async setCurrentTeamId(teamId: string): Promise<void> {
    const normalizedTeamId = this.getValidatedTeamId(teamId);
    await this.ensureTeamExists(normalizedTeamId);
    this.currentTeamId = normalizedTeamId;
  }

  public setCurrentLang(lang: string): void {
    this.currentLang = lang as LanguageEnum;
  }

  public async applyConfig(body: { teamId?: string; lang?: string }): Promise<{
    teamId: string;
    lang: LanguageEnum;
    theme: TeamTheme;
  }> {
    if (body.teamId !== undefined) {
      if (typeof body.teamId !== 'string') {
        throw new BadRequestException({
          messageCode: 'ADMIN_TEAM_ID_INVALID',
          message: 'teamId must be a string.',
        });
      }

      await this.setCurrentTeamId(body.teamId);
    }

    if (body.lang !== undefined) {
      if (typeof body.lang !== 'string') {
        throw new BadRequestException({
          messageCode: 'ADMIN_LANG_INVALID',
          message: 'lang must be a string.',
        });
      }

      this.setCurrentLang(body.lang);
    }

    return this.getCurrentConfig();
  }

  public getCurrentTheme(): TeamTheme {
    return getTeamTheme(this.currentTeamId);
  }

  public getCurrentConfig(): { teamId: string; lang: LanguageEnum; theme: TeamTheme } {
    return {
      teamId: this.currentTeamId,
      lang: this.currentLang,
      theme: this.getCurrentTheme(),
    };
  }

  public async getCurrentTeamInfo(): Promise<{ team: unknown; theme: TeamTheme; lang: LanguageEnum }> {
    const team = await this.findTeamById(this.currentTeamId);
    if (!team) {
      throw new NotFoundException({
        messageCode: 'ADMIN_TEAM_NOT_FOUND',
        message: `Team '${this.currentTeamId}' was not found.`,
      });
    }

    return {
      team,
      theme: this.getCurrentTheme(),
      lang: this.currentLang,
    };
  }

  public async getAllTeams(): Promise<unknown[]> {
    const response = await this.worldCupApiService.get<WorldCupResponse<unknown[]>>('/teams');
    return response.data ?? [];
  }

  private getValidatedTeamId(teamId: string): string {
    if (!teamId) {
      throw new BadRequestException({
        messageCode: 'ADMIN_TEAM_ID_REQUIRED',
        message: 'teamId is required.',
      });
    }

    return teamId;
  }

  private async ensureTeamExists(teamId: string): Promise<void> {
    const team = await this.findTeamById(teamId);
    if (!team) {
      throw new NotFoundException({
        messageCode: 'ADMIN_TEAM_NOT_FOUND',
        message: `Team '${teamId}' was not found.`,
      });
    }
  }

  private async findTeamById(teamId: string): Promise<unknown | null> {
    const response = await this.worldCupApiService.get<WorldCupResponse<unknown[]>>('/teams', {
      teamId,
    });
    const teams = Array.isArray(response?.data) ? response.data : [];
    return teams[0] ?? null;
  }

}
