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
import { FinalChatMessageApiItem, MatchStrategyApiItem, MatchFormationApiItem} from './model/final-chat-api.interface';

@Component({
  selector: 'app-final-chat-page',
  standalone: false,
  templateUrl: './final-chat.component.html',
  styleUrls: ['./final-chat.component.css'],
})
export class FinalChatPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  private readonly finalChatService = inject(FinalChatService);
  private readonly router = inject(Router); 
  public estrategiaSeleccionada: string = '';
  public formacionSeleccionada: string = '';

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

  public get estrategiasDisponibles(): MatchStrategyApiItem[] {
    return this.vm.availableStrategies;
  }

  public get formacionesDisponibles(): MatchFormationApiItem[] {
    return this.vm.availableFormations;
  }

ngOnInit(): void {

    this.finalChatService.initialize();


if (this.chatTimeline.length === 0 && this.partido) {
      this.finalChatService.comenzarPartido().subscribe({
        next: () => {
          this.finalChatService.cargarEstrategiasDisponibles().subscribe();
          this.finalChatService.cargarFormacionesDisponibles().subscribe();
          
          // Sincronizamos las variables para que el HTML dibuje la opción correcta por defecto
          if (this.partido) {
            this.estrategiaSeleccionada = this.partido.teamStrategy || '';
            this.formacionSeleccionada = this.partido.teamFormation || '';
          }
        }
      });
    } else if (this.partido) {

      this.estrategiaSeleccionada = this.partido.teamStrategy || '';
      this.formacionSeleccionada = this.partido.teamFormation || '';
    }
  }


  public clickIniciarPartido(): void {
    this.finalChatService.comenzarPartido().subscribe({
      next: () => {
        if (this.partido) {

          this.finalChatService.cargarEstrategiasDisponibles().subscribe();
          this.finalChatService.cargarFormacionesDisponibles().subscribe();

          this.estrategiaSeleccionada = this.partido.teamStrategy || '';
          this.formacionSeleccionada = this.partido.teamFormation || '';
        }
      }
    });
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
              break; 
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
  public onEstrategiaCambiada(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const nuevaEstrategia = selectElement.value;
    
    if (!nuevaEstrategia || this.vm.sending) return;

    this.estrategiaSeleccionada = nuevaEstrategia;


    this.finalChatService.cambiarEstrategiaPartido(nuevaEstrategia).subscribe({
      next: () => {
        console.log('Estrategia actualizada con éxito en el backend.');
      }
    });
  }

  public onFormacionCambiada(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const nuevaFormacion = selectElement.value;
    
    if (!nuevaFormacion || this.vm.sending) return;

    this.formacionSeleccionada = nuevaFormacion;


    this.finalChatService.cambiarFormacionPartido(nuevaFormacion).subscribe({
      next: () => {
        console.log('Formación actualizada con éxito en el backend.');
      }
    });
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