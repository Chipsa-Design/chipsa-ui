# Настройка нового компонента

Пользователь предоставит имя компонента. Выполни следующие шаги:

## 1. Добавить компонент в registry.json

Добавь запись в `apps/www/registry.json` в массив `items`. Структура зависит от типа компонента:

- Если компонент находится в `packages/astro/src/components/{ComponentName}/`, добавь запись типа `registry:component` или `registry:block`
- Укажи правильные пути к файлам компонента
- Если есть зависимости, добавь их в массив `dependencies`

Пример для компонента в `packages/astro/src/components/{ComponentName}/`:
```json
{
    "name": "{component-name}",
    "type": "registry:component",
    "title": "{ComponentName} (Astro)",
    "description": "Описание компонента",
    "files": [
        {
            "path": "../../packages/astro/src/components/{ComponentName}/{ComponentName}.astro",
            "type": "registry:component"
        },
        {
            "path": "../../packages/astro/src/components/{ComponentName}/index.ts",
            "type": "registry:component"
        }
    ],
    "dependencies": []
}
```

## 2. Создать документацию

Создай файл `apps/www/src/content/docs/components/{component-name}.mdx` со следующей структурой:

```mdx
---
title: {ComponentName}
description: Краткое описание компонента
---

import {ComponentName} from '@astro/components/{component-name}/{ComponentName}.astro';
import Preview from '@astrobook/utils/Preview.astro';
import { TabItem, Tabs } from '@astrojs/starlight/components';

<Preview name="{component-name}">
    <!-- Пример использования компонента -->
</Preview>

## Описание

Подробное описание компонента и его назначения.

## Основные возможности

- Возможность 1
- Возможность 2
- Возможность 3

## API

### Props

#### `propName` (required/optional)

`type` — описание пропа.

## Использование

### Базовое использование

```astro
---
import {ComponentName} from '@astro/components/{component-name}/{ComponentName}.astro';
---

<ComponentName prop="value" />
```

## Примеры

Добавь дополнительные примеры использования, если необходимо.
```

## 3. Создать astrobook демо

Создай файл `apps/www/src/astrobook/components/{ComponentName}.stories.ts`:

```typescript
import {ComponentName} from '@astro/components/{component-name}/{ComponentName}.astro';
import Center from '@astrobook/decorators/Center.astro';
import type { ComponentProps } from 'astro/types';

type {ComponentName}Props = ComponentProps<typeof {ComponentName}>;

export default {
    component: {ComponentName},
};

export const Default = {
    args: {
        // базовые пропсы компонента
    } satisfies {ComponentName}Props,
    decorators: [{ component: Center }],
};
```

Если нужен более сложный пример, создай также `apps/www/src/astrobook/components/{ComponentName}Example.astro`:

```astro
---
import {ComponentName} from '@astro/components/{component-name}/{ComponentName}.astro';

const { prop } = Astro.props;
---

<ComponentName prop={prop}>
    <!-- содержимое примера -->
</ComponentName>
```

И обнови stories файл, чтобы использовать Example компонент (как в Popup.stories.ts).

## Важно

- Используй kebab-case для имен файлов и путей
- Используй PascalCase для имен компонентов в коде
- Проверь, что все пути корректны относительно структуры проекта
- Если компонент уже существует, не перезаписывай его без необходимости

