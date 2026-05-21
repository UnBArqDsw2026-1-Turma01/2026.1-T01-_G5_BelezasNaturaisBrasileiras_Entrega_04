import { Trilha } from './entities/Trilha';
import { TrilhaStatus } from './enums/TrilhaStatus';
import { Inscricao } from '../../inscricoes/domain/entities/Inscricao';
import { InscricaoStatus } from '../../inscricoes/domain/enums/InscricaoStatus';

const makeTrilha = (status: TrilhaStatus = TrilhaStatus.ATIVA): Trilha =>
  new Trilha(
    'trilha-1',
    'Chapada dos Veadeiros',
    'Trilha bonita',
    'org-1',
    'Portaria Norte',
    new Date('2026-06-01'),
    20,
    status,
  );

const makeInscricao = (
  status: InscricaoStatus = InscricaoStatus.PENDENTE,
): Inscricao => new Inscricao('insc-1', 'trilha-1', 'user-1', status, null);

// ─── Trilha — State ─────────────────────────────────────────────────────────

describe('Trilha — State', () => {
  describe('finalizar()', () => {
    it('deve transitar de ATIVA para INATIVA', () => {
      const trilha = makeTrilha(TrilhaStatus.ATIVA);
      trilha.finalizar();
      expect(trilha.status).toBe(TrilhaStatus.INATIVA);
    });

    it('deve transitar de LOTADA para INATIVA', () => {
      const trilha = makeTrilha(TrilhaStatus.LOTADA);
      trilha.finalizar();
      expect(trilha.status).toBe(TrilhaStatus.INATIVA);
    });

    it('deve lançar erro ao tentar finalizar uma trilha já INATIVA', () => {
      const trilha = makeTrilha(TrilhaStatus.INATIVA);
      expect(() => trilha.finalizar()).toThrow('Trilha já está finalizada');
    });

    it('deve lançar erro ao tentar finalizar mais de uma vez', () => {
      const trilha = makeTrilha(TrilhaStatus.ATIVA);
      trilha.finalizar();
      expect(() => trilha.finalizar()).toThrow('Trilha já está finalizada');
    });
  });

  describe('marcarLotada()', () => {
    it('deve transitar de ATIVA para LOTADA', () => {
      const trilha = makeTrilha(TrilhaStatus.ATIVA);
      trilha.marcarLotada();
      expect(trilha.status).toBe(TrilhaStatus.LOTADA);
    });

    it('deve permitir finalizar após marcar como lotada', () => {
      const trilha = makeTrilha(TrilhaStatus.ATIVA);
      trilha.marcarLotada();
      trilha.finalizar();
      expect(trilha.status).toBe(TrilhaStatus.INATIVA);
    });
  });
});

// ─── Inscricao — State ──────────────────────────────────────────────────────

describe('Inscricao — State', () => {
  describe('aceitar()', () => {
    it('deve transitar de PENDENTE para ACEITA e armazenar o código', () => {
      const insc = makeInscricao(InscricaoStatus.PENDENTE);
      insc.aceitar('ABC-123');
      expect(insc.status).toBe(InscricaoStatus.ACEITA);
      expect(insc.codigoConfirmacao).toBe('ABC-123');
      expect(insc.aceitoEm).toBeInstanceOf(Date);
    });

    it('deve lançar erro ao aceitar inscrição que não está PENDENTE', () => {
      const insc = makeInscricao(InscricaoStatus.ACEITA);
      expect(() => insc.aceitar('XYZ')).toThrow(
        'Apenas inscrições pendentes podem ser aceitas',
      );
    });

    it('deve lançar erro ao aceitar inscrição REJEITADA', () => {
      const insc = makeInscricao(InscricaoStatus.REJEITADA);
      expect(() => insc.aceitar('XYZ')).toThrow(
        'Apenas inscrições pendentes podem ser aceitas',
      );
    });
  });

  describe('rejeitar()', () => {
    it('deve transitar de PENDENTE para REJEITADA', () => {
      const insc = makeInscricao(InscricaoStatus.PENDENTE);
      insc.rejeitar();
      expect(insc.status).toBe(InscricaoStatus.REJEITADA);
    });

    it('deve lançar erro ao rejeitar inscrição ACEITA', () => {
      const insc = makeInscricao(InscricaoStatus.ACEITA);
      expect(() => insc.rejeitar()).toThrow(
        'Apenas inscrições pendentes podem ser rejeitadas',
      );
    });

    it('deve lançar erro ao rejeitar inscrição já REJEITADA', () => {
      const insc = makeInscricao(InscricaoStatus.PENDENTE);
      insc.rejeitar();
      expect(() => insc.rejeitar()).toThrow(
        'Apenas inscrições pendentes podem ser rejeitadas',
      );
    });
  });

  describe('fazerCheckin()', () => {
    it('deve transitar de ACEITA para PRESENTE e registrar timestamp', () => {
      const insc = makeInscricao(InscricaoStatus.ACEITA);
      insc.fazerCheckin();
      expect(insc.status).toBe(InscricaoStatus.PRESENTE);
      expect(insc.checkinEm).toBeInstanceOf(Date);
    });

    it('deve lançar erro ao fazer check-in em inscrição PENDENTE', () => {
      const insc = makeInscricao(InscricaoStatus.PENDENTE);
      expect(() => insc.fazerCheckin()).toThrow(
        'Apenas inscrições aceitas podem fazer check-in',
      );
    });

    it('deve lançar erro ao fazer check-in em inscrição REJEITADA', () => {
      const insc = makeInscricao(InscricaoStatus.REJEITADA);
      expect(() => insc.fazerCheckin()).toThrow(
        'Apenas inscrições aceitas podem fazer check-in',
      );
    });

    it('deve lançar erro ao fazer check-in em inscrição já PRESENTE', () => {
      const insc = makeInscricao(InscricaoStatus.ACEITA);
      insc.fazerCheckin();
      expect(() => insc.fazerCheckin()).toThrow(
        'Apenas inscrições aceitas podem fazer check-in',
      );
    });
  });

  describe('fluxo completo PENDENTE → ACEITA → PRESENTE', () => {
    it('deve permitir o ciclo de vida completo de uma inscrição', () => {
      const insc = makeInscricao();

      expect(insc.status).toBe(InscricaoStatus.PENDENTE);

      insc.aceitar('CODE-42');
      expect(insc.status).toBe(InscricaoStatus.ACEITA);

      insc.fazerCheckin();
      expect(insc.status).toBe(InscricaoStatus.PRESENTE);
    });
  });
});
