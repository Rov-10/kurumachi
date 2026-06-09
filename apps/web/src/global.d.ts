import * as React from 'react';
import type { ModelViewerElement } from '@google/model-viewer';

declare module 'gifenc';
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'model-viewer': React.DetailedHTMLProps<
          React.HTMLAttributes<ModelViewerElement> & {
            src?: string;
            alt?: string;
            'camera-orbit'?: string;
            'interaction-prompt'?: string;
            'disable-zoom'?: boolean;
            'auto-rotate-delay'?: string;
            // Додаємо нові атрибути, щоб TS не сварився:
            exposure?: string;
            'shadow-intensity'?: string;
            'shadow-softness'?: string;
            'environment-image'?: string;
          },
          ModelViewerElement
        >;
      }
    }
  }
}
