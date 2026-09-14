import type { Person } from "../../models/f4";

/** Pessoas da DEMO, uma por cargo da mentoria, mais os fornecedores. */
export const PEOPLE: Record<string, Person> = {
  leticia: { id: 1, name: "Letícia Moraes", email: "leticia.moraes@renault.com.br", role: "PFE" },
  bruno: { id: 2, name: "Bruno Tavares", email: "bruno.tavares@renault.com.br", role: "PFE" },
  helena: { id: 3, name: "Helena Prado", email: "helena.prado@renault.com.br", role: "IST" },
  rafael: { id: 4, name: "Rafael Souza", email: "rafael.souza@renault.com.br", role: "BUYER" },
  carla: { id: 5, name: "Carla Nunes", email: "carla.nunes@renault.com.br", role: "BUYER" },
  silvia: { id: 6, name: "Sílvia Rocha", email: "silvia.rocha@renault.com.br", role: "RSPM" },
  marcos: { id: 7, name: "Marcos Vieira", email: "marcos.vieira@renault.com.br", role: "PPM" },
  ana: { id: 8, name: "Ana Ribeiro", email: "ana.ribeiro@renault.com.br", role: "CVE" },
  joana: { id: 9, name: "Joana Lima", email: "joana.lima@renault.com.br", role: "CPSC" },
  andrade: { id: 20, name: "M. Andrade", email: "contato@andrade.ind.br", role: "SUPPLIER" },
  plasttech: { id: 21, name: "PlastTech", email: "kam@plasttech.com.br", role: "SUPPLIER" },
  eletrosis: { id: 22, name: "EletroSis", email: "comercial@eletrosis.com.br", role: "SUPPLIER" },
};
