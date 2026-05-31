import { Component, OnInit } from '@angular/core';
import { RivalsService } from './service/rivals.service'; 
import { RivalsViewModel } from './model/rivals-view-model.interface'; 

@Component({
  selector: 'app-rivals-page',
  standalone: false,
  templateUrl: './rivals.component.html',
  styleUrls: ['./rivals.component.css'],
})
export class RivalsPageComponent implements OnInit {

  // Inyección del servicio para manejar la lógica de negocio y red de esta sección
  constructor(private readonly rivalsService: RivalsService) {}

  // Getter para que el HTML consuma el estado reactivo del servicio en tiempo real
  get pageState(): RivalsViewModel {
    return this.rivalsService.getViewModel();
  }

  // Evento de arranque del componente: acá se dispara la petición inicial a la API
  public ngOnInit(): void {
    this.rivalsService.initialize();
  }
}