export interface IPontosTuristicosService {
  buscarFeed(filtros: Record<string, any>): Promise<any[]>;
  criar(dados: any, usuarioId: string): Promise<any>;
  editar(id: string, dados: any, usuarioId: string): Promise<any>;
  deletar(id: string, usuarioId: string): Promise<void>;
}
