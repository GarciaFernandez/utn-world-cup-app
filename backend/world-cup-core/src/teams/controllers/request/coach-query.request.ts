import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CoachQueryRequest {

    
    @ApiPropertyOptional({ example: 'tun' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MaxLength(3)
    teamId?: string;

    @IsOptional()
    @ApiPropertyOptional({ example: 'es' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MaxLength(2)
    lang?: string;
    
}

export class SaveStrategyRequest {

    @ApiPropertyOptional({ example: 'tun' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MaxLength(3)
    teamId: string;

    @ApiPropertyOptional({ example: 'ATTACK' })
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    strategy: string;

    @ApiPropertyOptional({ example: 'es' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MaxLength(2)
    lang?: string; 
}

export class SaveFormationRequest {
    @ApiPropertyOptional({ example: 'tun' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MaxLength(3)
    teamId: string;

    @ApiPropertyOptional({ example: '4-4-2' })
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    formation: string;

    @ApiPropertyOptional({ example: 'es' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MaxLength(2)
    lang?: string; 
}

export class ResetTeamTacticsRequest {
    @ApiPropertyOptional({ example: 'tun' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MaxLength(3)
    teamId: string;
}