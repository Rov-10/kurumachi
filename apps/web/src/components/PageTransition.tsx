'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useContext, useState, ReactNode } from 'react';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Безпечний компонент для фіксації старої сторінки
function FrozenRoute({ children }: { children: ReactNode }) {
  const context = useContext(LayoutRouterContext);

  // Використовуємо ліниву ініціалізацію стану:
  // React бере поточний контекст лише в момент першого рендеру підкомпонента
  // і більше ніколи його не змінює всередині цього екземпляра.
  const [frozenContext] = useState(context);

  return (
    <LayoutRouterContext.Provider value={frozenContext}>{children}</LayoutRouterContext.Provider>
  );
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="w-full"
      >
        <FrozenRoute>{children}</FrozenRoute>
      </motion.div>
    </AnimatePresence>
  );
}
