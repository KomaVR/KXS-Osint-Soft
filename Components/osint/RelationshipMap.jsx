import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link2, ExternalLink, Users, Globe } from "lucide-react";

export default function RelationshipMap({ entity, correlations, platforms }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Suggested Correlations */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Suggested Correlations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {correlations.map((correlation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="text-white font-mono text-sm">{correlation}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      Pattern Match
                    </Badge>
                    <span className="text-gray-400 text-xs">AI Generated</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {correlations.length === 0 && (
              <div className="text-center py-6">
                <Link2 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No correlations found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Platform Presence */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Potential Platform Presence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {platforms.map((platform, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">{platform}</p>
                    <p className="text-gray-400 text-sm">Potential profile match</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-500">
                    Unverified
                  </Badge>
                  <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {platforms.length === 0 && (
              <div className="text-center py-6">
                <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No platforms identified</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
