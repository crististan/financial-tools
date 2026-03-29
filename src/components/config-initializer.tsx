'use client';

import { useEffect } from 'react';
import { initConfig } from '@/lib/local-storage';

export default function ConfigInitializer() {
  useEffect(() => {
    initConfig();
  }, []);
  return null;
}
