import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";

export default function EntityGraph({ centralEntity, relatedEntities }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw central entity
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Central node
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#3B82F6';
    ctx.fill();
    ctx.strokeStyle = '#60A5FA';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Central entity label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(centralEntity.identifier.substring(0, 15) + '...', centerX, centerY + 5);

    // Draw related entities
    const radius = 120;
    relatedEntities.forEach((entity, index) => {
      const angle = (index / relatedEntities.length) * 2 * Math.PI;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Connection line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Related node
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = entity.confidence > 0.7 ? '#10B981' : '#F59E0B';
      ctx.fill();
      ctx.strokeStyle = '#6B7280';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#D1D5DB';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      const text = entity.identifier.substring(0, 10) + (entity.identifier.length > 10 ? '...' : '');
      ctx.fillText(text, x, y - 30);
      
      // Confidence score
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '8px Inter';
      ctx.fillText(`${Math.round(entity.confidence * 100)}%`, x, y + 35);
    });

  }, [centralEntity, relatedEntities]);

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Network className="w-5 h-5" />
          Entity Relationship Graph
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gray-800 rounded-lg" style={{ height: '400px' }}>
          <canvas 
            ref={canvasRef} 
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
          {relatedEntities.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Network className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No related entities found</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400">Primary Entity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">High Confidence</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-400">Medium Confidence</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
