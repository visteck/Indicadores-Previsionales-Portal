// Tipos para los datos de la API
export interface AFPItem {
  CodigoSuper: string;
  Cotizacion: string;
  Comision: string;
  CargoTrabajador: number;
  CargoEmpleador: number;
  TotalPagar: number;
}

export interface AFPData {
  [key: string]: AFPItem;
}

export interface TramoImpuestoUnico {
  tramoInferior: number;
  tramoSuperior: number | null;
  factor: number;
  rebaja: number;
}

export interface SeguroCesantiaItem {
  empleador: number;
  trabajador: number;
}

export interface SeguroCesantiaData {
  periodo: string;
  PlazoIndefinido: SeguroCesantiaItem;
  PlazoFijo: SeguroCesantiaItem;
  PlazoIndefinido11: SeguroCesantiaItem;
  CasaParticular: SeguroCesantiaItem;
  fecha_actualizacion: string;
  fuente: string;
}

export interface TramoAsignacion {
  monto: number;
  requisitos: {
    minimo: number;
    maximo: number;
  };
  descripcion: string;
}

export interface AsignacionFamiliarData {
  periodo: string;
  tramos: {
    A: TramoAsignacion;
    B: TramoAsignacion;
    C: TramoAsignacion;
    D: TramoAsignacion;
  };
  fecha_actualizacion: string;
  fuente: string;
}

export interface IndicadoresData {
  periodo: string;
  SIS: number;
  UF: number;
  UFAnterior: number;
  UTM: number;
  UTA: number;
  TopeImponibleAFP_UF: number;
  TopeImponibleSC_UF: number;
  TopeImponibleIPS_UF: number;
  RentaMinima: number;
  ExpectativaVida: number;
  RentabilidadProtegida: number;
  timestamp: string;
  AFP: AFPData;
  impuestoUnico: {
    periodo: string;
    tramosImpuestoUnico: TramoImpuestoUnico[];
    metadata: {
    descripcion: string;
    vigencia: string;
    fuente: string;
    actualizacion: string;
    };
  };
  asignacionFamiliar: AsignacionFamiliarData;
  seguroCesantia: SeguroCesantiaData;
}

export interface CacheInfo {
  lastUpdate: string;
  source: 'database' | 'fresh';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  version: string;

  cache: CacheInfo;
}
