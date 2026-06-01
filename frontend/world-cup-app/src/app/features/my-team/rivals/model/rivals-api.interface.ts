// VIEJO:
// export interface RivalItem {
//   id: string;
//   name: string;
// }

// NUEVO: Estructura extendida con la data unificada del backend
export interface RivalItem {
  id: string;
  name: string;
  group?: string;               // ej: "CAF"
  footballAssociation?: string; // Confederación (ej: CAF, CONMEBOL)
  rating?: number;              // Rating overall (0-100)
  coach?: string;               // Nombre del entrenador
  captain?: string;             // Nombre del capitán
  strategy?: string;            // Estrategia actual
  formation?: string;           // Formación (ej: 4-3-3)
}