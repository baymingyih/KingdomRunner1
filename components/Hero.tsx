"use client"

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/kingdomrunnersdv1/o/tempimg%2FWhatsApp%20Image%202025-04-14%20at%2010.51.48%20PM.jpeg?alt=media&token=165e7ed4-89a3-462a-882a-cf43b4b68017')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
      </div>
      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg"
        >
          Run with Purpose, Pray with Passion
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl mb-8 text-white/90 drop-shadow"
        >
          Join our global community of runners united in faith
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-4 justify-center"
        >
          <Button className="bg-black/90 text-white hover:bg-black px-6 py-4 text-lg font-medium rounded-md transition-all duration-200 border-2 border-white hover:border-white/80">
            <Link href="/about">About Us</Link>
          </Button>

        </motion.div>
      </div>
    </section>
  );
}
