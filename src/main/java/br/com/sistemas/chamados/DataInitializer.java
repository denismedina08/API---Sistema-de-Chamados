package br.com.sistemas.chamados;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import br.com.sistemas.chamados.entity.Categoria;
import br.com.sistemas.chamados.entity.Chamado;
import br.com.sistemas.chamados.entity.Cliente;
import br.com.sistemas.chamados.entity.Tecnico;
import br.com.sistemas.chamados.repository.CategoriaRepository;
import br.com.sistemas.chamados.repository.ChamadoRepository;
import br.com.sistemas.chamados.repository.ClienteRepository;
import br.com.sistemas.chamados.repository.TecnicoRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            ClienteRepository clienteRepository,
            CategoriaRepository categoriaRepository,
            TecnicoRepository tecnicoRepository,
            ChamadoRepository chamadoRepository) {
        return args -> {
            if (clienteRepository.count() > 0) {
                return;
            }

            // Clientes
            Cliente c1 = new Cliente("Andre Santana", "andre.cabeca@email.com", "(47) 99999-1111");
            Cliente c2 = new Cliente("Cholito Lima", "cholito.lima@email.com", "(47) 99999-2222");
            clienteRepository.save(c1);
            clienteRepository.save(c2);

            // Categorias
            Categoria cat1 = new Categoria("Hardware", "Problemas físicos com computadores e impressoras, etc.");
            Categoria cat2 = new Categoria("Redes e Conectividade", "Falhas de conexão com a internet e Wi-Fi.");
            Categoria cat3 = new Categoria("Sistemas e Aplicativos", "Instalar/Desinstalar/Atualizar aplicações.");
            categoriaRepository.save(cat1);
            categoriaRepository.save(cat2);
            categoriaRepository.save(cat3);

            // Tecnicos
            Tecnico t1 = new Tecnico();
            t1.setNome("Denis Medina");
            t1.setEmail("denis.crusado@univille.com");
            t1.setPerfil("TECNICO");
            tecnicoRepository.save(t1);

            Tecnico t2 = new Tecnico();
            t2.setNome("Joilson Mendez");
            t2.setEmail("joilson.mendez@univille.com");
            t2.setPerfil("TECNICO");
            tecnicoRepository.save(t2);

            // Chamados
            Chamado ch1 = new Chamado();
            ch1.setTitulo("Computador não liga");
            ch1.setDescricao("Monitor não recebe vídeo e começou a aquecer bastante.");
            ch1.setPrioridade("ALTA");
            ch1.setStatus("ABERTO");
            ch1.setDataAbertura(LocalDateTime.now().minusDays(2));
            ch1.setCliente(c1);
            ch1.setCategoria(cat1);
            chamadoRepository.save(ch1);

            System.out.println(">> Dados predefinidos inseridos com sucesso no H2!");
        };
    }
}