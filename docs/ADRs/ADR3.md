# ADR-003: Estratégia de Autenticação com JWT

**Status:** Aprovado  
**Data:** 03/07/2025

## Contexto
A API precisava proteger rotas restritas com uma solução segura, stateless e compatível com SPAs em React. Era necessário prevenir vulnerabilidades como XSS.

## Decisão
Implementamos autenticação baseada em JWT, com o token enviado em cookies seguros (HttpOnly, Secure, SameSite=Strict). O middleware `authMiddleware.js` valida o token a cada requisição.

## Consequências

**Positivas:**
- **Segurança Reforçada contra XSS:** Tokens inacessíveis via JavaScript.
- **Frontend Simplificado:** Cookies são enviados automaticamente.
- **Stateless:** Facilita a escalabilidade.
- **Padrão Robusto:** Abordagem compatível com SPAs modernas.

**Negativas:**
- **Proteção contra CSRF:** Requer tokens anti-CSRF.
- **Configuração de CORS:** Requer configuração detalhada entre domínios.

---