'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const DevDocButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="border border-white/10 bg-black/30 backdrop-blur-sm hover:bg-white/10 transition-all"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        asChild
        >
        <Link href={"/docs"} className="flex items-center text-gray-300 hover:text-white transition-colors">
          <FileText className="w-5 h-5 mr-2" />
          Documentation
        </Link>
      </Button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 glass px-3 py-2 rounded text-sm text-gray-300 whitespace-nowrap"
          >
            Documentation technique
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-black/70"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DevDocButton;