import { useEffect, useState } from 'react';

interface Spark {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
}

export default function EmberSparks() {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    // Sinh 18 đốm lửa bập bùng ngẫu nhiên
    const items: Spark[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 95}%`,
      top: `${50 + Math.random() * 45}%`,
      size: 3 + Math.random() * 5,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
    }));
    setSparks(items);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {sparks.map((s) => (
        <span
          key={s.id}
          className="ember-particle"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

