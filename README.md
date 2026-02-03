> nestjs-skeleton

Skeleton para proyectos con NestJS donde la **lógica de dominio** y la **implementación de infraestructura** están **aisladas** de NestJS.

## Principios del proyecto

- **Dominio puro**: `src/domain` no depende de NestJS ni de Prisma. Solo contiene entidades, value objects, validaciones y casos de uso.
- **Infraestructura aislada**: `src/data` implementa repositorios concretos (por ejemplo Prisma) y depende del dominio, no de NestJS.
- **NestJS solo como delivery**: módulos, controllers y DTOs viven en `src/[modulo]/api` y solo hacen wiring + transporte. No contienen reglas de negocio.
- **Inyección por tokens**: los repositorios se registran en Nest con tokens (`src/tokens`) para mantener el acoplamiento bajo.

Si cambia NestJS por otro framework (Express, Hono, etc.), **el `domain` y `data` de cada módulo deben seguir funcionando sin modificaciones**. Solo cambia la capa `api`.

## Estructura recomendada (por módulo)

Para escalar mejor, se recomienda agrupar dominio/implementation/api dentro de cada módulo:

```
src/
  products/
    domain/
      entities/
      repositories/
      usecases/
    data/          # Implementaciones concretas (Prisma)
    api/           # Controllers, DTOs, módulos NestJS
  sales/
    domain/
    data/
    api/
  tokens/          # Tokens DI por módulo o compartidos
  prisma/          # PrismaModule y servicios de infraestructura
```

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
