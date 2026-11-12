package br.com.sistemas.chamados.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.sistemas.chamados.dto.*;
import br.com.sistemas.chamados.entity.*;
import br.com.sistemas.chamados.exception.RecursoNaoEncontradoException;
import br.com.sistemas.chamados.exception.RegraNegocioException;
import br.com.sistemas.chamados.repository.*;

@Service
public class ChamadoService {

    private final ChamadoRepository repository;
    private final ClienteRepository clienteRepository;
    private final CategoriaRepository categoriaRepository;
    private final TecnicoRepository tecnicoRepository;

    public ChamadoService(
        ChamadoRepository repository,
        ClienteRepository clienteRepository,
        CategoriaRepository categoriaRepository,
        TecnicoRepository tecnicoRepository
    ) {
        this.repository = repository;
        this.clienteRepository = clienteRepository;
        this.categoriaRepository = categoriaRepository;
        this.tecnicoRepository = tecnicoRepository;
    }

    @Transactional
    public ChamadoResponse criar(ChamadoRequest dto) {
        Chamado chamado = new Chamado();
        chamado.setTitulo(dto.titulo());
        chamado.setDescricao(dto.descricao());
        chamado.setPrioridade(validarPrioridade(dto.prioridade()));
        chamado.setStatus("ABERTO");
        chamado.setCliente(buscarCliente(dto.clienteId()));
        chamado.setCategoria(buscarCategoria(dto.categoriaId()));

        if (dto.tecnicoId() != null) {
            chamado.setTecnico(buscarTecnico(dto.tecnicoId()));
        }

        return ChamadoResponse.de(repository.save(chamado));
    }

    @Transactional(readOnly = true)
    public List<ChamadoResponse> listar(
        String status,
        String prioridade,
        Long categoriaId,
        Long tecnicoId,
        Long clienteId
    ) {
        return repository.findAll().stream()
            .filter(c -> status == null || status.isBlank()
                || c.getStatus().equalsIgnoreCase(status))
            .filter(c -> prioridade == null || prioridade.isBlank()
                || c.getPrioridade().equalsIgnoreCase(prioridade))
            .filter(c -> categoriaId == null
                || c.getCategoria().getId().equals(categoriaId))
            .filter(c -> tecnicoId == null
                || (c.getTecnico() != null
                    && c.getTecnico().getId().equals(tecnicoId)))
            .filter(c -> clienteId == null
                || c.getCliente().getId().equals(clienteId))
            .map(ChamadoResponse::de)
            .toList();
    }

    @Transactional(readOnly = true)
    public ChamadoResponse buscar(Long id) {
        return ChamadoResponse.de(buscarEntity(id));
    }

    @Transactional
    public ChamadoResponse atualizarStatus(Long id, String status) {
        Chamado chamado = buscarEntity(id);

        if (status == null || status.isBlank()) {
            throw new RegraNegocioException("Status é obrigatório");
        }

        String statusNormalizado = status.trim().toUpperCase();

        if (!List.of("ABERTO", "EM_ANDAMENTO", "PENDENTE", "FECHADO", "CANCELADO")
                .contains(statusNormalizado)) {
            throw new RegraNegocioException("Status inválido");
        }

        chamado.setStatus(statusNormalizado);
        chamado.setDataFechamento(
            statusNormalizado.equals("FECHADO")
                ? java.time.LocalDateTime.now()
                : null
        );

        return ChamadoResponse.de(chamado);
    }

    @Transactional
    public ChamadoResponse atribuirTecnico(Long id, Long tecnicoId) {
        Chamado chamado = buscarEntity(id);
        chamado.setTecnico(buscarTecnico(tecnicoId));
        return ChamadoResponse.de(chamado);
    }

    @Transactional
    public ChamadoResponse atualizar(Long id, ChamadoRequest dto) {
        Chamado chamado = buscarEntity(id);

        chamado.setTitulo(dto.titulo());
        chamado.setDescricao(dto.descricao());
        chamado.setPrioridade(validarPrioridade(dto.prioridade()));
        chamado.setCliente(buscarCliente(dto.clienteId()));
        chamado.setCategoria(buscarCategoria(dto.categoriaId()));
        chamado.setTecnico(
            dto.tecnicoId() == null ? null : buscarTecnico(dto.tecnicoId())
        );

        return ChamadoResponse.de(chamado);
    }

    @Transactional
    public void excluir(Long id) {
        repository.delete(buscarEntity(id));
    }

    private String validarPrioridade(String prioridade) {
        if (prioridade == null) {
            throw new RegraNegocioException("Prioridade é obrigatória");
        }

        String valor = prioridade.trim().toUpperCase();

        if (!List.of("BAIXA", "MEDIA", "MÉDIA", "ALTA", "CRITICA", "CRÍTICA")
                .contains(valor)) {
            throw new RegraNegocioException("Prioridade inválida");
        }

        return valor.equals("MÉDIA") ? "MEDIA"
            : valor.equals("CRÍTICA") ? "CRITICA" : valor;
    }

    private Chamado buscarEntity(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Chamado " + id + " não encontrado"
            ));
    }

    private Cliente buscarCliente(Long id) {
        return clienteRepository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Cliente " + id + " não encontrado"
            ));
    }

    private Categoria buscarCategoria(Long id) {
        return categoriaRepository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Categoria " + id + " não encontrada"
            ));
    }

    private Tecnico buscarTecnico(Long id) {
        return tecnicoRepository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Técnico " + id + " não encontrado"
            ));
    }
}