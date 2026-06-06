import { 
  Component, 
  OnInit, 
  OnDestroy, 
  inject, 
  ViewChild, 
  ElementRef, 
  AfterViewChecked 
} from '@angular/core';
import { Router } from '@angular/router'; 
import { APP_ROUTES } from '../../../core/constants/app-routes'; 
import { FinalChatService } from './service/final-chat.service';
import { FinalChatViewModel } from './model/final-chat-view-model.interface';
import { FinalChatMessageApiItem } from './model/final-chat-api.interface';

@Component({
  selector: 'app-final-chat-page',
  standalone: false,
  templateUrl: './final-chat.component.html',
  styleUrls: ['./final-chat.component.css'],
})
export class FinalChatPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  private readonly finalChatService = inject(FinalChatService);
  private readonly router = inject(Router); 

  @ViewChild('chatScrollContainer') private chatScrollContainer!: ElementRef<HTMLDivElement>;
  
  private observer?: MutationObserver;
  private yaInstanciadoScroll = false;

  public get chatTimeline(): FinalChatMessageApiItem[] {
    return this.finalChatService.chatTimeline;
  }

  public get vm(): FinalChatViewModel {
    return this.finalChatService.getViewModel();
  }

  public get partido(): any {
    return this.vm.data;
  }

  public get golesLocal(): number {
    const scoreString = this.partido?.score;
    if (!scoreString || !scoreString.includes('-')) {
      return this.partido?.homeTeamScore ?? this.partido?.scoreHome ?? 0;
    }
    const partes = scoreString.split('-');
    return parseInt(partes[0], 10) || 0;
  }

  public get golesVisitante(): number {
    const scoreString = this.partido?.score;
    if (!scoreString || !scoreString.includes('-')) {
      return this.partido?.awayTeamScore ?? this.partido?.scoreAway ?? 0;
    }
    const partes = scoreString.split('-');
    return parseInt(partes[1], 10) || 0;
  }

  public get esPartidoFinalizado(): boolean {
    if (!this.chatTimeline || this.chatTimeline.length === 0) {
      return false;
    }
    return this.chatTimeline.some(item => (item as any).type === 'FINAL');
  }

  ngOnInit(): void {
    // 1. Inicializa configuraciones de idioma
    this.finalChatService.initialize();

    /* 2. DETECTAR EL F5 Y REENGANCHAR:
      Si el historial local quedó en 0 por el refresco pero la propiedad 'partido' 
      ya tiene información (gracias al getter que lee del servicio), 
      gatillamos la llamada automáticamente para rellenar el feed.
    */
    if (this.chatTimeline.length === 0 && this.partido) {
      this.clickIniciarPartido();
    }
  }

  /**
   * FUNCIÓN NUEVA: Se vincula al botón de la UI para arrancar o reenganchar el partido a demanda
   */
  public clickIniciarPartido(): void {
    this.finalChatService.comenzarPartido().subscribe();
  }

  ngAfterViewChecked(): void {
    if (this.chatScrollContainer && !this.yaInstanciadoScroll && this.partido) {
      this.configurarAutoScrollReactivo();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  public seleccionarOpcion(index: number): void {
    if (this.vm.sending) return;
    
    this.finalChatService.playTurn(index).subscribe({
      next: () => {
        if (this.chatTimeline && this.chatTimeline.length > 0 && this.partido) {
          
          // REEMPLAZO: Buscamos el último marcador recorriendo el array al revés de forma clásica
          let mensajeConMarcador: any = null;
          for (let i = this.chatTimeline.length - 1; i >= 0; i--) {
            const item = this.chatTimeline[i] as any;
            if (item.homeTeamScore !== undefined || item.scoreHome !== undefined) {
              mensajeConMarcador = item;
              break; // Cortamos el bucle, ya encontramos el último que se cargó
            }
          }

          if (mensajeConMarcador) {
            this.partido.homeTeamScore = mensajeConMarcador.homeTeamScore ?? mensajeConMarcador.scoreHome ?? this.partido.homeTeamScore;
            this.partido.awayTeamScore = mensajeConMarcador.awayTeamScore ?? mensajeConMarcador.scoreAway ?? this.partido.awayTeamScore;
          }

          const ultimoEstado = this.chatTimeline[this.chatTimeline.length - 1] as any;
          if (ultimoEstado) {
            this.partido.minute = ultimoEstado.minute ?? this.partido.minute;
            this.partido.turn = ultimoEstado.turn ?? this.partido.turn;
            if (ultimoEstado.zone) this.partido.zone = ultimoEstado.zone;
            if (ultimoEstado.possession) this.partido.possession = ultimoEstado.possession;
          }
        }
      }
    });
  }

  public salirAlMenu(): void {
    this.finalChatService.resetearEstado();
    this.router.navigate([APP_ROUTES.worldCup.simulate]);
  }

  private configurarAutoScrollReactivo(): void {
    const elementoScroll = this.chatScrollContainer?.nativeElement;
    if (!elementoScroll) return;

    this.yaInstanciadoScroll = true;

    this.observer = new MutationObserver(() => {
      elementoScroll.scrollTo({
        top: elementoScroll.scrollHeight,
        behavior: 'smooth'
      });
    });

    this.observer.observe(elementoScroll, {
      childList: true,
      subtree: true
    });

    elementoScroll.scrollTop = elementoScroll.scrollHeight;
  }
}