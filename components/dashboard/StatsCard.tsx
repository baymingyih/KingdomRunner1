"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

export function StatsCard({ title, value, subtitle, icon: Icon, gradient, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className={`${gradient} border-opacity-50 hover:shadow-lg transition-shadow`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && (
            <p className="text-xs mt-1 opacity-80">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}