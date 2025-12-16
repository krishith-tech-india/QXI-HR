import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoader } from '@/contexts/LoaderContext';
import { Loader2 } from 'lucide-react';

const GlobalLoader = () => {
  const { isLoading } = useLoader();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200]"
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 text-white animate-spin" />
            <p className="text-white text-lg font-medium">Loading...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;