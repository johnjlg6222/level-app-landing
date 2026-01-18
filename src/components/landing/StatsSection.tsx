'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Rocket, Clock, Star, Calendar } from 'lucide-react';

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

const Counter: React.FC<CounterProps> = ({ end, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const tick = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (endTime - startTime), 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(tick);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const stats = [
  {
    id: 1,
    value: 50,
    suffix: '+',
    label: 'Applications livrées',
    icon: Rocket,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    value: 30,
    suffix: ' jours',
    label: 'Livraison moyenne',
    icon: Clock,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    value: 100,
    suffix: '%',
    label: 'Clients satisfaits',
    icon: Star,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 4,
    value: 4,
    suffix: ' ans',
    label: "D'expérience",
    icon: Calendar,
    color: 'from-orange-500 to-red-500',
  },
];

export const StatsSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-[#050507]" id="stats">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Reveal key={stat.id} delay={idx * 0.1}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-[#0F1115]/60 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center relative group"
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} opacity-80 flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Counter */}
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
