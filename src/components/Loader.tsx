import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const PageLoader: React.FC<{ duration?: number; onComplete?: () => void }> = ({
  duration = 1800,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = duration / 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  useEffect(() => {
    if (progress >= 100 && onComplete) {
      onComplete();
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F5] text-[#2C2621]"
      id="global-page-loader"
    >
      <div className="text-center px-6 max-w-sm w-full">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-serif text-3xl md:text-4xl tracking-[0.25em] font-light uppercase"
        >
          MAISON AURA
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-[10px] tracking-[0.3em] text-[#7D7670] uppercase mt-2 font-mono"
        >
          HAUTE MAROQUINERIE
        </motion.p>

        {/* Elegant Micro Progress Bar */}
        <div className="h-[2px] w-full bg-[#EAE2D8] mt-12 overflow-hidden relative rounded-full">
          <motion.div
            className="h-full bg-[#BF986B] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[10px] font-mono tracking-widest text-[#7D7670] mt-3 block">
          {Math.round(progress)}%
        </span>
      </div>
    </motion.div>
  );
};

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-4 animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/5] w-full bg-neutral-200 rounded-2xl relative overflow-hidden" />

      {/* Title Details Skeleton */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex justify-between items-start">
          <div className="h-4 bg-neutral-200 rounded-md w-2/3" />
          <div className="h-4 bg-neutral-200 rounded-md w-1/5" />
        </div>
        <div className="h-3 bg-neutral-200 rounded-md w-1/3" />
        <div className="flex gap-1.5 mt-2">
          <div className="w-4 h-4 rounded-full bg-neutral-200" />
          <div className="w-4 h-4 rounded-full bg-neutral-200" />
          <div className="w-4 h-4 rounded-full bg-neutral-200" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};
